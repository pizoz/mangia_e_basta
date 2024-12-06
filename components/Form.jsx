import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import CommunicationController from "../model/CommunicationController";
import ViewModel from "../model/ViewModel";

const Form = ({ route }) => {
  // variabile di stato per salvare i dati inseriti dall'utente
  const { user, before } = route.params;
  const navigation = useNavigation();
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    cardFullName: "",
    cardNumber: "",
    cardExpireMonth: "",
    cardExpireYear: "",
    cardCVV: "",
  });

  
  const handleInputChange = (field, value) => {
    setNewUser((prevObj) => ({ ...prevObj, [field]: value }));
  };
  
  const onClickOnButton = async (formScreen) => {
    // quando la form viene inviata vengono controllati i parametri inseriti. Se == "" allora inseriamo i valori dell'utente ricevuto prima
    let bodyParams = {
      firstName: newUser.firstName !== "" ? newUser.firstName : user.firstName,
      lastName: newUser.lastName !== "" ? newUser.lastName : user.lastName,
      cardFullName:
        newUser.cardFullName !== "" ? newUser.cardFullName : user.cardFullName,
      cardNumber:
        newUser.cardNumber !== "" ? newUser.cardNumber : user.cardNumber,
      cardExpireMonth:
        newUser.cardExpireMonth !== ""
          ? newUser.cardExpireMonth
          : user.cardExpireMonth,
      cardExpireYear:
        newUser.cardExpireYear !== ""
          ? newUser.cardExpireYear
          : user.cardExpireYear,
      cardCVV: newUser.cardCVV !== "" ? newUser.cardCVV : user.cardCVV,
      sid: user.sid,
    };
    try {
      await CommunicationController.UpdateUser(user.uid, user.sid, bodyParams);
    } catch (error) {
      console.log("Error in updating user: ", error);
    }
    let serverUser = await CommunicationController.getUser(user.uid, user.sid);
    serverUser = { ...serverUser, uid: user.uid, sid: user.sid };

    try {
    await ViewModel.storageManager.saveUserAsync(serverUser);
    } catch (error) {
      console.error("Error saving user:", error);
    }

    if (formScreen === "Info") {
      navigation.navigate("ProfilePage", { user: user });
    } else if (formScreen === "Home") {
      navigation.navigate("Home", { user: user, screen: "ConfirmOrder" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.boldText}>First Name</Text>
            <TextInput
              value={newUser.firstName}
              style={styles.input}
              onChangeText={(text) => handleInputChange("firstName", text)}
              placeholder="First Name"
            />

            <Text style={styles.boldText}>Last Name</Text>
            <TextInput
              value={newUser.lastName}
              style={styles.input}
              onChangeText={(text) => handleInputChange("lastName", text)}
              placeholder="Last Name"
            />

            <Text style={styles.boldText}>Card Full Name</Text>
            <TextInput
              value={newUser.cardFullName}
              style={styles.input}
              onChangeText={(text) => handleInputChange("cardFullName", text)}
              placeholder="Card Full Name"
            />
            <Text style={styles.boldText}>Card Number</Text>
            <TextInput
              value={newUser.cardNumber}
              style={styles.input}
              onChangeText={(text) => handleInputChange("cardNumber", text)}
              placeholder="Card Number"
            />

            <Text style={styles.boldText}>Card Expire Month</Text>
            <TextInput
              value={newUser.cardExpireMonth}
              style={styles.input}
              onChangeText={(text) =>
                handleInputChange("cardExpireMonth", text)
              }
              placeholder="Card Expire Month"
            />

            <Text style={styles.boldText}>Card Expire Year</Text>
            <TextInput
              value={newUser.cardExpireYear}
              style={styles.input}
              onChangeText={(text) => handleInputChange("cardExpireYear", text)}
              placeholder="Card Expire Year"
            />

            <Text style={styles.boldText}>Card CVV</Text>
            <TextInput
              value={newUser.cardCVV}
              style={styles.input}
              onChangeText={(text) => handleInputChange("cardCVV", text)}
              placeholder="Card CVV"
            />
          </View>
          {before === "ProfilePage" ? (
            <Button title="Save" onPress={() => onClickOnButton("Info")} />
          ) : before === "CompletaProfilo" ? (
            <Button title="Save" onPress={() => onClickOnButton("Home")} />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Usa tutto lo spazio disponibile
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra orizzontalmente
    padding: 20, // Aggiungi un po' di padding
    backgroundColor: "#f5f5f5", // Colore di sfondo chiaro
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24, // Imposta una dimensione del font per il testo
    fontWeight: "bold", // Rendi il testo in grassetto
    marginBottom: 20, // Aggiungi un po' di spazio sotto il testo
  },
  input: {
    borderWidth: 1,
    width: 200,
    marginBottom: 10,
  },
});
