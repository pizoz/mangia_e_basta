import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CommunicationController from '../model/CommunicationController';
import ViewModel from '../model/ViewModel';

// Form è il componente che permette all'utente di modificare il proprio profilo
const Form = ({ route }) => {
  // recupero la schermata da cui proviene l'utente, di default è ProfilePage 
  const { before } = route.params != null ? route.params : { before: 'ProfilePage' };
  const user = ViewModel.user;
  const navigation = useNavigation();

  //stato iniziale della form (vuoto)
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    cardFullName: '',
    cardNumber: '',
    cardExpireMonth: '',
    cardExpireYear: '',
    cardCVV: '',
  });

  // funzione che aggiorna lo stato newUser con i valori inseriti dall'utente
  const handleInputChange = (field, value) => {
    // aggiorno lo stato newUser con il campo field e il valore value
    setNewUser((prevObj) => ({ ...prevObj, [field]: value }));
  };

  // funzione che controlla che i campi inseriti siano validi
  const validateForm = () => {
    const errors = [];
    // regex per controllare che i campi siano composti solo da lettere e spazi
    const nameRegex = /^[a-zA-Z\s]+$/;

    // firstName deve contenere solo lettere e spazi e deve essere di 15 caratteri o meno
    if (newUser.firstName) {
      if (newUser.firstName.length > 15) {
        errors.push('Il nome deve essere di 15 caratteri o meno');
      }
      if (!nameRegex.test(newUser.firstName)) {
        errors.push('Il nome deve contenere solo lettere e spazi');
      }
    }

    // lastName deve contenere solo lettere e spazi e deve essere di 15 caratteri o meno
    if (newUser.lastName) {
      if (newUser.lastName.length > 15) {
        errors.push('Il cognome deve essere di 15 caratteri o meno');
      }
      if (!nameRegex.test(newUser.lastName)) {
        errors.push('Il cognome deve contenere solo lettere e spazi');
      }
    }

    // cardFullName deve contenere solo lettere e spazi e deve essere di 31 caratteri o meno
    if (newUser.cardFullName) {
      if (newUser.cardFullName.length > 31) {
        errors.push('Il nome sulla carta deve essere di 31 caratteri o meno');
      }
      if (!nameRegex.test(newUser.cardFullName)) {
        errors.push('Il nome sulla carta deve contenere solo lettere e spazi');
      }
    }

    // cardNumber deve essere di 16 cifre esatte e deve contenere solo numeri
    if (newUser.cardNumber && (!/^\d+$/.test(newUser.cardNumber) || newUser.cardNumber.length !== 16)) {
      errors.push('Il numero della carta deve essere esattamente di 16 cifre');
    }

    // cardExpireMonth deve essere un numero tra 1 e 12
    if (newUser.cardExpireMonth) {
      const month = parseInt(newUser.cardExpireMonth, 10);
      if (isNaN(month) || month < 1 || month > 12) {
        errors.push('Il mese di scadenza della carta deve essere un numero tra 1 e 12');
      }
    }

    // cardExpireYear deve essere di 4 cifre esatte e deve contenere solo numeri
    if (newUser.cardExpireYear && (!/^\d{4}$/.test(newUser.cardExpireYear)) ) {
      errors.push("L'anno di scadenza della carta deve essere esattamente di 4 cifre");
    }

    // cardExpireYear non può essere minore dell'anno corrente
    if (newUser.cardExpireYear && parseInt(newUser.cardExpireYear, 10) < new Date().getFullYear()) {
      errors.push('Non puoi usare una carta scaduta!');
    }

    // cardCVV deve essere di 3 cifre esatte e deve contenere solo numeri
    if (newUser.cardCVV && (!/^\d{3}$/.test(newUser.cardCVV))) {
      errors.push('Il CVV della carta deve essere esattamente di 3 cifre');
    }

    return errors;
  };

  // funzione che permette di salvare le modifiche fatte dall'utente al profilo
  const onClickOnButton = async (formScreen) => {
    // controllo che i campi siano validi
    const errors = validateForm();

    // se ci sono errori, mostro un alert
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    // parametri da passare al server per aggiornare l'utente, se il campo è vuoto, mantengo il valore attuale dell'utente 
    let bodyParams = {
      firstName: newUser.firstName !== '' ? newUser.firstName : user.firstName,
      lastName: newUser.lastName !== '' ? newUser.lastName : user.lastName,
      cardFullName: newUser.cardFullName !== '' ? newUser.cardFullName : user.cardFullName,
      cardNumber: newUser.cardNumber !== '' ? newUser.cardNumber : user.cardNumber,
      cardExpireMonth: newUser.cardExpireMonth !== '' ? newUser.cardExpireMonth : user.cardExpireMonth,
      cardExpireYear: newUser.cardExpireYear !== '' ? newUser.cardExpireYear : user.cardExpireYear,
      cardCVV: newUser.cardCVV !== '' ? newUser.cardCVV : user.cardCVV,
      sid: user.sid,
    };

    // se i campi non sono validi, mostro un alert
    if (!ViewModel.isValidUser({...bodyParams, uid: user.uid})) {
      Alert.alert('Validation Error', 'Please fill in all required fields to complete your profile');
      return;
    }

    // se i campi sono validi, aggiorno l'utente sul server e localmente
    try {
      await CommunicationController.UpdateUser(user.uid, user.sid, bodyParams);
    } catch (error) {
      console.log('Error in updating user: ', error);
      // se c'è un errore, mostro un alert
      Alert.alert('Error', 'Failed to update user information');
      return;
    }

    // recupero l'utente aggiornato dal server
    let serverUser = await CommunicationController.getUser(user.uid, user.sid);
    // aggiungo uid e sid all'utente
    serverUser = { ...serverUser, uid: user.uid, sid: user.sid };
    // aggiorno lo user in ViewModel
    ViewModel.user = serverUser;
    // salvo l'utente localmente nell'async storage
    try {
      await ViewModel.storageManager.saveUserAsync(serverUser);
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user information locally');
      return;
    }

    // se before è Info, vado alla schermata ProfilePage di Profile, altrimenti vado alla schermata ConfirmOrder di Home
    if (formScreen === 'Info') {
      navigation.navigate('ProfilePage', { user: serverUser });
    } else if (formScreen === 'Home') {
      navigation.navigate('Home', { user: serverUser, screen: 'ConfirmOrder' });
    }
  };

  // funzione che renderizza un campo di input, quando l'utente digita nel campo, handleInputChange aggiorna newUser
  const renderInput = (field, placeholder, icon, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={24} color="#ffffff" style={styles.inputIcon} />
      <TextInput
        value={newUser[field]} // legge valore del campo corrispondente dallo stato newUser
        style={styles.input}
        onChangeText={(text) => handleInputChange(field, text)} // aggiorna lo stato newUser con il valore inserito dall'utente
        placeholder={placeholder}
        placeholderTextColor="#b3d4fc"
        keyboardType={keyboardType}
      />
    </View>
  );

  // salva Form come ultima pagina visitata
  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("Form");
  };

  // salva Form come ultima pagina visitata
  useEffect(() => {
    savePage();
  }, []);

  // renderizzo il form con i campi da compilare per modificare il profilo utente
  //campi renderInput : 1° nome del campo (key per la form), 2° placeholder, 3° icona, 4° tipo di tastiera 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={['#4a90e2', '#63a4ff']}
          style={styles.formContainer}
        >
          <Text style={styles.title}>Modifica Profilo</Text>
          {renderInput('firstName', 'First Name', 'person', 'default')}
          {renderInput('lastName', 'Last Name', 'people', 'default')}
          {renderInput('cardFullName', 'Card Full Name', 'card', 'default')}
          {renderInput('cardNumber', 'Card Number', 'card', 'numeric')}
          {renderInput('cardExpireMonth', 'Card Expire Month', 'calendar', 'numeric')}
          {renderInput('cardExpireYear', 'Card Expire Year', 'calendar', 'numeric')}
          {renderInput('cardCVV', 'Card CVV', 'lock-closed', 'numeric')}

          <TouchableOpacity
            style={styles.button}
            // se before è ProfilePage, al click del button Salva vado alla schermata Info, altrimenti vado alla Home
            onPress={() => onClickOnButton(before === 'ProfilePage' ? 'Info' : 'Home')}
          >
            <Text style={styles.buttonText}>Salva</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#4a90e2',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Form;

//Sintesi del flusso:
// 1. renderInput visualizza un campo di input, collegato a una proprietà di newUser.
// 2. Quando l'utente digita nel campo, handleInputChange aggiorna newUser.
// 3. Alla pressione del pulsante "Salva", validateForm utilizza i valori in newUser per verificare la validità della form.

