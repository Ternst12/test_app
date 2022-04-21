import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, Platform } from 'react-native';
import Colors from "../constants/Colors"
import { useState } from 'react';
import * as ImagePicker from "expo-image-picker"

const marginOfIcons = Dimensions.get("screen").width * 0.04

const setNewIndex = (setIndex, index) => {
    setIndex(index + 1); 
}


const inputField = (errorMessage, setErrorMessage, editMode, title, setValue, value, valueName, arrowPath, setValueForSaving, setModalVisible, index, setIndex, saveCart, name, image, height, width, lenght) => {

    var createCart = false

    if(index == 4 && editMode == false){     
        createCart = true
    }

    return (
        <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
            <View style={{width: "100%", alignItems: "center"}}>
                <Text style={valueName != "Name" ? styles.title : styles.titleName}>{title}</Text>
            </View>
            <View><Text style={styles.errorMessage}>{errorMessage}</Text></View>
            {valueName != "Name" ?
            <View style={{width: "100%", flexDirection:"row", justifyContent: "space-between", alignItems: "center"}}>
                <View style={valueName == "Length" || valueName == "Width" ? styles.lengthOrWidthArrow : styles.HeightArrow}>
                    <Image resizeMode="stretch" style={{width: "100%", height: "100%"}} source={arrowPath}/>
                </View>
                <View style={styles.inputBox}> 
                    <TextInput  style={styles.inputField}
                                onChangeText={(text) => {setValue(text); setValueForSaving(text)}}
                                value={value}
                                keyboardType="numeric"
                                maxLength={4}
                                textAlign={"right"}
                    />
                    <View style={styles.labelBox}>
                        <Text style={styles.labelInputText}>{valueName}</Text> 
                    </View>
                </View> 
            </View> :
             <View style={{width: "100%", flexDirection:"row", justifyContent: "center", alignItems: "center",  marginTop: -30}}> 
                <View style={styles.inputBoxName}> 
                    
                    <TextInput  style={styles.inputFieldName}
                                onChangeText={(text) => {setValue(text); setValueForSaving(text)}}
                                value={value}
                                keyboardType={valueName != "Name" ? "number-pad" : "default"}
                                maxLength={valueName != "Name" ? 4 : 20}
                                textAlign={"right"}
                                clearTextOnFocus={true}
                    />
                    <View style={styles.labelBox}>
                        <Text style={styles.labelInputText}>{valueName}</Text> 
                    </View>
                </View> 
            </View>
            }
            <View style={{ position: "absolute", right: marginOfIcons, bottom: marginOfIcons}}>     
             {createCart ? <TouchableOpacity onPress={() => {
                    console.log("Value = ", value)
                    if(value <= 0 || value > 30) {
                        setErrorMessage( "Der angegebene Wert ist fehlerhaft- Bitte geben sie denn korekten Messwert an")
                    } else if (value == "" || value == undefined) {
                        setErrorMessage( "Geben Sie bitte einen Wert ein")
                    } else {
                    setErrorMessage("")
                    saveCart(name, image, height, width, lenght); 
                    setModalVisible(false)
                    setIndex(0)
                    }
                 }}>
                    <Text style={styles.nextText}>Speichern</Text>
                </TouchableOpacity> 
                :
                editMode ?
                <TouchableOpacity onPress={() => {setModalVisible(false); setIndex(0)}}>
                    <Text style={styles.nextText}>Ok</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => {
                    
                    console.log("Value = ", value)
                    if(value <= 0 || value > 30) {
                        setErrorMessage("Der angegebene Wert ist fehlerhaft - Bitte geben sie denn korekten Messwert an")
                    } else if (value == "" || value == "Wagen Name") {
                        valueName == "Name" ? setErrorMessage("Geben sie Bitte einen Namen für ihren Wagen an") : setErrorMessage( "Geben Sie bitte einen Wert ein") 
                    } else {
                        setErrorMessage("")
                        setNewIndex(setIndex, index)
                        }
                    }}>
                <Text style={styles.nextText}>Weiter</Text>
                </TouchableOpacity> 
            }
            </View>
            <View style={{ position: "absolute", left: marginOfIcons, bottom: marginOfIcons}}>
                <TouchableOpacity onPress={() => {setModalVisible(false); setIndex(0)}}>
                    <Text style={styles.nextText}>Abbrechen</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}



const chooseImageField = (editMode, choosePhotoFromLibrary, takeImage, value, setValue, setValueForSaving, index, setIndex, setModalVisible) => {
 

        return(
            <View style={{width: "100%", height: "100%", flexDirection: "row"}}>
                <View style={styles.imageField}>                 
                        <View style={styles.ImagePreview}>
                            {value ? <Image style={styles.image} source={{uri: value }}/> :
                            <Text style={styles.label}>Wähle ein Bild aus {"\n"} {"(Optional)"}</Text>}
                        </View>
                </View>
                <View style={styles.imageField}>                 
                    <TouchableOpacity style={styles.imageOptions} onPress={ () => choosePhotoFromLibrary(setValue, setValueForSaving)}>
                        <View style={styles.imageOptionLabels}>
                            <Text style={styles.imageOptionsLabelText}>Suche nach einem gespeicherten Foto</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageOptions} onPress={ () =>  takeImage(setValue, setValueForSaving)}>
                        <View style={styles.imageOptionLabels} >
                            <Text style={styles.imageOptionsLabelText}>Mach ein neues Foto</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {!editMode ?
                <View style={{ position: "absolute", right: marginOfIcons, bottom: marginOfIcons}}>
                    <TouchableOpacity onPress={() => setNewIndex(setIndex, index)}>
                        <Text style={styles.nextText}>Weiter</Text>
                    </TouchableOpacity>
                </View>:
                <View style={{ position: "absolute", right: marginOfIcons, bottom: marginOfIcons}}>
                    <TouchableOpacity onPress={() => {setIndex(0); setModalVisible(false)}}>
                        <Text style={styles.nextText}>Ok</Text>
                    </TouchableOpacity>
                </View>
                }
                <View style={{ position: "absolute", left: marginOfIcons, bottom: marginOfIcons}}>
                    <TouchableOpacity onPress={() => {setIndex(0); setModalVisible(false)}}>
                        <Text style={styles.nextText}>Abbrechen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


const CreateCartPages = props => {

    const [errorMessage, setErrorMessage] = useState("")
    const [height, setHeight] = useState("")
    const [width, setWidth] = useState("")
    const [length, setLength] = useState("")
    const [image, setImage] = useState("")
    const [name, setName] = useState("")

    
    const choosePhotoFromLibrary = async(setImageTaken, setValueForSaving) => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4,3],
          quality: 1
        })
        console.log("resultat: ", result);
        if (!result.cancelled) {
        setImageTaken(result.uri);
        setValueForSaving(result.uri)
        }
      };
    
      const verifyPermissions = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync()
        if(status !== "granted"){
          Alert.alert(
              "Insufficient permissions", 
              "you need to grant camera permission to use this app", 
              [{text: "Understood"}]
              )
          return false;    
          };
        return true;
      }
    
      const takeImage = async (setImageTaken, setValueForSaving) => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 12],
            quality: 1 // lowest 0.1 highest 1
        });
    
        console.log(image)
        setImageTaken(image.uri)
        setValueForSaving(image.uri)
    }

    var arrayTest =
        [
            inputField(errorMessage, setErrorMessage, props.editMode, "Bitte geben sie einen Namen für ihren Wagen an", props.setNameValue, props.nameValue, "Name", require("../images/CartCreations/HeightArrow.png"), setName, props.setModalVisible, props.index, props.setIndex),
            chooseImageField(props.editMode, choosePhotoFromLibrary, takeImage, props.imageValue, props.setImageValue, setImage, props.index, props.setIndex, props.setModalVisible),
            inputField(errorMessage, setErrorMessage, props.editMode, "Wie hoch ist dein Wagen?", props.setHightValue, props.hightValue, "Height", require("../images/CartCreations/HeightArrow.png"), setHeight, props.setModalVisible, props.index, props.setIndex, props.saveCart), 
            inputField(errorMessage, setErrorMessage, props.editMode, "Wie breit ist dein Wagen?", props.setWidthValue, props.widthValue, "Width", require("../images/CartCreations/WidthArrow.png"), setWidth,props.setModalVisible, props.index, props.setIndex, props.saveCart),
            inputField(errorMessage, setErrorMessage, props.editMode, "Wie lang ist dein Wagen?", props.setLengthValue, props.lengthValue, "Length", require("../images/CartCreations/LengthArrow.png"), setLength, props.setModalVisible, props.index, props.setIndex, props.saveCart, name, image, height, width, length),
        ]

    useEffect(() => {
        arrayTest.length = 0;
        arrayTest =  [
            inputField(errorMessage, setErrorMessage, props.editMode, "Bitte geben sie einen Namen für ihren Wagen an",  props.setNameValue, props.nameValue, "Name", require("../images/CartCreations/HeightArrow.png"), setName, props.setModalVisible, props.index, props.setIndex,),
            chooseImageField(props.editMode, choosePhotoFromLibrary, takeImage, props.imageValue, props.setImageValue, setImage, props.index, props.setIndex, props.setModalVisible),
            inputField(errorMessage, setErrorMessage, props.editMode, "Wie hoch ist dein Wagen?", props.setHightValue, props.hightValue, "Height", require("../images/CartCreations/HeightArrow.png"), setHeight, props.setModalVisible, props.index, props.setIndex, props.saveCart), 
            inputField(errorMessage, setErrorMessage, props.editMode, "Wie breit ist dein Wagen?", props.setWidthValue, props.widthValue, "Width", require("../images/CartCreations/WidthArrow.png"), setWidth,props.setModalVisible, props.index, props.setIndex, props.saveCart), 
            inputField(errorMessage, setErrorMessage, props.editMode, "Wie lang ist dein Wagen?", props.setLengthValue, props.lengthValue, "Length", require("../images/CartCreations/LengthArrow.png"), setLength, props.setModalVisible, props.index, props.setIndex, props.saveCart, image, height, width, length),
        ]
    }, [props.editMode, props.nameValue, props.setNameValue, props.setModalVisible, props.index])

    const testArray = (index) => {
        return(
             <View style={styles.container}>
                 {arrayTest[index]}
                 <Text></Text>
             </View>
         )
     }

    return (
        <View>
            {testArray(props.index)}
        </View>
    );
};

export default CreateCartPages;

const styles = StyleSheet.create({

  errorMessage: {
    textAlign: "center",
    color: "red",
    marginVertical: 5
  },

  imageOptions: {
    height: "20%",
    width: "85%",
    borderRadius: 20,
    backgroundColor: Colors.fallOragne,
    marginVertical: 10,
    marginBottom: 40,
  },

  imageOptionLabels: {
      width: "100%", 
      height: "100%", 
      alignItems: "center", 
      justifyContent: "center"
    },

    boxShadow: {
        shadowColor: "blue",
        shadowOffset: {width: 50, height: 50},
        shadowRadius: 5,
        shadowOpacity: 1
    },

  imageOptionsLabelText: {
    fontSize: 20,
    color: Colors.fallWhite,
    fontWeight: "bold",
    textAlign: "center"
  },

  container: {
    height:"100%",
    backgroundColor: Colors.fallGrey, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 20,
  },

  ImagePreview: {
    width: Dimensions.get("screen").width * 0.25,
    height: Dimensions.get("screen").width * 0.25,
    borderRadius: Dimensions.get("screen").width * 0.15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.fallWhite,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 40
    },

    imageField : {
        marginTop: 7,
        justifyContent: "center",
        height: "100%",
        width: "50%",
        alignItems: "center"
    },

    test: {
        flexDirection: "column"
    },

    label: {
        color: Colors.fallOragne,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold"

    },
    image: {
        width: "100%",
        height: "100%",
    },

  title: {
    marginLeft: 20,
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.fallGreen
  },

  titleName: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.fallGreen
  },

  HeightArrow: {
    width: "5%",
    height: "45%",
    marginLeft: marginOfIcons,
    color: Colors.fallGreen
  },

  lengthOrWidthArrow : {
    width: "15%",
    height: "45%",
    marginLeft: marginOfIcons,
    color: Colors.fallGreen
  },

  inputField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    paddingRight: 10,
    marginHorizontal: 25,
    width: "40%", 
    backgroundColor: "white"
  },

  inputFieldName: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    paddingRight: 10,
    marginHorizontal: 25,
    width: "60%", 
    backgroundColor: "white"
  },

labelBox : {
    backgroundColor: Colors.fallOragne,
    flex: 1,
    position: "relative",
    borderLeftColor: Colors.fallWhite,
    borderLeftWidth: 0.8,
    right: 0,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
},
labelInputText: {
    fontSize: 25,
    color: Colors.fallWhite,
    fontWeight: "bold",
    marginLeft: 10,
},
inputBox : {
    height: 70,
    backgroundColor: Colors.fallOragne,
    width: "60%",
    flexDirection: "row",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: marginOfIcons,
},

inputBoxName : {
    marginTop: 40,
    height: 70,
    backgroundColor: Colors.fallOragne,
    width: "80%",
    flexDirection: "row",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center", 
},

inputBoxNameShadow : {
    marginTop: 40,
    height: 70,
    backgroundColor: Colors.fallOragne,
    width: "80%",
    flexDirection: "row",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center", 
    shadowColor: "blue",
    shadowOffset: {width: 50, height: 50},
    shadowRadius: 5,
    shadowOpacity: 1
},

nextText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.fallGreen
}
  
});