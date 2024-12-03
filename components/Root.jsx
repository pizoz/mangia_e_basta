import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from './Home';
import Menu from './Menu';
import ConfirmOrder from './ConfirmOrder';
import ProfilePage from './ProfilePage';
import Order from './Order';
import ViewModel from '../model/ViewModel';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeScreenStack({route}) {
    const {user} = route.params;
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={Home} initialParams={{user:user}} />
      <HomeStack.Screen name="Menu" component={Menu} />
      <HomeStack.Screen name="ConfirmOrder" component={ConfirmOrder} />
    </HomeStack.Navigator>
  );
}
const Root = ({user}) => {
    return (
        <NavigationContainer>
        <Tab.Navigator initialRouteName='Homepage' screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}  >
            <Tab.Screen name="Homepage" 
          component={HomeScreenStack} 
          initialParams={{user: user}}
          options={{ popToTopOnBlur: true }}
          listeners={({ navigation }) => ({
            tabLongPress: async () => {
              try {
                await ViewModel.getLocation();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Homepage', params: { user: user } }],
                });
              } catch (error) {
                console.error("Error during location loading:", error);
              }
              
            },
          })}/>
            <Tab.Screen name="Profile" component={ProfilePage} v/>
            <Tab.Screen name="Order" component={Order}/>
        </Tab.Navigator>
        </NavigationContainer>
    );
}
export default Root;