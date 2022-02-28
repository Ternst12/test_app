import React from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet, ImageBackground, Image } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
    } from 'react-native-chart-kit';



const SettingsScreen = props => {

    const image = require("../cart_empt.png");

    return(
        <ScrollView>
            

            <ImageBackground source={image} resizeMode="stretch" style={{width: "100%"}}>
            
                <View style={{width: "100%", alignItems: "center", height: 400}}>
                {/*It is an Example of LineChart*/}
                <Text
                style={{
                textAlign: 'center', fontSize: 18,
               
                }}>
                Line Chart
                </Text>
                <LineChart data={{
                labels: [ 'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                ],
                datasets: [
                {
                data: [40, 45, 28, 80, 99, 43],
                strokeWidth: 2,
                },
                ],
                }}
                width={300}
                height={220}
                chartConfig={{
                backgroundColor: '#c92ac7',
                backgroundGradientFrom: '#7bede2',
                backgroundGradientTo: '#dbb8cd',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                borderRadius: 16,
                },
                }}
                style={{ marginVertical: 8,
                borderRadius: 16,
                }}
                />
                </View>
            </ImageBackground>      
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    },
    });

export default SettingsScreen;
