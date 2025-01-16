import React, { Fragment, useState, } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import ViewModel from "../model/ViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "./LoadingScreen";
const { width, height } = Dimensions.get("window");

// FirstComponent è il componente che viene mostrato all'avvio dell'applicazione, per chiedere all'utente di condividere la sua posizione
// passo come props setUser e setChanged per poter aggiornare lo stato dell'app
const FirstComponent = ({ setChanged, setUser}) => {

  const [screen, setScreen] = useState("FirstScreen");
  // Funzione per gestire il button "Continua"
  const onSubmit = async () => {
    // setto user con i dati dell'utente
    const user = await ViewModel.getUserFromAsyncStorage();
    setUser(user);
    // calcola la posizione attuale e la salva in location se ci sono i permessi
    await ViewModel.positionController.getLocationAsync();
    // inizializza setChanged a true quando premo "Continua" nella seconda schermata
    setChanged(true);

  };

  // se screen è FirstScreen, mostro il logo iniziale con il button "Inizia"
  // se premo il button, setto screen a SecondScreen
  if (screen === "FirstScreen") {
    return (
      <Fragment>
        <SafeAreaView style={styles.container}>
          <ImageBackground
            source={require("../assets/logo_iniziale_2.jpg")}
            style={styles.background}
            resizeMode= "contain"
          >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setScreen("SecondScreen")}
            >
              <Text style={styles.buttonText}>Inizia</Text>
            </TouchableOpacity>
          </View>
          </ImageBackground>
        </SafeAreaView>
      </Fragment>
    );
  } 

  // se screen è SecondScreen, mostro il titolo "Condividi la tua posizione" e il button "Continua"
  // se premo il button, chiamo la funzione onSubmit che setta user e location e setto changed a true
  else if (screen === "SecondScreen") {
    return (
      <SafeAreaView style={styles.containerSecond}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.titleSecond}>Condividi la tua posizione</Text>
            <Text style={styles.subtitle}>
              La utilizzeremo per mostrarti i menu più vicini a te{"\n"}e
              monitorare lo stato di un ordine
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonSecond} onPress={async () => {
            await onSubmit();
        } }>
          <Text style={styles.buttonTextSecond}>Continua</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  // se screen non è nè FirstScreen nè SecondScreen, mostro il componente di caricamento
  return (
    <LoadingScreen/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
  },
  background: {
    width: "100%",
    height: "100%",
    
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  titleContainer: {
    backgroundColor: "rgba(52, 152, 219, 0.8)",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 40,
    width:350,
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  containerSecond: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  titleSecond: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonSecond: {
    backgroundColor: "#3498db",
    marginHorizontal: 24,
    marginBottom: 90,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextSecond: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default FirstComponent;