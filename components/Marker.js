import React, {useEffect, useState,} from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider"


const Marker = props => {

    const [range, setRange] = useState("0%")
    const [sliding, setSliding] = useState("Inactive")
    const [value, setValue] = useState(0)

    
    
    useEffect(() => {
        setRange(parseInt(value * 10) + "%")
        console.log(range)
    }, [value])
    

    return (
        <View style={styles.container}>
            <Slider 
                style={{width: 300, height: 40, borderColor: "black", borderWidth: 2}}
                
                thumbImage={props.knob}
                minimumTrackTintColor={props.value < 0 || props.value > 1  ? "red" : "green"}
                maximumTrackTintColor={props.value < 0 || props.value > 1  ? "red" : "green"}
                minimumValue={-1}
                maximumValue={2}
                value={props.value}
            />
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

  export default Marker;