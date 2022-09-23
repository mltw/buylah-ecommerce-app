import { REQUEST_ITEMS_PENDING, REQUEST_ITEMS_SUCCESS, REQUEST_ITEMS_FAILED, 
        VALID_USER, INVALID_USER,
        // REQUEST_CART_PENDING, REQUEST_CART_SUCCESS, REQUEST_CART_FAILED,
        DELETE_ITEM_IN_CART, UPDATE_ITEM_IN_CART, CHECKOUT_ORDER_SUCCESS } from "./constants";

const initialStateItems = {
    isPending: false,
    items: [],
    error: "",
    cart: [],
    orderSummary: {} 
}

export const requestItems = (state=initialStateItems, action={}) => {
    switch (action.type){
        case REQUEST_ITEMS_PENDING:
            return {...state, isPending: true};
        case REQUEST_ITEMS_SUCCESS:
            return {...state, items: action.payload, isPending: false, cart: action.cart};
        case REQUEST_ITEMS_FAILED:
            return {...state, error: action.payload, isPending: false}

        case DELETE_ITEM_IN_CART:
            return{...state, isPending:false, cart:action.cart};
        case UPDATE_ITEM_IN_CART:
            return{...state, isPending:false, cart:action.cart}; 
        
        case CHECKOUT_ORDER_SUCCESS:
            return{...state, isPending:false, cart:action.cart, orderSummary: action.orderSummary}
        default:
            return state
    }
}

const initialStateUser ={
    userDetails: {
        username: "",
        phoneNumber: "",
        email: ""
    },
    valid: false,
}

export const validateUser = (state=initialStateUser, action={}) => {
    switch (action.type){
        case VALID_USER:
            return {...state, valid: true, userDetails: action.userDetails}
        case INVALID_USER:
            return {...state, valid: false}
        default:
            return state
    }
}
