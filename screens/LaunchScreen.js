import React, {useRef, useState, useEffect, useCallback} from "react"
import { View, Text, Button, StyleSheet, Dimensions, TouchableOpacity} from "react-native"
import Modal from "react-native-modal";
import { Video} from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import * as CartsActions from "../store/actions/CartsActions"
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Colors from "../constants/Colors";

export default LaunchScreen = props => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [errorMessage, setErrorMessage] = useState(false);
    const [modalVisible, setModalVisible] = useState(true)
    const [background, setBackGrond] = useState("black")
    const [selectedValue, setSelectedValue] = useState("");
    const carts = useSelector(state => state.carts.carts)
    const dispatch = useDispatch();

    
    useEffect(() =>{
        dispatch(CartsActions.loadCarts())
      }, [dispatch]);

    const selectCart = useCallback(async(id, name, image, height, width, length) => {
        try {
            await dispatch(CartsActions.SelectCart(id, name, image, height, width, length ))
        } catch (error) {
            console.log(error)
        }
    })

    const noCartsOption = {
        name: "Add your cart information"
    }

    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: background}}>
        <Video
          shouldPlay={true}
          ref={video}
          style={{width: Dimensions.get("window").width, height: Dimensions.get("screen").height * 0.6, borderRadius: 40}}
          source={require("../animation/UnloadSyncLaunch.mp4")}
          useNativeControls={false}
          resizeMode="stretch"
          isLooping={false}
          onPlaybackStatusUpdate={status => {
              setStatus(() => status); 
              if(status.positionMillis > 8000){
                  setBackGrond("grey")
              }
              if(status.didJustFinish == true){
                  setModalVisible(true)
                }
        }}
        />
         
        <View>
         
         <Modal isVisible={modalVisible} style={{alignItems: "center", }}>
          <View style={styles.modal}>
            <View style={{position: "absolute", right: 20, bottom: 20}}>
                <TouchableOpacity onPress={() => {
                    if(selectedValue == "") {
                        setErrorMessage(true)
                    } else {
                    selectCart(selectedValue.id, selectedValue.name, selectedValue.imageUri, selectedValue.heigt, selectedValue.width, selectedValue.lenght)
                    props.navigation.navigate("Main", {
                        screen: selectedValue.name == "Create a cart" ? "Carts" : "Home", 
                    })
                    console.log(selectedValue)
                    setModalVisible(false) 
                }
                }}>
                    <Text style={styles.modalText}>Go</Text>
                </TouchableOpacity>
            </View>

            <SelectDropdown
                data={carts.length > 0 ? carts : noCartsOption}
                onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index)
                    setSelectedValue(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem.name
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item.name
                }}
                defaultButtonText="Choose your cart"
                
            />
            {errorMessage ? <Text style={{color: "red", fontWeight: "bold"}}>You have to choose a cart</Text> : <Text></Text>}
            
          </View>
          
        </Modal>
        </View>
      </View>
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    modal: {
      height: Dimensions.get("screen").height * 0.4,
      width: Dimensions.get("screen").width * 0.6,
      backgroundColor: Colors.fallGrey,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center"
    },
    modalText: {
      fontSize: 22,
      fontWeight: "700",
      color: Colors.fallGreen
    }
  });