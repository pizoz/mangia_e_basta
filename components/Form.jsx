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

const Form = ({ route }) => {
  const { before } = route.params != null ? route.params : { before: 'ProfilePage' };
  const user = ViewModel.user;
  const navigation = useNavigation();



  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    cardFullName: '',
    cardNumber: '',
    cardExpireMonth: '',
    cardExpireYear: '',
    cardCVV: '',
  });

  const handleInputChange = (field, value) => {
    setNewUser((prevObj) => ({ ...prevObj, [field]: value }));
  };

  const validateForm = () => {
    const errors = [];
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (newUser.firstName) {
      if (newUser.firstName.length > 15) {
        errors.push('First Name must be 15 characters or less');
      }
      if (!nameRegex.test(newUser.firstName)) {
        errors.push('First Name must contain only letters and spaces');
      }
    }

    if (newUser.lastName) {
      if (newUser.lastName.length > 15) {
        errors.push('Last Name must be 15 characters or less');
      }
      if (!nameRegex.test(newUser.lastName)) {
        errors.push('Last Name must contain only letters and spaces');
      }
    }

    if (newUser.cardFullName) {
      if (newUser.cardFullName.length > 31) {
        errors.push('Card Full Name must be 31 characters or less');
      }
      if (!nameRegex.test(newUser.cardFullName)) {
        errors.push('Card Full Name must contain only letters and spaces');
      }
    }

    if (newUser.cardNumber && (!/^\d+$/.test(newUser.cardNumber) || newUser.cardNumber.length !== 16)) {
      errors.push('Card Number must be exactly 16 digits');
    }

    if (newUser.cardExpireMonth) {
      const month = parseInt(newUser.cardExpireMonth, 10);
      if (isNaN(month) || month < 1 || month > 12) {
        errors.push('Card Expire Month must be between 1 and 12');
      }
    }

    if (newUser.cardExpireYear && (!/^\d{4}$/.test(newUser.cardExpireYear)) && newUser.cardExpireYear < new Date().getFullYear()) {
      errors.push('Card Expire Year must be exactly 4 digits. The card cannot be expired');
    }

    if (newUser.cardCVV && (!/^\d{3}$/.test(newUser.cardCVV))) {
      errors.push('Card CVV must be exactly 3 digits');
    }

    return errors;
  };

  const onClickOnButton = async (formScreen) => {
    const errors = validateForm();

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

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
    if (!ViewModel.isValidUser({...bodyParams, uid: user.uid})) {
      Alert.alert('Validation Error', 'Please fill in all required fields to complete your profile');
      return;
    }
    try {
      await CommunicationController.UpdateUser(user.uid, user.sid, bodyParams);
    } catch (error) {
      console.log('Error in updating user: ', error);
      Alert.alert('Error', 'Failed to update user information');
      return;
    }

    let serverUser = await CommunicationController.getUser(user.uid, user.sid);
    serverUser = { ...serverUser, uid: user.uid, sid: user.sid };
    ViewModel.user = serverUser;
    try {
      await ViewModel.storageManager.saveUserAsync(serverUser);
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user information locally');
      return;
    }

    if (formScreen === 'Info') {
      navigation.navigate('ProfilePage', { user: serverUser });
    } else if (formScreen === 'Home') {
      navigation.navigate('Home', { user: serverUser, screen: 'ConfirmOrder' });
    }
  };

  const renderInput = (field, placeholder, icon, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={24} color="#ffffff" style={styles.inputIcon} />
      <TextInput
        value={newUser[field]}
        style={styles.input}
        onChangeText={(text) => handleInputChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#b3d4fc"
        keyboardType={keyboardType}
      />
    </View>
  );
  useEffect(() => {
    ViewModel.lastScreen = 'Form';
  }, []);
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
          <Text style={styles.title}>Update Profile</Text>
          {renderInput('firstName', 'First Name', 'person', 'default')}
          {renderInput('lastName', 'Last Name', 'people', 'default')}
          {renderInput('cardFullName', 'Card Full Name', 'card', 'default')}
          {renderInput('cardNumber', 'Card Number', 'card', 'numeric')}
          {renderInput('cardExpireMonth', 'Card Expire Month', 'calendar', 'numeric')}
          {renderInput('cardExpireYear', 'Card Expire Year', 'calendar', 'numeric')}
          {renderInput('cardCVV', 'Card CVV', 'lock-closed', 'numeric')}

          <TouchableOpacity
            style={styles.button}
            onPress={() => onClickOnButton(before === 'ProfilePage' ? 'Info' : 'Home')}
          >
            <Text style={styles.buttonText}>Save</Text>
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

