import { ADD_CART, SET_CARTS, DELETE_CART, UPDATE_CART, SELECT_CART} from '../actions/CartsActions';
import carts from '../../models/carts';

const initialState = {
  carts: [],
  selectedCart: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CARTS:
      return {
        carts: action.carts.map(
          pl =>
            new carts(
              pl.id.toString(),
              pl.name,
              pl.imageUri,
              pl.width,
              pl.length,
              pl.height
            )
        )
      };
    case ADD_CART:
      const newPlace = new carts(
        action.cartData.id.toString(),
        action.cartData.name,
        action.cartData.image,
        action.cartData.width,
        action.cartData.length,
        action.cartData.height
      );
      return {
        carts: state.carts.concat(newPlace)
      };
    case UPDATE_CART:
      const cartIndex = state.carts.findIndex(
        cart => cart.id === action.id
        );
        const updatedCart = new Product(
            action.cartData.id, 
            action.cartData.name,
            action.cartData.image,
            action.cartData.width,
            action.cartData.length,
            action.cartData.height,

            );
        
        const updatedCarts = [...state.carts]
        updatedCarts[cartIndex] = updatedCart
        return {
            ...state, 
            carts: updatedCarts
        }
    case DELETE_CART:
      return {
        ...state, 
        carts: state.carts.filter(
            cart => cart.id !== action.cartId
        ),
      }
    case SELECT_CART:
      console.log("Selected cart name = ", action.cartData.name, " image = ", action.cartData.image,  " height = ", action.cartData.height, " width = ", action.cartData.width, " length = ",  action.cartData.length)
      return {
        ... state,
        selectedCart: new carts(
          action.cartData.id,
          action.cartData.name,
          action.cartData.image, 
          action.cartData.width,
          action.cartData.length,
          action.cartData.height
        )
      }
    default:
      return state;
  }
};
