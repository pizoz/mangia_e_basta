import React, { useEffect } from "react";
import InfoProfile from "./InfoProfile";
import LoadingScreen from "./LoadingScreen";
import ViewModel from "../model/ViewModel";
import { View } from "lucide-react-native";


const ProfilePage = () => {
  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("ProfilePage");
  };
  useEffect(() => {
    savePage();
  }, []);

  return (
    <InfoProfile/>
  );
};
export default ProfilePage;
