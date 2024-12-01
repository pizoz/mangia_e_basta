import { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import ViewModel from "./model/ViewModel";
import FirstComponent from "./components/FirstComponent";
import { useState } from "react";
import Home from "./components/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Menu from "./components/Menu";
import LoadingScreen from "./components/LoadingScreen";


const stack = createStackNavigator();

export default function App() {
  const [firstRun, setFirstRun] = useState(null);
  const [location, setLocation] = useState(null)
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    ViewModel.initApp().then((res) => {
      setFirstRun(res.firstRun);
      setUser(res.user);
      setLocation(res.location);
    });
    
  }, [changed]);

 
  if (firstRun) {
    return (
      <View style={styles.container}>
        <FirstComponent
          setChanged={setChanged}
          setUser={setUser}
        />
      </View>
    );
  }
  console.log("FirstRun ", firstRun)
  if (firstRun === false) {
    
    if (user !== null && location !== null) {
      return (
        <NavigationContainer>
          <stack.Navigator initialRouteName="Home">
            <stack.Screen name="Home" component={Home} initialParams={{user: user}}  options={{headerShown: false}}/>
            <stack.Screen name="Menu" component={Menu} options={{headerShown: false}}/>
          </stack.Navigator>
        </NavigationContainer>
      );
    }
    
  }
  return (
    <LoadingScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
});