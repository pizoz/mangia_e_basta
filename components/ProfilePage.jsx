import React from "react";
import InfoProfile from "./InfoProfile";
import LoadingScreen from "./LoadingScreen";


const ProfilePage = ({ route }) => {
  const user = route.params.user;
  console.log(route.params);
  if(user === null) {
  return <LoadingScreen />;
  };

  return (
    <InfoProfile user={user} />
  );
};
export default ProfilePage;
