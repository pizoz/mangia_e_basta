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
import ViewModel from "../model/ViewModel";

// creo tab navigator con Home, Order e Profile
const Tab = createBottomTabNavigator();

// creo stack navigator per Home e Profile
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// funzione per creare lo stack navigator per HomeScreen passando user e initialRouteName
// initialRouteName è la schermata iniziale da mostrare
// lo stack navigator per HomeScreen ha Homepage, Menu e ConfirmOrder
// ciascuna schermata ha unu componente diverso da mostrare 
function HomeScreenStack({ route }) {
  const { user, initialRouteName } = route.params;
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}>
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

// funzione per creare lo stack navigator per ProfileScreen passando user e initialRouteName
// initialRouteName è la schermata iniziale da mostrare
// lo stack navigator per ProfileScreen ha ProfilePage e Form
function ProfileScreenStack({ route }) {
  const { user, initialRouteName } = route.params;
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <ProfileStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        initialParams={{ user: user }}
      />
      <ProfileStack.Screen name="Form" component={Form} />
    </ProfileStack.Navigator>
  );
}

// Root è il componente che mostra il tab navigator con Home, Order e Profile
// in base all'ultima schermata visitata, mostra la schermata corrispondente
const Root = ({ user, lastScreen }) => {
  const initialRouteNames = ViewModel.getInitialRouteNames(lastScreen);
  
  // Tab navigator con Home, Order e Profile, 
  // -Home ha HomeScreenStack, Order ha Order e Profile ha ProfileScreenStack
  // ->HomeScreenStack ha Homepage, Menu e ConfirmOrder
  // ->ProfileScreenStack ha ProfilePage e Form
  // dalla Root si può navigare tra le schermate Home, Order e Profile 
  // in base al lastScreen vado alla schermata corrispondente passata da getInitialRouteNames
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={initialRouteNames.get("Root")}
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
                  tintColor: focused ? '#4a90e2' : 'gray',
                }}
              />
            );
          },
          tabBarActiveTintColor: '#4a90e2',
          tabBarInactiveTintColor: 'gray',

        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreenStack}
          initialParams={{ user: user, initialRouteName: initialRouteNames.get("Home") }}
          options={{ popToTopOnBlur: true }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Home', { screen: 'Homepage' });
            },
          })}
        />
        <Tab.Screen name="Order" component={Order} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreenStack}
          initialParams={{ user: user, initialRouteName: initialRouteNames.get("Profile") }}
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

