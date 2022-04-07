import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Dimensions} from 'react-native';
import { useState, useLayoutEffect, useEffect} from 'react';
import {FontAwesome5} from "@expo/vector-icons"
import ROSLIB from 'roslib';
import { ImageBackground } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  } from 'react-native-chart-kit';


const HomeScreen = props => {

    const image = require("../cart_empt.png");

    const knob = require("../MicrosoftTeams-image.png")
    const [fillUpData, setFillUpData] = useState([])
    const [positionX, setPositionX] = useState("0%")
    const [positionZ, setPositionZ] = useState("0%")
    const [positionZText, setPositionZText] = useState("0%")
    const [connected, setConnected] = useState(false)
    const [cartWidth, setCartWidth] = useState(Dimensions.get("screen").width * 0.75)

    const dummyData = [30, 40, 22, 44, 11, 1, 33, 34, 45, 22, 31, 29, 30, 12, 18, 9, 7, 6, 50, 23, 25]

    const [test, setTest] = useState([])
    const [chartWidth, setChartWidth] = useState(Dimensions.get("screen").width * 0.65)
    
  var ros = new ROSLIB.Ros();


  useEffect(() => {
      componentDidMount();
  }, [])

  useEffect(() => {
    const updateLayout = () => {
      setChartWidth(Dimensions.get("screen").width * 0.65)
      console.log(chartWidth)
    }

    const subscription = Dimensions.addEventListener("change", updateLayout);
      return () => {
        subscription?.remove()
      }
  })

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
      
      if(dataX <= 0) {
        var underZero = Math.abs(dataX)
        console.log(underZero)
        setPositionXBorderStopLeft(true)
      } else if (dataX > -0.15) {
        
      } if (dataX > 1.15) {
          setPositionXBorderStopRight(true)
      } else if (dataX < 1.15) {
      }    
      setPositionX(parseInt(dataX * 100) + "%")
      setPositionZ(parseInt(dataZ * 100) + "%")
      setPositionZText(parseInt(dataZ * 100 + 5) + "%")
    });

  }

  const getDataFillUp = () => {
    console.log("Pressed get fill up data ");
    componentDidMount();
    var wagon_fill_up_sub = new ROSLIB.Topic({
      ros : ros,
      name : '/GrainCart/grain_distribution',
      messageType : 'std_msgs/Float64MultiArray'
    });
   wagon_fill_up_sub.subscribe(function(m) {
      console.log("henter data")
      setTest(
          [
          m.data[0],
          m.data[1],
          m.data[2],
          m.data[3],
          m.data[5],
          m.data[6],
          m.data[7],
          m.data[8],
          m.data[9],
          m.data[10],
          m.data[11],
          m.data[12],
          m.data[13],
          m.data[14],
          m.data[15],
          m.data[16],
          m.data[17],
          m.data[18],
          m.data[19],

          ]
        )
        
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

    <ScrollView >

      <View style={styles.container}>
     
        <View style={{width: cartWidth, height: 200, borderColor: "darkgreen", borderWidth:4, marginTop: 50}}>
            
                <Image source={knob} style={{
                    width: "10%", 
                    height: "10%", 
                    borderWidth: 2, 
                    borderColor: "#43FF73", 
                    borderRadius: 20, 
                    position: "relative", 
                    top: positionZ, 
                    left: positionX,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}/>
            
      
        </View>
      <Text> {test[0]} </Text>
      <Text> {test[1]} </Text>
      <Text> {test[2]} </Text>
      <Text> {test[3]} </Text>
      <Text> {test[4]} </Text>
      <Text> {test[5]} </Text>
      <Text> {test[6]} </Text>
  
                
      <View>
        <Button title='Get Data' onPress={getData} />
      </View>
      <Text>Position X : {positionX}</Text>
      <Text>Position Z : {positionZText}</Text>

      <ImageBackground source={image} resizeMode="stretch" style={{width: "90%"}}>
            
                <View style={{width: "100%", alignItems: "center", height: 400, top: 80, right: chartWidth > 680 ? "10%" : "12%"}}>
                {/*It is an Example of LineChart*/}
               
                <BarChart 
                
                withInnerLines= {false}
                withHorizontalLabels = {false}
                data={{
                labels: ["hej"],
                datasets: [
                {
                data: dummyData,
                strokeWidth: 1,
                },
                ],
                }}
                width={chartWidth}
                height={220}
                chartConfig={{
                barPercentage: 0.6,
                barRadius: 5,
                backgroundGradientFromOpacity: 0,  
                backgroundGradientToOpacity: 0,
                color: (opacity = 0) => `rgba(180, 100, 100, ${opacity})`,
                style: {
             
                },
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16,
                }}
                />
                </View>
            </ImageBackground>   

      </View>
    </ScrollView>
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