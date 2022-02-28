import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {WebView} from 'react-native-webview';


const CameraViewScreen = props => {

  


    return(
    <View style={styles.container}>
        <View style={{width: "90%", height: 200}}>
            <WebView style={{flex: 1}} source={{uri:'http://192.168.45.100:8080/stream?topic=/image_rect_color'}}/>
        </View>
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

export default CameraViewScreen;