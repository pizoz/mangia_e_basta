import React from "react";
import { View, Text, Button } from "react-native";
import ViewModel from "../model/ViewModel";
import MenusList from "./MenusList";
import { useEffect, useState } from "react";


const Home = ({ route }) => {
  const user = route.params.user;

  const [menus, setMenus] = useState(null);

  useEffect(() => {
    console.log(route.params.user);
    // al caricamento della Homepage, traduco la posizione nella via in cui si trova l'utente

    //ABBIAMO I MENUS
    
    ViewModel.getMenus(route.params.user.sid)
      .then((result) => {
        console.log("Menus:", result);
        setMenus(result); // Aggiorna lo stato con i menu ricevuti
      })
      .catch((error) => {
        console.error("Errore durante il caricamento dei menu:", error);
        setMenus([]); // In caso di errore, considera la lista vuota
      });
  }, []);

  if (menus === null) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      <Button title="Reset" onPress={() => ViewModel.reset()} />

      <MenusList menus={menus} user ={user}  />
    </View>
  );
};

export default Home;
