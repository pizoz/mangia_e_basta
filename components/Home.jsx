import React from "react";
import { View, Text, Button } from "react-native";
import ViewModel from "../model/ViewModel";
import MenusList from "./MenusList";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { StyleSheet } from "react-native";

const Home = ({ route }) => {
  const user = route.params.user;
  const [address, setAddress] = useState(null);
  const [menus, setMenus] = useState(null);
  const [changed, setChanged] = useState(false);
  const initHome = async () => {

    try {
      console.log(user)
      const userFromasync = await ViewModel.getUserFromAsyncStorage();
      console.log("USer from Async: ",userFromasync);
      const menu = await ViewModel.getMenus(user.sid);
      setMenus(menu);
      const address = await ViewModel.getAddress();
      setAddress(address);
      console.log(address);
      console.log(userFromasync);
    } catch (error) {
      console.error("Errore durante il caricamento dei menu:", error);
    }
  }

  useEffect(() => {
    console.log(route.params.user);
    initHome();
  }, [changed]);

  if (menus === null) {
    return <LoadingScreen />;
  }
  return (
    <View style={{paddingTop: "60"}}>
      {/*<View style={styles.address}>
      <Text >{address.street !=  null  ? address.street : address.formattedAddress }</Text>
      <Text >{address.city}</Text>
      </View>*/}
      <Button title="Reset" onPress={() => ViewModel.reset()} />
      <MenusList menus={menus} user={user} setChanged={setChanged}/>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  address: {
    fontSize: 20,
    color: "#000000",
    paddingTop: 30,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

