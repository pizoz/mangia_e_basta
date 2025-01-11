import { useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import ViewModel from "./model/ViewModel";
import FirstComponent from "./components/FirstComponent";
import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Root from "./components/Root";
import { AppState } from "react-native";


export default function App() {
  const [firstRun, setFirstRun] = useState(null);
  const [location, setLocation] = useState(null)
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);
  const [lastScreen, setLastScreen] = useState(null);
  
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState.match(/inactive|background/) && user) {
        ViewModel.saveUserAsync(user);
      }
    });

    ViewModel.initApp().then((res) => {
      setFirstRun(res.firstRun);
      setUser(res.user);
      setLocation(res.location);
      setLastScreen(res.lastScreen);
    });
    return () => {
      subscription.remove();
    };
  }, [changed]);

  const handleChangePress = () => {
    setChanged(!changed);
  };


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
        <Root user={user} lastScreen={lastScreen} />
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Accetta la posizione</Text>
          <Button onPress={handleChangePress} title="Fatto!"></Button>
        </View>
      )
    }

  }
  return (
    <LoadingScreen />
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