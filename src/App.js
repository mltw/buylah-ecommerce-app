import { React, Component } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cart from './components/Cart';
import { connect } from 'react-redux';
import { requestItems, validateUser, registerUser, logoutUser, updateCart, checkoutOrder, requestUserDetails } from './actions';
import Redirect from './components/Redirect';
import Checkout from './components/Checkout';

function RequireAuth({ children, redirectTo }) {
    let isAuthenticated = 
        (localStorage.getItem("token") === undefined || localStorage.getItem("token") === "")
        ? false : true  ;
    console.log("isAuthenticated is", isAuthenticated)
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

// this func says what state to listen to and send it out as props
const mapStateToProps = (state) => {
  return{
    items: state.requestItems.items,
    isPending: state.requestItems.isPending,
    err: state.requestItems.err,
    cart: state.requestItems.cart,
    orderSummary: state.requestItems.orderSummary,
    userDetails: state.validateUser.userDetails,
    valid: state.validateUser.valid,
    isModalVisible: state.validateUser.isModalVisible
  }
}

// what props i should listen to that are actions, that need to get dispatched
const mapDispatchToProps = (dispatch) => {
  return{
    onRequestItems: (searchBoxInput) => dispatch(requestItems(searchBoxInput)),
    onValidateUser: (userInput) => dispatch(validateUser(userInput)),
    onRegisterUser: (userInput) => dispatch(registerUser(userInput)),
    onLogoutUser: () => dispatch(logoutUser()),
    onRequestUserDetails: () => dispatch(requestUserDetails),
    onUpdateCart: (productID, productTitle, productPrice, productQty, action) => dispatch(updateCart(productID, productTitle, productPrice, productQty, action)),
    onCheckoutOrder: (userInput, formValues, cartItems) => dispatch(checkoutOrder(userInput, formValues, cartItems))
  }
}

class App extends Component{

  render(){
    const userToken = localStorage.getItem("token")
    
    const isLoggedIn = (userToken === "" || userToken === undefined) ? false : true

    const { items, onLogoutUser, cart, valid, userDetails, onRequestUserDetails, 
            onRequestItems, orderSummary, onUpdateCart, onCheckoutOrder } = this.props;

    const commonProps ={
        items: items,
        logoutFunc: onLogoutUser,
        func: onRequestItems,
        onUpdateCart: onUpdateCart
    }

    // const isLoggedIn = true

    return (
    <Router>
        <Routes>
            <Route exact path="/" element={ (isLoggedIn || valid) ? <Navigate to={"/home"} /> : <Signin prop={this.props}/>} />
            <Route path="/signup" element={ (isLoggedIn || valid) ? <Navigate to={"/home"} /> : <Signup prop={this.props}/>}  />
            <Route
                path="/cart"
                element={
                <RequireAuth redirectTo="/">
                    <Cart {...commonProps} onRequestUserDetails={onRequestUserDetails} cart = {cart}/>
                </RequireAuth>
                }
            />
            <Route
                path="/home"
                element={
                // <RequireAuth redirectTo="/">
                    <Home {...commonProps}/>
                // </RequireAuth>
                }
            />
            <Route
                path="/cart/checkout"
                element={
                <RequireAuth redirectTo="/">
                    {<Checkout {...commonProps} onCheckoutOrder={onCheckoutOrder} 
                                orderSummary={orderSummary} cart={cart} userDetails={userDetails}/>}
                </RequireAuth>
                }
            />             

          <Route path="*" element={<Redirect promptSignIn={!isLoggedIn}/>} />

        </Routes>
    </Router>
    )}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);