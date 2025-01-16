import { useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import ViewModel from "./model/ViewModel";
import FirstComponent from "./components/FirstComponent";
import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Root from "./components/Root";
import { AppState } from "react-native";

export default function App() {
  const [firstRun, setFirstRun] = useState(null);
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);
  const [lastScreen, setLastScreen] = useState(null);

  // Aggiorna lo stato dell'app quando l'app cambia stato
  useEffect(() => {
    // Inizializza l'app e imposta lo stato iniziale dell'app 
    ViewModel.initApp().then((res) => {
      setFirstRun(res.firstRun);
      setUser(res.user);
      setLocation(res.location);
      setLastScreen(res.lastScreen);
    });
  }, [changed]);

  // Funzione per gestire il cambio di autorizzazione della posizione
  const handleChangePress = () => {
    setChanged(!changed);
  };

  // Se l'app è in fase di avvio, mostra il componente di avvio
  if (firstRun) {
    return (
      <View style={styles.container}>
        <FirstComponent setChanged={setChanged} setUser={setUser} />
      </View>
    );
  }
  console.log("FirstRun ", firstRun);

  // Se l'app è stata avviata e l'utente ha autorizzato la posizione, mostra l'app dall'ultima schermata visitata se ho i permessi di localizzazione
  if (firstRun === false) {
    // Se ho l'utente e la posizione, mostro l'app
    if (user !== null && location !== null) {
      // mostra l'app dall'ultima schermata visitata andando a Root passando user e lastScreen, lastScreen è passato come props, dopo aver fatto initApp 
      return <Root user={user} lastScreen={lastScreen} />;
    } else {
      // Se non ho l'utente o la posizione, mostro il messaggio per autorizzare la posizione
      return (
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.text}>
              Per offrire il nostro servizio, abbiamo bisogno della tua
              posizione. {"\n"} Ti invitiamo ad autorizzarne l'uso.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleChangePress}
                title="Fatto!"
                color="#4caf50"
              >
              </Button>
            </View>
          </View>
        </View>
      );
    }
  }

  // schermo di caricamento per gestire il caricamento dell'app
  return <LoadingScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Un azzurro chiaro e piacevole
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    width: "90%", // Larghezza della box
    backgroundColor: "#ffffff", // Sfondo bianco per la box
    borderRadius: 15, // Angoli arrotondati
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Effetto ombra su Android
  },
  text: {
    fontSize: 18,
    color: "#333", // Testo scuro per un buon contrasto
    textAlign: "center",
    marginBottom: 20, // Spazio maggiore per separare il testo dagli altri elementi
    lineHeight: 24, // Migliora la leggibilità
  },
  buttonContainer: {
    width: "100%", // Adatta la larghezza del bottone alla box
    borderRadius: 25, // Arrotonda il contenitore
    overflow: "hidden", // Assicura che il bordo sia visibile
    elevation: 5, // Effetto ombra su Android
  },
});
