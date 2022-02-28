import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons"

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from "../screens/SettingsScreen"
import CameraViewScreen from '../screens/CameraViewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = props => {
    return(
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Camera_from_Home" component={CameraViewScreen}
            options={{
              headerShown: false,
            }}
      />
        </Stack.Navigator>
    )
  }
  
  const SettingsStack = props => {
    return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerTintColor: "#FF9054",
          headerTitleAlign: "center"
        }}
      />
    </Stack.Navigator>
    )
  };
  
  const CameraViewStack = props => {
    return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraViewScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    )
  };

  const NavigationStack = () => {
  
    return (
      <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#2e64e5',
        }}
        screenOptions={{
          headerShown: false
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeStack}
          options={({route}) => ({
            tabBarLabel: 'Home',
            tabBarShowLabel: true,
            tabBarVisible: route.state && route.state.index === 0,
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="home-outline"
                color={"black"}
                size={25}
              />
            ),
          })}
        />
  
        <Tab.Screen
          name="Setting"
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => (
              <Ionicons name="md-settings-outline" size={25} color="black" />
            ),
          }}
        />
       
        <Tab.Screen
          name="CameraScreen"
          component={CameraViewStack}
          options={{
            tabBarLabel: 'Camera',
            tabBarIcon: () => (
              <Ionicons name="md-videocam-outline" color={"black"} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
      </NavigationContainer>
    );
  };
  
  export default NavigationStack;