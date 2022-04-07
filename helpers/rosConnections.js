import ROSLIB from 'roslib';

var ros = new ROSLIB.Ros();

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

  const calibration_diagnostic_sub = new ROSLIB.Topic({
    ros : ros,
    name : '/calibration_diagnostics',
    messageType : 'diagnostic_msgs/DiagnosticStatus'
  });
  
  /*
  const calibration_succes_sub = new ROSLIB.Topic({
    ros : ros,
    name : '/calibration_succesful',
    messageType : 'std_msgs/Bool'
  }); */
  
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

  export {getParams, calibrator, getCalibrationData, componentDidMount}

  /*
  <View style={styles.inputBox}> 
                    <TextInput  style={styles.inputField}
                                onChangeText={(text) => {setNavn(text)}}
                                value={navn}
                                textAlign={"right"}
                    />
                    <View style={styles.labelBox}>
                        <Text style={styles.labelInput}>Name</Text> 
                    </View>
                </View>
                <View style={styles.inputBox}> 
                    <TextInput  style={styles.inputField}
                                onChangeText={(text) => {setHøjde(text)}}
                                value={højde}
                                textAlign={"right"}
                    />
                    <View style={styles.labelBox}>
                        <Text style={styles.labelInput}>Height</Text> 
                    </View>
                </View>
                <View style={styles.inputBox}> 
                    <TextInput  style={styles.inputField}
                                onChangeText={(text) => {setLængde(text)}}
                                value={længde}
                                textAlign={"right"}
                    />
                    <View style={styles.labelBox}>
                        <Text style={styles.labelInput}>Length</Text> 
                    </View>
                </View>
                <View style={styles.inputBox}> 
                    <TextInput  style={styles.inputField}
                                onChangeText={(text) => {setBredde(text)}}
                                value={bredde}
                                textAlign={"right"}
                    />
                    <View style={styles.labelBox}>
                        <Text style={styles.labelInput}>Width</Text> 
                    </View>
                </View>

    inputField: {
        height: 25,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 15,
        paddingRight: 10,
        marginHorizontal: 25,
        width: "50%", 
        backgroundColor: "white"
      },
    labelBox : {
        backgroundColor: "#EC6400",
        flex: 1,
        position: "relative",
        borderLeftColor: "grey",
        borderLeftWidth: 0.5,
        right: 0,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        justifyContent: "center",
    },
    labelInput: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
        marginLeft: 10,
    },
    inputBox : {
        height: "17%",
        backgroundColor: "#EC6400",
        width: "80%",
        flexDirection: "row",
        marginLeft: Dimensions.get("screen").width * 0.10,
        borderRadius: 30,
        marginBottom: 20,
    }
  */