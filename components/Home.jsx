import React from "react";
import { View, Text, Button } from "react-native";
import ViewModel from "../model/ViewModel";
import MenusList from "./MenusList";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { StyleSheet } from "react-native";

// Home è il componente che mostra la lista dei menu
const Home = ({ route }) => {
  const user = route.params.user || ViewModel.user;
  const [address, setAddress] = useState(null);
  const [menus, setMenus] = useState(null);
  const [changed, setChanged] = useState(false);

  // setta tutte le variabili per la home e salva come ultima schermata visitata Home
  const initHome = async () => {
    try {
      // salva la schermata visitata in async storage
      await ViewModel.saveLastScreenAsync("Home");
      console.log(user)
      // recupera utente da async storage
      const userFromasync = await ViewModel.getUserFromAsyncStorage();
      console.log("USer from Async: ",userFromasync);
      // recupera i menu con immagini agiornate 
      const menu = await ViewModel.getMenus(user.sid);
      setMenus(menu);
      // recupera l'indirizzo dell'utente 
      const address = await ViewModel.getAddress();
      setAddress(address);

      console.log(address);
      console.log(userFromasync);
    } catch (error) {
      console.error("Errore durante il caricamento dei menu:", error);
    }
  }

  // inizializza la home
  useEffect(() => {
    console.log(route.params.user);
    initHome();
  }, [changed]);

  // se non ho i menu, mostro il componente di caricamento
  if (menus === null) {
    return <LoadingScreen />;
  }
  // mostro la lista dei menu
  return (
    <View style={{paddingTop: "60"}}>
      {/*<View style={styles.address}>
      <Text >{address.street !=  null  ? address.street : address.formattedAddress }</Text>
      <Text >{address.city}</Text>
      </View>*/}
      {/* <Button title="Reset" onPress={() => ViewModel.reset()} /> */}
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

