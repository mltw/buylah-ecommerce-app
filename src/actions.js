import { REQUEST_ITEMS_PENDING, REQUEST_ITEMS_SUCCESS, REQUEST_ITEMS_FAILED, 
        VALID_USER, INVALID_USER,
        DELETE_ITEM_IN_CART, UPDATE_ITEM_IN_CART, CHECKOUT_ORDER_SUCCESS} from "./constants";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgQK1D1fnrto4i0CqGg9XhWbc0k_EtNaM",
  authDomain: "buylah-mltw.firebaseapp.com",
  projectId: "buylah-mltw",
  storageBucket: "buylah-mltw.appspot.com",
  messagingSenderId: "43961803360",
  appId: "1:43961803360:web:4dd3610ef8824f9aa8d905",
  measurementId: "G-L1C5PRX8P7"
};

initializeApp(firebaseConfig);
const db = getFirestore();

// helper function to save items into local storage
const setLocalStorage = (token) => {
    localStorage.setItem('token', token)
}
 
export const findInfo = (items, cartProductID) => {
    let i = 0;
    for (i=0; i < items.length; i++){
        if (items[i].id === cartProductID){
            const image = items[i].image;
            const price = items[i].price;
            const title = items[i].title;
  
            return {
                image: image,
                price: price,
                title: title
            }
        }
    }
}

export const registerUser = (userInput) => async (dispatch) => {
    try {
        // first, try creating a user for authentication purposes. This step will tell us
        // if a user with the same email has signed up before
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, userInput.email,  userInput.password)
        .then((userCredential) => {
            // Signed in 
            console.log("user created via registerUser func, will create doc now")

        })
        .then(async ()=>{
            const temp_token = uuidv4().toString()
            // if we can create the user at above, store the user's information
            const docRef = await addDoc(collection(db, "users"), {
                email: userInput.email,
                username: userInput.username,
                password: userInput.password,
                phone: userInput.phone,
                prefix: userInput.prefix,
                token: temp_token
            });
    
            console.log("Document written with ID: ", docRef.id);
            setLocalStorage(temp_token)
            dispatch({type: VALID_USER})
        })
        .catch(e=>{
            // If we can't create a user with the given email, it means there already exists such a user
            console.log("Error: ", e)
            alert("An account with this email has been created before. Try signing in.")
            dispatch({type: INVALID_USER})})
    }
    catch (e){
        console.log("Error creating user", e)
        dispatch({type: INVALID_USER})
    } 
}

// this 'dispatch' is taken from redux
export const requestItems = (input="") => async (dispatch) => {
    const fetchedItems = []
    // dispatch an object that is of type REQ_ROB_PENDING, no payload here
    dispatch({type: REQUEST_ITEMS_PENDING});

    try {
    // get data from products db
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log("input is", input)

        if (doc.data().title.toLowerCase().includes(input)){
            fetchedItems.push(doc.data());
        }
    })
    // fetch user shopping cart
    var docRef = doc(db, "shoppingcart", localStorage.getItem('token'));
    var docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } 
    else {
        // doc.data() will be undefined in this case
        // if no such db, create one
        console.log("couldnt get user cart in action.js, creating one ");
        
        docRef = doc(db, "shoppingcart", localStorage.getItem("token"));
        
        await setDoc(docRef, {
            products: []
        });
    }   

    docSnap = await getDoc(docRef);

    dispatch({type: REQUEST_ITEMS_SUCCESS, payload: fetchedItems, 
        cart: docSnap.data() === undefined? [] : docSnap.data().products })
    }
    catch(e){
        console.log("Error in requesting items",e)
        dispatch({type: REQUEST_ITEMS_FAILED, payload: e})
    }
}

export const validateUser = (userInput) => async (dispatch) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, userInput.email, userInput.password)
    .then(async (userCredential) => {

        // get user token from database
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().email === userInput.email){
                setLocalStorage(doc.data().token)
                dispatch({type: VALID_USER, email: userInput.email, password: userInput.password});
            }
        })
    })
    .catch((error) => {
        console.log("No such user", userInput.email, userInput.password)
        dispatch({type: INVALID_USER});
        alert("Invalid email/password");
    });
}

export const logoutUser = () => (dispatch) => {
    setLocalStorage("");
    dispatch({type: INVALID_USER});
}

export const requestUserDetails = () => async (dispatch) => {

    var userDetails = {
        username: "",
        phoneNumber: "",
        email: ""
    }

    // Initialize Firebase
    initializeApp(firebaseConfig);

    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "users"));
    
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().token === localStorage.getItem('token')){
            userDetails.username = doc.data().username;
            userDetails.phoneNumber = doc.data().prefix + doc.data().phone;
            userDetails.email = doc.data().email;
        }
    });

    dispatch({type: VALID_USER, userDetails: userDetails})
}

export const updateCart = (productID, productTitle, productPrice, productQty, action) => async (dispatch) => {
    var docRef = doc(db, "shoppingcart", localStorage.getItem("token"));
    var docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
        console.log("got user cart in action.js:", docSnap.data());
    } 
    else {
          // if no such db, create  one
        console.log("couldnt get user cart in action.js, creating one ");
        
        docRef = doc(db, "shoppingcart", localStorage.getItem("token"));
        
        await setDoc(docRef, {
            // create a dummy object when initialising the database
              products: [{
                  productID: productID,
                  productTitle: productTitle,
                  quantity: 0,
                  price: 0
                }
              ]
        });
    } 

    const newdocSnap = await getDoc(docRef);
    const temp = newdocSnap.data().products
    let i = 0;
    var oldQty = 0;

    for (i=0; i<temp.length; i++){
        if (temp[i].productID === productID){
            oldQty = temp[i].quantity
            break 
        }
    }
  
    if (action==='UPDATE' || action==='INCREMENT'){
          // remove the old version of product and oldQty
          await updateDoc(docRef, {
              products: arrayRemove({
              productID: productID,
              productTitle: productTitle,
              quantity: oldQty,
              price: productPrice * oldQty
              })
          });
          // add in the new version of product with updated qty
          await updateDoc(docRef, {
              products: arrayUnion({
              productID: productID,
              productTitle: productTitle,
              quantity: action === 'UPDATE' ? productQty : oldQty + 1,
              price: productPrice * (action === 'UPDATE' ? productQty : oldQty + 1)
              })
          });

          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
          }
          dispatch({type: UPDATE_ITEM_IN_CART, cart: docSnap.data().products})
      }
      else if (action === 'DELETE'){
          // remove the product from the shopping cart
          await updateDoc(docRef, {
              products: arrayRemove({
              productID: productID,
              productTitle: productTitle,
              quantity: oldQty,
              price: productPrice*oldQty
              })
          });
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        }
        dispatch({type: DELETE_ITEM_IN_CART, cart: docSnap.data().products})
  }
}
  
export const checkoutOrder = (userInput, formValues, cartItems) => async (dispatch) => {

    // document ID in firebase will be auto-generated
    const time= moment().format('MMMM Do YYYY, h:mm:ss a');
    var itemsArr = []
    for (let i = 0; i< cartItems.length; i++){
        itemsArr.push({
            productID: cartItems[i].productID,
            productTitle: cartItems[i].productTitle,
            quantity: cartItems[i].quantity,
            price: cartItems[i].price
        })
    }

    await addDoc(collection(db, "history"), {
        email: formValues.formEmail,
        username: formValues.formName,
        phone: formValues.formPhoneNum,
        address: formValues.formAddress,
        time: time,
        token: localStorage.getItem("token"),
        card: "**** **** **** " + userInput.cardnum.slice(-4),
        items: itemsArr
    });

    await deleteDoc(doc(db, "shoppingcart", localStorage.getItem("token")))

    const orderSummary = {
        time: time, 
        orderItems: itemsArr, 
        email: formValues.formEmail,
        username: formValues.formName,
        phone: formValues.formPhoneNum,
        address: formValues.formAddress, 
    }

    console.log(orderSummary)

    dispatch({type: CHECKOUT_ORDER_SUCCESS, cart: [], orderSummary: orderSummary})
}
  