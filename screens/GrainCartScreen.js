import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CartSelector from '../components/CartsSelector';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import CartItem from '../components/CartItem';

import * as CartsActions from "../store/actions/CartsActions"

var bs = React.createRef();
var fall = new Animated.Value(1);


const GrainCartScreen = props => {

  const carts = useSelector(state => state.carts.carts)
  const [nameEdit, setNameEdit] = useState("Cart Name");
  const [selectedImage, setSelectedImage] = useState("");
  const [heightEdit, setHeightEdit] = useState("");
  const [widthEdit, setWidthEdit] = useState("");
  const [lenghtEdit, setLengthEdit] = useState("");
  const [cartId, setCartId] = useState()
  const [editMode, setEditMode] = useState(false);
  const [createCartModal, setCreateCartModal] = useState(false)
  

  useEffect(() =>{
    dispatch(CartsActions.loadCarts())
  }, [dispatch]);

  const setCartToEdit = (id, name, imageUri, height, length, width) => {
    console.log("that was a long press");      
    Alert.alert(
              "You have seleceted a cart",
              "what do you want to do with it?",
              [
                {
                  text: "Select the cart",
                  onPress: () => {
                    dispatch(CartsActions.SelectCart(id, name, imageUri, height, width, length))
                    props.navigation.navigate("Home")
                  }
                },
                {
                  text: "Edit",
                  onPress: () => {
                    setSelectedImage(imageUri); 
                    setNameEdit(name); 
                    setHeightEdit(height);
                    setWidthEdit(width);
                    setLengthEdit(length);
                    setEditMode(true)
                  },
                  style: "OK"
                },
                { text: "Delete", onPress: () => dispatch(CartsActions.DeleteCart(id))}
              ]
            );
    }
        



  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>You havent created a cart yet</Text>
        <Text style={styles.panelSubtitle}>{"We need some information about the cart you are planning the use.\nPlease have the dimensions of the trolley's height, length and width ready."}</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Why do you need the information ?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {bs.current.snapTo(1); setCreateCartModal(true)}}>
        <Text style={styles.panelButtonTitle}>Create your cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {bs.current.snapTo(1); props.navigation.navigate("Home")}}>
        <Text style={styles.panelButtonTitle}>Do it Later</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const dispatch = useDispatch();


  return (

    <View style={{flex: 1}}>
      <BottomSheet
        ref={bs}
        snapPoints={[630, -5]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 0,
          flex: 1, 
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
        <View style={styles.form}>
          <View style={{height: "100%", width: "98%", justifyContent: "center"}}>
            <CartSelector 
            editMode={editMode}
            cartName={nameEdit}
            cartHeight={heightEdit}
            cartWidth={widthEdit}
            cartLength={lenghtEdit}
            modalVisible={createCartModal} 
            setModalVisible={setCreateCartModal} 
            image={selectedImage} 
            navigation={props.navigation} 
            toogle={() => bs.current.snapTo(0)}/>
          </View>
          
        </View>
        <FlatList 
        data={carts} 
        extraData={carts}
        keyExtractor={item => item.id}
        numColumns={1}
        renderItem={itemData => (
        <CartItem 
        onSelect={() => {
          setCartToEdit(
            itemData.item.id, 
            itemData.item.name, 
            itemData.item.imageUri, 
            itemData.item.heigt, 
            itemData.item.lenght, 
            itemData.item.width
            )
        }}
        name={itemData.item.name} 
        height={itemData.item.heigt}
        length={itemData.item.lenght}
        width={itemData.item.width}
        image={itemData.item.imageUri} 
        Delete={() => dispatch(CartsActions.DeleteCart(itemData.item.id))}
        
        />
        )}    
        />
      </Animated.View>
    </View>
  );
};



const styles = StyleSheet.create({
  form: {
    alignItems: "center",
    height: "40%",
    width: "100%",
    backgroundColor: "white",
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  },

  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '90%',
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#333333',
    shadowOffset: {width: -0, height: 6},
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 30,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -0.5, height: -0.5},
    shadowRadius: 0,
    shadowOpacity: 0.1,
    elevation: 30,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "90%",
    marginHorizontal: Dimensions.get("screen").width * 0.05
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 18,
    textAlign: "center",
    color: 'gray',
    height: 60,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
});

export default GrainCartScreen;
