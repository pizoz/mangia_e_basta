import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Menu from "./Menu";
import ConfirmOrder from "./ConfirmOrder";
import ProfilePage from "./ProfilePage";
import Order from "./Order";
import ViewModel from "../model/ViewModel";
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
        component={Home}
        initialParams={{ user }}
      />
      <HomeStack.Screen name="Menu" component={Menu} />
      <HomeStack.Screen name="ConfirmOrder" component={ConfirmOrder} />
    </HomeStack.Navigator>
  );
}

function ProfileScreenStack({ route }) {
  const { user} = route.params;
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        initialParams={{ user: user}}
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
        screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreenStack}
          initialParams={{ user: user }}
          options={{ popToTopOnBlur: true }}
          listeners={({ navigation }) => ({
            tabPress: () => {
              // Quando si preme la tab Home, torna alla schermata iniziale della lista dei menu
              navigation.navigate('Home');
            },
          })}
        />
        <Tab.Screen name="Order" component={Order} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreenStack}
          initialParams={{ user: user }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default Root;
