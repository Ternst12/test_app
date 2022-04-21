import React, {useState, useCallback} from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions, Alert} from "react-native";
import {LinearGradient} from "expo-linear-gradient"
import {WebView} from 'react-native-webview';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import {DotIndicator} from "react-native-indicators";
import Modal from "react-native-modal";
import ROSLIB from 'roslib';

const CameraViewScreen = props => {

  const [activity, setActivity] = useState(false)
  const [heightValue, setHeightValue] = useState("?")
  const [lengthValue, setLengthValue] = useState("?")
  const [angleValue, setAngleValue] = useState("?")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalText, setModalText] = useState("")
  const [cancelModal, setCancelModal] = useState(true)
  const [succes, setSucces] = useState(true)


  var succesStatus = 1
  var messages = []
  var timerValue = 0

  var ros = new ROSLIB.Ros();
 
 const calibration_diagnostic_sub = new ROSLIB.Topic({
  ros : ros,
  name : '/calibration_diagnostics',
  messageType : 'diagnostic_msgs/DiagnosticStatus'
});

 const goForwardButton = new ROSLIB.Topic({
  ros : ros,
  name : '/start_calibration',
  messageType : 'std_msgs/Bool'
});

const angleParam = new ROSLIB.Param({
  ros : ros,
  name : '/auger/angle'
 });

 const heightParam = new ROSLIB.Param({
  ros : ros,
  name : '/auger/height'
 });

 const lengthParam = new ROSLIB.Param({
  ros : ros,
  name : '/auger/length'
 });

const getCalibrationData = () => {
  componentDidMount();
  calibration_diagnostic_sub.subscribe(function(m) {
  console.log("m.level = ", m.level)  
  messages = messages.concat(m.message)
  succesStatus = m.level
  })
}


const componentDidMount = () => {
  try{
    ros.connect('ws://192.168.45.100:9090')
  } catch(error) {
    console.log("Problemer med forbindelsen = ", error)
  }
  ros.on('connection', function() {
  });  
  ros.on('error', function(error) {
    
    console.log("en fejl", error)
    setTimeout(() => {
      try{
        ros.connect('ws://192.168.45.100:9090')
      } catch(error) {
        console.log("Problemer med forbindelsen = ", error)
      }

    }, 3000)
  });
  ros.on('close', function() {
    console.log("its closed")
   
    setTimeout(() => {
      try{
        ros.connect('ws://192.168.45.100:9090')
      } catch(error) {
        console.log("Problemer med forbindelsen = ", error)
      }
    }, 3000)

});
};

  const radians_to_degrees = (radians) =>
  {
    var pi = Math.PI;
    return radians * (180/pi);
  }

  const getParams = () => {
    componentDidMount();
    console.log("getParams is active")
    angleParam.get(function(value) {
      const degrees = radians_to_degrees(value)
      setAngleValue(degrees.toFixed(1));
      console.log("Angle = ", value);
    });
    heightParam.get(function(value) {
      setHeightValue(value.toFixed(1));
      console.log("Height = ", value);
    });
    lengthParam.get(function(value) {
      setLengthValue(value.toFixed(1));
      console.log("Lenght = ", value);
    });

  }

  const calibrator = () => {
    componentDidMount();
    var go_forward_status = true
    var go_forward_msg = new ROSLIB.Message({data:go_forward_status});
    goForwardButton.publish(go_forward_msg);
  }

  function timeout() {
    setTimeout(function () {
      console.log("timerValue = ", timerValue)
      if(timerValue < messages.length){  
      console.log("længde = ", messages.length)
      setModalText(messages[timerValue])
      timerValue += 1;
      if(timerValue == messages.length){
        setActivity(false)
        setCancelModal(true)
      }
      timeout();
      } else {
        console.log("færdig")
        timerValue = 0
        clearTimeout();
      }
    }, 2000);
}

  const testAlertTimer = () => {
      setActivity(true)
      setModalVisible(true)
      setCancelModal(true)
      componentDidMount();
      calibrator();
      getCalibrationData();
      var lengthNumber = Math.round(Math.random() * 10)
      setModalText("Starting Calibration  ...")  
      
        
      setTimeout(() => {
      console.log(succesStatus)
      if(succesStatus == 0)
        {
          getParams();
          setSucces(true)
          timeout();
        } else {
          setSucces(false)
          timeout();
        }   
      }, 3000)   
  } 

    return(
    <View style={styles.container}>
      <LinearGradient 
      style={{width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center',}} 
      colors={["#FAA41E", "#FAFF91", "#ECE900"]} >
        <View style={{width: "90%", height: Dimensions.get("screen").height * 0.65}}>
            <View style={{width: "100%", paddingTop: 50, height: Dimensions.get("screen").height * 0.35}}>
              <WebView 
              style={{borderRadius: 70}} 
              scalesPageToFit={true}
              containerStyle={{borderRadius: 69, elevation: 20}}
              source={{uri:'http://192.168.45.100:8080/stream?topic=/image_rect_color'}}/>
            </View>
            <View style={{width: "100%", alignItems: "center", marginTop: 80, justifyContent: "center"}}>
              <TouchableOpacity style={{width: "40%", height: 90, backgroundColor: "#6FEC00", borderRadius: 45, alignItems: "center", justifyContent: "center"}} onPress={testAlertTimer}>
                <View style={{marginTop: -10}}>
                  <MaterialCommunityIcons name="tape-measure" size={40} color="white" />
                </View>
                <Text style={{color: "white", marginTop: 5, fontWeight: "700", fontSize: 15}}>Start kalibrering </Text>
              </TouchableOpacity>
            </View>
            {activity ? <ActivityIndicator style={{marginTop: 20}} color={"red"} size={"large"} /> : <View></View>}
        </View>
        <View style={{width: "100%", alignItems: "center", height: 300, justifyContent: "flex-end"}}>
          <View style={{position: "absolute", left: "2%", top: "40%"}}>
              <FontAwesome name="arrows-v" size={84} color="black" />
          </View>
          <View style={{position: "absolute", left: "6%", top: "49.5%"}}>
              <Text style={{fontSize: 22, fontWeight: "700", color: "blue"}}>{activity ? <ActivityIndicator color={"blue"} size={"small"}/> : heightValue}</Text>
          </View>
          <View style={{position: "absolute", left: "12%", top: "8%"}}>
              <FontAwesome name="arrows-h" size={84} color="black" />
          </View>
          <View style={{position: "absolute", left: "16.5%", top: "10%", flexDirection: "row"}}>
              <Text style={{fontSize: 22, fontWeight: "700", color: "blue"}}>{activity ? <ActivityIndicator color={"blue"} size={"small"}/> : lengthValue}</Text>
          </View>
          <View style={{position: "absolute", right: "24%", top: "62.5%", flexDirection: "row"}}>
              <Text style={{fontSize: 22, fontWeight: "700", color: "blue"}}>{activity ? <ActivityIndicator color={"blue"} size={"small"}/> : angleValue}</Text>
          </View>
          <View style={{position: "absolute", right: "19%", top: "60%", transform: [{rotate: "270deg"}]}}>
              <MaterialCommunityIcons name="angle-obtuse" size={74} color="black" />
          </View>
          
          <View style={{width: "100%", height: "90%", flexDirection: "row", justifyContent: "space-around"}}>
          
              <Image resizeMode="stretch" style={{width: "45%", height: "100%"}} source={require("../images/CartCreations/IdealFrontPerspektiv.png")}/>
           
            
              <Image resizeMode="stretch" style={{width: "45%", height: "100%"}} source={require("../images/CartCreations/IdealFuglePerspektiv.png")}/>
  
          </View>
        </View>
        <Modal isVisible={modalVisible} style={{alignItems: "center", }}>
          <View style={styles.modal}>
           {cancelModal ? <View style={{position: "absolute", right: 10, top: 10}}>
              <TouchableOpacity onPress={() => setModalVisible(false) }>
                <MaterialIcons name="cancel" size={30} color="black" />
              </TouchableOpacity>
            </View> : <View></View>}
            <View style={{marginBottom: activity ? -100 : 20, marginTop: activity ? 200 : 0}}>
              <Text style={styles.modalText}>{modalText}</Text>
            </View>
            <View>
             {activity ? <DotIndicator color="blue" size={10}/> : succes ? <FontAwesome5 name="smile-beam" size={40} color="green" /> : <FontAwesome5 name="sad-cry" size={40} color="red"/>}
            </View>
          </View>
          
        </Modal>
      </LinearGradient>
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
      backgroundColor: "white",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center"
    },
    modalText: {
      fontSize: 20,
      color: "grey"
    }
  });

export default CameraViewScreen;