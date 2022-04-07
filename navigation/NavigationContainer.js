import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons"

import HomeScreen from '../screens/HomeScreen';
import LaunchScreen from '../screens/LaunchScreen';
import CameraViewScreen from '../screens/CameraViewScreen';
import GrainCartScreen from '../screens/GrainCartScreen';

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
        name="Carts"
        component={GrainCartScreen}
        options={{
          headerLeft: (props) => null,
          title: "Se dine kornvogne",
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

  const LaunchScreenNav = props => {
    return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Launch"
        component={LaunchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Main"
        component={NavigationStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    </NavigationContainer>
    )
  };

  const NavigationStack = () => {
  
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          activeTintColor: '#2e64e5',
        }}>
        <Tab.Screen
          name="HomeScreen"
          component={HomeStack}
          options={({route}) => ({
            headerLeft: null,
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
          name="Carts"
          component={SettingsStack}
          options={{
            headerBackVisible:false,
            tabBarLabel: 'Carts',
            tabBarIcon: () => (
              <Ionicons name="md-settings-outline" size={25} color="black" />
            ),
          }}
        />
       
        <Tab.Screen
          name="CameraScreen"
          component={CameraViewStack}
          options={{
            tabBarLabel: 'Calibration',
            tabBarIcon: () => (
              <Ionicons name="md-videocam-outline" color={"black"} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };
  
  export {NavigationStack, LaunchScreenNav};