import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {WebView} from 'react-native-webview';


const Camera = props => {
    return(
    <TouchableOpacity style={styles.container} onPress={props.navigation.navigate("Camera_from_Home")}>
        <View style={{width: "90%", height: 500}}>
            <WebView style={{flex: 1}} source={{uri:'http://192.168.45.100:8080/stream?topic=/image_rect_color'}}/>
        </View>
    </TouchableOpacity>
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

export default Camera;