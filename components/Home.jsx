import React from "react";
import { View, Text, Button } from "react-native";
import ViewModel from "../model/ViewModel";
import MenusList from "./MenusList";
import { useEffect, useState } from "react";


const Home = ({ route }) => {
  const user = route.params.user;
  const [address, setAddress] = useState(null);
  const [menus, setMenus] = useState(null);

  const initHome = async () => {

    try {
      const menu = await ViewModel.getMenus(route.params.user.sid);
      setMenus(menu);
      const address = await ViewModel.getAddress();
      setAddress(address);
    } catch (error) {
      console.error("Errore durante il caricamento dei menu:", error);
    }
  }

  useEffect(() => {
    console.log(route.params.user);
    initHome();
  }, []);

  if (menus === null || address === null) {
    return <Text>Loading...</Text>;
  }
  return (
    <View>
      <Button title="Reset" onPress={() => ViewModel.reset()} />
      <Text>{address.street !=  null  ? address.street : address.formattedAddress }</Text>
      <MenusList menus={menus} user={user} />
    </View>
  );
};

export default Home;
