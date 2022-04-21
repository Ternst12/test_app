import * as FileSystem from "expo-file-system"
import { insertCart, fetchCarts, drop, deleteCart, updateCarts} from "../../helpers/db" 

export const ADD_CART = "ADD_CART"
export const SET_CARTS = "SET_CARTS"
export const DELETE_CART = "DELETE_CART"
export const UPDATE_CART = "UPDATE_CART"
export const SELECT_CART = "SELECT_CART"

export const addCart = (Name, image, height, width, lenght) => {
    return async dispatch => {
      console.log("Image = ", image)

      var fileName = ""
      var newPath = ""

      if(image != "") {
      fileName = image.split('/').pop();
      newPath = FileSystem.documentDirectory + fileName;
      }
     
      console.log("newPath = ", newPath)
  
      try {
        if(newPath != "") {
        await FileSystem.moveAsync({
          from: image,
          to: newPath
        }); }
        const dbResult = await insertCart(
          Name,
          newPath,
          width,
          height,
          lenght
        );
        console.log(dbResult);
        dispatch({
          type: ADD_CART,
          cartData: {
            id: dbResult.insertId,
            name: Name,
            image: newPath,
            width: width,
            lenght: lenght,
            height: height
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
  };

  export const updateCart = (Name, image, height, width, lenght, id) => {
    return async dispatch => {
      console.log("Image = ", image)

      
      const fileName = image.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;
     
      console.log("newPath = ", newPath)
  
      try {
        await FileSystem.moveAsync({
          from: image,
          to: newPath
        }); 
        const dbResult = await updateCart(
          Name,
          newPath,
          width,
          height,
          lenght, 
          id
        );
        console.log(dbResult);
        dispatch({
          type: UPDATE_CART,
          cartData: {
            id: dbResult.insertId,
            name: Name,
            image: newPath,
            width: width,
            lenght: lenght,
            height: height
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
  };
  
  export const loadCarts = () => {
    return async dispatch => {
      try {
        const dbResult = await fetchCarts();
        console.log(dbResult);
        dispatch({ type: SET_CARTS, carts: dbResult.rows._array });
      } catch (err) {
        throw err;
      }
    };
  };

  export const DeleteCart = (id) => {
    return async dispatch => {
      try {
        const dbResult = await deleteCart(id);
        console.log("dbResult = ", dbResult)
        dispatch({type: DELETE_CART, cartId: id})
      } catch (err) {
        throw err;
      }
    };
  };

  export const dropCarts = () => {
    return async dispatch => {
      try {
        const dbResult = await drop();

      } catch (err) {
        throw err;
      }
    };
  };

  export const SelectCart = (id, name, image, height, width, length) => {
    return async dispatch => {
      try {
        console.log("name = ", name, " image = ", image, " height = ", height, " width = ", width, " length = ", length)
        dispatch({
          type: SELECT_CART, cartData: {
            id: id,
            name: name,
            image: image,
            height: height,
            width: width,
            length: length
          }
        })

      } catch (err) {
        throw err;
      }
    };
  }
  