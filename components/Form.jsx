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
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CommunicationController from "../model/CommunicationController";
import ViewModel from "../model/ViewModel";

const Form = ({ route }) => {
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

  const validateForm = () => {
    const errors = [];
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (newUser.firstName) {
      if (newUser.firstName.length > 15) {
        errors.push("First Name must be 15 characters or less");
      }
      if (!nameRegex.test(newUser.firstName)) {
        errors.push("First Name must contain only letters and spaces");
      }
    }

    if (newUser.lastName) {
      if (newUser.lastName.length > 15) {
        errors.push("Last Name must be 15 characters or less");
      }
      if (!nameRegex.test(newUser.lastName)) {
        errors.push("Last Name must contain only letters and spaces");
      }
    }

    if (newUser.cardFullName) {
      if (newUser.cardFullName.length > 31) {
        errors.push("Card Full Name must be 31 characters or less");
      }
      if (!nameRegex.test(newUser.cardFullName)) {
        errors.push("Card Full Name must contain only letters and spaces");
      }
    }

    if (newUser.cardNumber && (!/^\d+$/.test(newUser.cardNumber) || newUser.cardNumber.length !== 16)) {
      errors.push("Card Number must be exactly 16 digits");
    }

    if (newUser.cardExpireMonth) {
      const month = parseInt(newUser.cardExpireMonth, 10);
      if (isNaN(month) || month < 1 || month > 12) {
        errors.push("Card Expire Month must be between 1 and 12");
      }
    }

    if (newUser.cardExpireYear && (!/^\d{4}$/.test(newUser.cardExpireYear))) {
      errors.push("Card Expire Year must be exactly 4 digits");
    }

    if (newUser.cardCVV && (!/^\d{3}$/.test(newUser.cardCVV))) {
      errors.push("Card CVV must be exactly 3 digits");
    }

    return errors;
  };

  const onClickOnButton = async (formScreen) => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert("Validation Error", errors.join("\n"));
      return;
    }

    let bodyParams = {
      firstName: newUser.firstName !== "" ? newUser.firstName : user.firstName,
      lastName: newUser.lastName !== "" ? newUser.lastName : user.lastName,
      cardFullName: newUser.cardFullName !== "" ? newUser.cardFullName : user.cardFullName,
      cardNumber: newUser.cardNumber !== "" ? newUser.cardNumber : user.cardNumber,
      cardExpireMonth: newUser.cardExpireMonth !== "" ? newUser.cardExpireMonth : user.cardExpireMonth,
      cardExpireYear: newUser.cardExpireYear !== "" ? newUser.cardExpireYear : user.cardExpireYear,
      cardCVV: newUser.cardCVV !== "" ? newUser.cardCVV : user.cardCVV,
      sid: user.sid,
    };

    try {
      await CommunicationController.UpdateUser(user.uid, user.sid, bodyParams);
    } catch (error) {
      console.log("Error in updating user: ", error);
      Alert.alert("Error", "Failed to update user information");
      return;
    }

    let serverUser = await CommunicationController.getUser(user.uid, user.sid);
    serverUser = { ...serverUser, uid: user.uid, sid: user.sid };
    ViewModel.user = serverUser;
    try {
      await ViewModel.storageManager.saveUserAsync(serverUser);
    } catch (error) {
      console.error("Error saving user:", error);
      Alert.alert("Error", "Failed to save user information locally");
      return;
    }

    if (formScreen === "Info") {
      navigation.navigate("ProfilePage", { user: serverUser });
    } else if (formScreen === "Home") {
      navigation.navigate("Home", { user: serverUser, screen: "ConfirmOrder" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.boldText}>First Name (max 15 characters, letters only)</Text>
          <TextInput
            value={newUser.firstName}
            style={styles.input}
            onChangeText={(text) => handleInputChange("firstName", text)}
            placeholder="First Name"
          />

          <Text style={styles.boldText}>Last Name (max 15 characters, letters only)</Text>
          <TextInput
            value={newUser.lastName}
            style={styles.input}
            onChangeText={(text) => handleInputChange("lastName", text)}
            placeholder="Last Name"
          />

          <Text style={styles.boldText}>Card Full Name (max 31 characters, letters only)</Text>
          <TextInput
            value={newUser.cardFullName}
            style={styles.input}
            onChangeText={(text) => handleInputChange("cardFullName", text)}
            placeholder="Card Full Name"
          />

          <Text style={styles.boldText}>Card Number (16 digits)</Text>
          <TextInput
            value={newUser.cardNumber}
            style={styles.input}
            onChangeText={(text) => handleInputChange("cardNumber", text)}
            placeholder="Card Number"
            keyboardType="numeric"
          />

          <Text style={styles.boldText}>Card Expire Month (1-12)</Text>
          <TextInput
            value={newUser.cardExpireMonth}
            style={styles.input}
            onChangeText={(text) => handleInputChange("cardExpireMonth", text)}
            placeholder="Card Expire Month"
            keyboardType="numeric"
          />

          <Text style={styles.boldText}>Card Expire Year (4 digits)</Text>
          <TextInput
            value={newUser.cardExpireYear}
            style={styles.input}
            onChangeText={(text) => handleInputChange("cardExpireYear", text)}
            placeholder="Card Expire Year"
            keyboardType="numeric"
          />

          <Text style={styles.boldText}>Card CVV (3 digits)</Text>
          <TextInput
            value={newUser.cardCVV}
            style={styles.input}
            onChangeText={(text) => handleInputChange("cardCVV", text)}
            placeholder="Card CVV"
            keyboardType="numeric"
          />

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    width: 200,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});

