import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Form = ({ route }) => {
  const navigation = useNavigation();
  const { user, before } = route.params;

  const onClickOnButton = (formScreen) => {
    if (formScreen === "Info") {
      navigation.navigate("ProfilePage", { user: user });
    } else if (formScreen === "Home") {
      navigation.navigate("Home", { user: user, screen: "ConfirmOrder" });

      navigation.popToTop();
    }

    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Form
      </Text>
      {before === "ProfilePage" ? (
        <Button title="Save" onPress={() => onClickOnButton("Info")} />
      ) : before === "CompletaProfilo" ? (
        <Button title="Save" onPress={() => onClickOnButton("Home")} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Usa tutto lo spazio disponibile
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center',     // Centra orizzontalmente
    padding: 20,              // Aggiungi un po' di padding
    backgroundColor: '#f5f5f5', // Colore di sfondo chiaro
  },
  text: {
    fontSize: 24,             // Imposta una dimensione del font per il testo
    fontWeight: 'bold',       // Rendi il testo in grassetto
    marginBottom: 20,         // Aggiungi un po' di spazio sotto il testo
  },
});

export default Form;
