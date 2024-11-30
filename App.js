import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ViewModel from "./model/ViewModel";
import FirstComponent from "./components/FirstComponent";
import { useState } from "react";
import Home from "./components/Home";
import Menu from "./components/Menu";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const stack = createStackNavigator();

export default function App() {
  const [positionController, setPC] = useState(null);
  const [firstRun, setFirstRun] = useState(null);
  const [location, setLocation] = useState(null)
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    ViewModel.initApp().then((res) => {
      setFirstRun(res.firstRun);
      setUser(res.user);
      setPC(res.positionController);
      console.log("FirstRun: ", res.firstRun);
      console.log("User: ", res.user);
      if (res.firstRun === false) {
        res.positionController.getLocationAsync().then( () => {
          setLocation(res.positionController.location)
          res.positionController.reverseGeocode().then((address) => {
            console.log("Address: ", address);
          });
        }).catch((error) => {
          console.log(error);
        });
      }
    });
    
  }, [changed]);

  if (firstRun) {
    return (
      <View style={styles.container}>
        <FirstComponent
          setChanged={setChanged}
          setUser={setUser}
          positionController={positionController}
        />
      </View>
    );
  }
  console.log("FirstRun ", firstRun)
  if (firstRun === false) {
    console.log(positionController)
    console.log(positionController.location)
    if (user !== null && location !== null) {
      console.log("Cas falso",positionController.location)
      return (
        <NavigationContainer>
          <stack.Navigator initialRouteName="Home">
            <stack.Screen name="Home" component={Home} initialParams={{user: user}}/>
            <stack.Screen name="Menu" component={Menu} />
          </stack.Navigator>
        </NavigationContainer>
      );
    }
    
  }
  return (
    <View style={styles.container}>
      <Text>Loading... firstRUn Null</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
