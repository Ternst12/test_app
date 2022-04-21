import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ScrollView, Dimensions} from 'react-native';
import { useState, useLayoutEffect, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import Colors from '../constants/Colors';


var test 

setInterval(() => {
  test = Array.from({length: 20}, () => Math.floor(Math.random() * 10))
  console.log(test)
  }, 1000)  


const HomeScreen = props => {

    const image = require("../cart_empt.png");
    
    const selectedCart = useSelector(state => state.carts.selectedCart)

    const knob = require("../MicrosoftTeams-image.png")
    const [fillUpData, setFillUpData] = useState(test)
    const [positionX, setPositionX] = useState("0%")
    const [positionZ, setPositionZ] = useState("0%")
    const [positionZText, setPositionZText] = useState("0%")
    const [wifiConnected, setWifiConnected] = useState(false)
    const [rosConnected, setRosConnected] = useState(false)
    const [cartLength, setCartLength] = useState(300)
    const [cartWidth, setCartWidth] = useState(300)
    const [cartName, setCartName] = useState("Default")
    const [chartWidth, setChartWidth] = useState(Dimensions.get("screen").width * 0.75)
    const [shrinkCart, setShrinkCart] = useState(null)
    const [shrinkFactor, setShrinkFactor] = useState(100)


  var ros = new ROSLIB.Ros();


  useEffect(() => {
      setFillUpData(test)
      if (selectedCart) {
      console.log("SelectedCart = ", selectedCart)
      setCartLength(selectedCart.lenght <= 10 ? selectedCart.lenght * 70 : selectedCart.lenght * 50)
      setCartWidth(selectedCart.lenght <= 10 ? selectedCart.width * 70 : selectedCart.width * 50)
      setCartName(selectedCart.name)
      }
      componentDidMount();  
  }, [selectedCart])

  setInterval(() => {
    setFillUpData(test)
  }, 1000);

  const wagon_pose_sub = new ROSLIB.Topic({
    ros : ros,
    name : '/wagon_pose',
    messageType : 'wagon_detection/WagonPose'
  });

  const wagon_fill_up_sub = new ROSLIB.Topic({
    ros : ros,
    name : '/GrainCart/grain_distribution',
    messageType : 'std_msgs/Float64MultiArray'
  });

  useEffect(() => {
    console.log(cartLength)
    const updateLayout = () => {
      setChartWidth(Dimensions.get("screen").width * 0.75)
      var shrinkFactorCalculator = Dimensions.get("screen").width
      if(shrinkFactorCalculator > 550){
        setShrinkFactor(250)
      } else if (shrinkFactorCalculator > 300)
      {
        setShrinkFactor(150)
      }
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
      setWifiConnected(true)
      console.log("It Works :-)")
    });  
    ros.on('error', function(error) {
      setWifiConnected(false)
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
      setWifiConnected(false)
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
    wagon_pose_sub.subscribe(function(m) {
      setRosConnected(true)
      const auger_pose = m.auger_pose
      const dataX = auger_pose.position.x
      const dataZ = auger_pose.position.z - 0.05
      console.log("dataX = ", dataX)
      if(dataX > 0 && dataX < 1) {
        console.log("tester")
        setShrinkCart(null)
      } else if (dataX > 1) {
        console.log("over 1 ", shrinkFactor)
        setShrinkCart(Math.abs(dataX) * 10)
      } else if (dataX < 0) {
        console.log(shrinkFactor)
        setShrinkCart(Math.abs(dataX) * shrinkFactor)
      }

      setPositionX(parseInt(dataX * 100) + "%")
      setPositionZ(parseInt(dataZ * 100) + "%")
      setPositionZText(parseInt(dataZ * 100 + 5) + "%")
    });
    getDataFillUp()
  }

  const getDataFillUp = () => {
    console.log("Pressed get fill up data ");
    componentDidMount();
    
    wagon_fill_up_sub.subscribe(function(m) {
      console.log("henter data")
      setFillUpData(
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
                <Text style={styles.cartName}>{cartName}</Text> 
            </View>),
        headerLeft: () => (
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity style={{marginLeft: 30, alignItems:"center"}} onPress={componentDidMount}>
                    <FontAwesome5 size={20} name="wifi" color={wifiConnected ? "blue" : "grey"}/> 
                    <Text >Wifi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 20, alignItems:"center"}} onPress={getData}>
                    <FontAwesome5 size={20} name="tractor" color={rosConnected ? "blue" : "grey"}/> 
                    <Text>Ros</Text>
                </TouchableOpacity>
            </View>
            )
            
        })
    })

    return (

    <ScrollView style={{flex: 1}}>
      <View style={styles.container}>
     
        <View style={{
          width: shrinkCart ? cartLength - shrinkCart : cartLength, 
          height: shrinkCart ? cartWidth - shrinkCart : cartWidth, 
          borderTopColor: Colors.fallGreen, 
          borderBottomColor: Colors.fallGreen,
          borderWidth:10, 
          marginTop: 50,
          borderLeftColor: parseInt(positionX) < 0 ? "red" : Colors.fallGreen,
          borderRightColor: parseInt(positionX) > 100 ? "red" : Colors.fallGreen,
          
          }}>

                <Image source={knob} style={{
                    width: "10%", 
                    height: "10%", 
                    borderWidth: 2, 
                    borderColor: "#43FF73", 
                    borderRadius: 20, 
                    position: "absolute", 
                    top: positionZ, 
                    left: positionX,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}/>
            
      
        </View>
      <Text>Position X : {positionX}</Text>
      <Text>Position Z : {positionZText}</Text>

      <ImageBackground source={image} resizeMode="stretch" style={{width: "90%", marginTop: Dimensions.get("screen").height * 0.10}}>
            
                <View style={{width: "100%", alignItems: "center", height: 400, top: 80, right: chartWidth > 680 ? "10%" : "12%"}}>
                {/*It is an Example of LineChart*/}
               
                  <BarChart 
                  withInnerLines= {false}
                  withHorizontalLabels = {false}
                  data={{
                  datasets: [
                  {
                  data: fillUpData,
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
      height: Dimensions.get("screen").height,
      backgroundColor: Colors.fallWhite,
      alignItems: 'center',
      justifyContent: 'center',
      
    },

    cartName: {
      fontSize: 22,
      fontWeight: "500",
      color: Colors.fallOragne
    }

  });

export default HomeScreen;