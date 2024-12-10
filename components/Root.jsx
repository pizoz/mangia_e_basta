import React from "react";
import { Image } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Home";
import Menu from "./Menu";
import ConfirmOrder from "./ConfirmOrder";
import ProfilePage from "./ProfilePage";
import Order from "./Order";
import Form from "./Form";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeScreenStack({ route }) {
  const { user } = route.params;
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name="Homepage"
        component={HomeScreen}
        initialParams={{ user }}
      />
      <HomeStack.Screen name="Menu" component={Menu} />
      <HomeStack.Screen name="ConfirmOrder" component={ConfirmOrder} />
    </HomeStack.Navigator>
  );
}

function ProfileScreenStack({ route }) {
  const { user } = route.params;
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        initialParams={{ user: user }}
      />
      <ProfileStack.Screen name="Form" component={Form} />
    </ProfileStack.Navigator>
  );
}

const Root = ({ user }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;

            if (route.name === 'Home') {
              iconSource = require('../assets/marketplace-store.png');
            } else if (route.name === 'Order') {
              iconSource = require('../assets/grocery-bag.png');
            } else if (route.name === 'Profile') {
              iconSource = require('../assets/user.png');
            }

            return (
              <Image
                source={iconSource}
                style={{
                  width: size,
                  height: size,
                  tintColor: focused ? 'black' : 'gray',
                }}
              />
            );
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreenStack}
          initialParams={{ user: user }}
          options={{ popToTopOnBlur: true }}
        />
        <Tab.Screen name="Order" component={Order} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreenStack}
          initialParams={{ user: user }}
          options={{ popToTopOnBlur: true }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Profile', { screen: 'ProfilePage' });
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Root;

