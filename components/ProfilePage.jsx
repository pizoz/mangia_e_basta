import React, { useEffect } from "react";
import InfoProfile from "./InfoProfile";
import LoadingScreen from "./LoadingScreen";
import ViewModel from "../model/ViewModel";


const ProfilePage = () => {
  useEffect(() => {
    ViewModel.setLastScreen("ProfilePage");
  }, []);

  return (
    <InfoProfile/>
  );
};
export default ProfilePage;
