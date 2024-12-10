import { useEffect } from "react";
import { StyleSheet, View} from "react-native";
import ViewModel from "./model/ViewModel";
import FirstComponent from "./components/FirstComponent";
import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Root from "./components/Root";

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
        <Root user={user}/>
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