import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ViewModel from "./model/ViewModel";
import FirstComponent from "./components/FirstComponent";
import { useState } from "react";
import Home from "./components/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PositionController from "./model/PositionController";

const stack = createStackNavigator();

export default function App() {
  const positionController = new PositionController();
  const [firstRun, setFirstRun] = useState(null);
  
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    ViewModel.initApp().then((res) => {
      setFirstRun(res.firstRun);
      setUser(res.user);
      console.log("FirstRun: ", res.firstRun);
      console.log("User: ", res.user);
      if (!res.firstRun) {
        positionController.getLocationAsync().then((res) => {
          console.log("location: ", res);
        });
      }
    });
  }, [changed]);

  if (firstRun === null) {
    return (
      <View style={styles.container}>
        <Text>Loading... firstRUn Null</Text>
      </View>
    );
  }

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
  if (firstRun === false) {
    return (
      <NavigationContainer>
        <stack.Navigator initialRouteName="Home">
          <stack.Screen name="Home" component={Home} />
        </stack.Navigator>
      </NavigationContainer>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
