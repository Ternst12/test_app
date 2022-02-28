import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import { useState, useLayoutEffect, useEffect} from 'react';
import {FontAwesome5} from "@expo/vector-icons"
import ROSLIB from 'roslib';


const HomeScreen = props => {

    const knob = require("../MicrosoftTeams-image.png")
    const [positionX, setPositionX] = useState("0%")
    const [positionZ, setPositionZ] = useState("0%")
    const [positionXBorderStopLeft, setPositionXBorderStopLeft] = useState(false)
    const [positionXBorderStopRight, setPositionXBorderStopRight] = useState(false)
    const [positionZBorderStop, setPositionZBorderStop] = useState(false)
    const [positionZText, setPositionZText] = useState("0%")
    const [connected, setConnected] = useState(false)
  
  var ros = new ROSLIB.Ros();

  useEffect(() => {
      componentDidMount();
  }, [])

  const componentDidMount = () => {

    

    try{
        ros.connect('ws://192.168.45.100:9090')
    } catch(error) {
      console.log("Problemer med forbindelsen = ", error)
    }

    ros.on('connection', function() {
      setConnected(true)
      console.log("It Works :-)")
    });
    
    ros.on('error', function(error) {
      setConnected(false)
      console.log("en fejl", error)
      setTimeout(() => {
        try{
          ros.connect('ws://192.168.45.100:9090')
        } catch(error) {
          console.log("Problemer med forbindelsen = ", error)
        }

      }, 3000)
    });

    //192.168.45.100
    ros.on('close', function() {
      console.log("its closed")
      setConnected(false)
      setTimeout(() => {
        try{
          ros.connect('ws://192.168.45.100:9090')
        } catch(error) {
          console.log("Problemer med forbindelsen = ", error)
        }

      }, 3000)
  
  });
  };

  const getData = () => {
    console.log("Pressed");
    componentDidMount();
    var wagon_pose_sub = new ROSLIB.Topic({
    
      ros : ros,
      name : '/wagon_pose',
      messageType : 'wagon_detection/WagonPose'
    });


    wagon_pose_sub.subscribe(function(m) {

      const auger_pose = m.auger_pose
      const dataX = auger_pose.position.x
      const dataZ = auger_pose.position.z - 0.05
      
      if(dataX <= -0.15) {
        setPositionXBorderStopLeft(true)
      } else if (dataX > -0.15) {
        setPositionXBorderStopLeft(false)
      } if (dataX > 1.15) {
          setPositionXBorderStopRight(true)
      } else if (dataX < 1.15) {
          setPositionXBorderStopRight(false)
      }
      
      setPositionX(parseInt(dataX * 100) + "%")
      setPositionZ(parseInt(dataZ * 100) + "%")
      setPositionZText(parseInt(dataZ * 100 + 5) + "%")
    });

  }

  const getDataFillUp = () => {
    console.log("Pressed");
    var wagon_fill_up_sub = new ROSLIB.Topic({
      ros : ros,
      name : '/GrainCart/grain_distribution',
      messageType : 'std_msgs/Float64MultiArray'
    });

    console.log(" Topic = ",fill_level_sub);
    
    wagon_fill_up_sub.subscribe(function(m) {

        console.log("m = ", m)

     
    });

  }


  useLayoutEffect(() => {
    props.navigation.setOptions({ 
        headerTitle: props => <Text>Unload Sync</Text>,
        headerTitleAlign: "center",
        headerRight: () => (
            <View style={{marginRight: 30}}>
                {connected ? <FontAwesome5 size={40} name="smile-beam" color="green" /> : <FontAwesome5 size={40} name="sad-cry" color="red"/> }
            </View>),
        headerLeft: () => (
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity style={{marginLeft: 30, alignItems:"center"}} onPress={componentDidMount}>
                    <FontAwesome5 size={20} name="wifi" color={connected ? "blue" : "grey"}/> 
                    <Text >wifi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 20, alignItems:"center"}} onPress={getDataFillUp}>
                    <FontAwesome5 size={20} name="wifi" color={connected ? "blue" : "grey"}/> 
                    <Text>ros</Text>
                </TouchableOpacity>
            </View>
            )
            
        })
    })

    return (
    <View style={styles.container}>
      
        
     
        <View style={{width: "80%", height: 200, borderColor: "darkgreen", borderWidth:4, borderRadius: 10}}>
            
                <Image source={knob} style={{
                    width: "10%", 
                    height: "10%", 
                    borderWidth: 2, 
                    borderColor: "#43FF73", 
                    borderRadius: 20, 
                    position: "relative", 
                    top: positionZ, 
                    left: positionXBorderStopLeft ? "-13%" : positionXBorderStopRight ? "115%" : positionX ,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}/>
            
        </View>
       
      
    
      <View>
        <Button title='Get Data' onPress={getData} />
      </View>
      <Text>Position X : {positionX}</Text>
      <Text>Position Z : {positionZText}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default HomeScreen;