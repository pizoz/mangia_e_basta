import React, { useEffect } from "react";
import InfoProfile from "./InfoProfile";
import LoadingScreen from "./LoadingScreen";
import ViewModel from "../model/ViewModel";
import { View } from "lucide-react-native";

// ProfilePage è il componente che mostra le informazioni dell'utente
const ProfilePage = () => {
  // funzione per salvare la schermata visitata in async storage
  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("ProfilePage");
  };
  
  // inizializza il componente con la schermata visitata
  useEffect(() => {
    savePage();
  }, []);

  // mostro le informazioni dell'utente
  return (
    <InfoProfile/>
  );
};
export default ProfilePage;
