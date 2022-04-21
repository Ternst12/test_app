import React, {useState, useLayoutEffect, useEffect, useCallback} from "react";
import {View, Button, Text, StyleSheet, Image, Alert, TextInput, Dimensions, TouchableOpacity} from "react-native"
import { useDispatch } from 'react-redux';
import * as CartsActions from "../store/actions/CartsActions"
import {FontAwesome5, MaterialIcons, Ionicons} from "@expo/vector-icons"
import CreateCartPages from "./CreateCartPages";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";

const marginOfIcons = Dimensions.get("screen").width * 0.04

const CartSelector = props => {

    const dispatch = useDispatch();

    const [imageTaken, setImageTaken] = useState(props.image)
    const [navn, setNavn] = useState(props.cartName)
    const [bredde, setBredde] = useState(props.cartWidth)
    const [højde, setHøjde] = useState(props.cartHeight)
    const [længde, setLængde] = useState(props.cartLength)
    const [index, setIndex] = useState(0)

 
    useEffect(()=> {
     setImageTaken(props.image)
     setNavn(props.cartName)
     setBredde(props.cartWidth)
     setHøjde(props.cartHeight)
     setLængde(props.cartLength)   
    }, [props.image, props.cartName, props.cartWidth, props.cartHeight, props.cartLength])

    const saveCart = useCallback(async(navn, imageUri, højde, bredde, længde) => {
        try {
        await dispatch(CartsActions.addCart(navn, imageUri, højde, bredde, længde));
        setNavn("Wagen Name")
        setBredde("")
        setImageTaken("")
        setLængde("")
        setHøjde("")
        } catch (e) {

        }  
    })

    useLayoutEffect(() => {
        props.navigation.setOptions({ 
            headerTitle: props => <Text style={{color: Colors.fallOragne, fontSize: 24}}>Wagen Übersicht</Text>,
            headerTitleAlign: "center",
            headerRight: () => (
                <TouchableOpacity style={{marginRight: 30}} onPress={() => {props.setModalVisible(true)}}>
                    <Ionicons name={"add-circle"} size={40} color={Colors.fallGreen}/>
                </TouchableOpacity>
            ),  
            })
        })
    

    return (
        <View>
        <View style={styles.CartSelector}>
            <View style={styles.imageField}>
                {props.editMode ?
                <TouchableOpacity style={styles.nameBox} onPress={() => {setIndex(0), props.setModalVisible(true)}}>
                    <Text style={styles.name}>{navn}</Text>
                </TouchableOpacity> :
                <View style={styles.nameBox}>
                    <Text style={styles.name}>{navn}</Text>
                </View>
                }
                {props.editMode ?
                <TouchableOpacity onPress={() => {setIndex(1), props.setModalVisible(true)}}>
                    <View style={styles.ImagePreview}>
                        {imageTaken ? <Image style={styles.image} source={{uri: imageTaken }}/> :
                        <Text style={styles.label}>Choose Image </Text>}
                    </View>
                </TouchableOpacity> :
                <View style={styles.ImagePreview}>
                    {imageTaken ? <Image style={styles.image} source={{uri: imageTaken }}/> :
                    <Text style={styles.label}>Choose Image </Text>}
                </View>
                }
            </View>
            <View style={styles.Illustration}>
                <View style={styles.HeightValueBox}>
                    <Text style={{color: "orange", fontSize: 25, fontWeight: "600"}}>{højde}</Text>
                </View>
                {props.editMode ?
                <TouchableOpacity style={styles.HeightArrow} onPress={() => {setIndex(2), props.setModalVisible(true)}}>
                       <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/HeightArrow.png")}/>
                </TouchableOpacity>:
                <View style={styles.HeightArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/HeightArrow.png")}/>
                </View>
                }
                <View style={styles.WidthValueBox}>
                    <Text style={{color: "blue", fontSize: 25, fontWeight: "600"}}>{bredde}</Text>
                </View>
                {props.editMode ?
                <TouchableOpacity style={styles.WidthArrow} onPress={() => {setIndex(3), props.setModalVisible(true)}}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/WidthArrow.png")}/>
                </TouchableOpacity> :
                <View style={styles.WidthArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/WidthArrow.png")}/>
                </View> 
                }
                <View style={styles.LengthValueBox}>
                    <Text style={{color: "green", fontSize: 25, fontWeight: "600"}}>{længde}</Text>
                </View>
                {props.editMode ?
                <TouchableOpacity style={styles.LengthArrow} onPress={() => {setIndex(4), props.setModalVisible(true)}}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/LengthArrow.png")}/>
                </TouchableOpacity>:
                <View style={styles.LengthArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/LengthArrow.png")}/>
                </View>
                }
                <View style={styles.CartIlustratorField}>
                    <View style={styles.CartImageContainer}>                  
                        <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={require("../images/CartCreations/GrainCart.png")} />
                    </View>
                </View>   
            </View>
        </View>

        <Modal isVisible={props.modalVisible} style={{alignItems: "center", }}>
          <View style={styles.modal}>
            <View style={{width: "100%", height: "100%"}}>
                
                <CreateCartPages 
                toogle={props.toogle}
                nameValue={navn}
                setNameValue={setNavn}
                imageValue={imageTaken}
                setImageValue={setImageTaken}
                hightValue={højde} 
                setHightValue={setHøjde} 
                hightValue={højde}
                setLengthValue={setLængde}
                lengthValue={længde}
                setWidthValue={setBredde}
                widthValue={bredde}
                setModalVisible={props.setModalVisible} 
                index={index}
                setIndex={setIndex}
                saveCart={saveCart}
                editMode={props.editMode}
                />
 
            </View> 
          </View>
          
        </Modal>


        </View>
    );
}

const styles = StyleSheet.create ({

  
    CartSelector: {
        paddingVertical: 10,
        height: "100%",
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
       
    },

    nameBox : {
        position: "absolute",
        top: Dimensions.get("screen").height * 0.02,
        zIndex: 5
    },

    name: {
        fontSize: 22,
        color: Colors.fallOragne
    },

    ImagePreview: {
        width: Dimensions.get("screen").width * 0.25,
        height: Dimensions.get("screen").width * 0.25,
        marginBottom: 0,
        borderRadius: Dimensions.get("screen").width * 0.15,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "grey",
        borderWidth: 2,
        overflow: "hidden"
    },

    imageField : {
        width: "30%",
        height: "100%",
        borderRightColor: "grey",
        borderRightWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    label: {
        color: Colors.fallGreen,
        fontSize: 22,
        fontWeight: "bold"

    },
    image: {
        width: "100%",
        height: "100%",
    },

    Illustration: {
        width: "100%",
        height: "100%"
    },

    HeightArrow: {
        position: "absolute",
        left: "60%",
        top: "8%",
        width: "3%",
        height: "35%",
        zIndex: 5
        
    },

    HeightValueBox: {
        position: "absolute",
        left: "64%",
        top: "20%",
    },

    WidthArrow: {
        position: "absolute",
        left: "6%",
        top: "82%",
        width: "10%",
        height: "15%",
        zIndex: 5
    },

    WidthValueBox: {
        position: "absolute",
        left: "3%",
        top: "91%",
    },

    LengthArrow: {
        position: "absolute",
        left: "15%",
        top: "8%",
        width: "25%",
        height: "25%",
        zIndex: 5
    },

    LengthValueBox: {
        position: "absolute",
        left: "22%",
        top: "10%",
    },

    CartIlustratorField: {
        width: "70%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },

    CartImageContainer: {
        width: "90%",
        height: "95%"
    },

    modal: {
        height: Dimensions.get("screen").height * 0.3,
        width: Dimensions.get("screen").width * 0.6,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
      },
      modalText: {
        fontSize: 20,
        color: "grey"
      }

});

export default CartSelector;