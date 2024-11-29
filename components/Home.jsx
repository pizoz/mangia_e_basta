import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';
<<<<<<< HEAD
import Menu from './Menu'

=======
import { useEffect } from 'react';
>>>>>>> bf180adb60eb964f0bfc9d99bcc61d571455acc9
const Home = ({navigation}) => {
    useEffect(() => {
        // al caricamento della Homepage, traduco la posizione nella via in cui si trova l'utente
    },[])
    return (
        <View>
            <Text>Home</Text>
            <Button title="Reset" onPress={() => ViewModel.reset()}/>
            <Menu></Menu>
        </View>
    )
}
export default Home;