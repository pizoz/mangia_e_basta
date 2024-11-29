import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';
<<<<<<< HEAD
import Menu from './Menu'
import { useEffect } from 'react';

const Home = ({navigation}) => {
=======

// import Menu from './Menu'

import { useEffect } from 'react';

const Home = ({navigation, route}) => {
    
>>>>>>> 2910d759619fe3939f6cdbfd6c2827163f642cef
    useEffect(() => {
        console.log(route.params.user)
        // al caricamento della Homepage, traduco la posizione nella via in cui si trova l'utente
        //ABBIAMO I MENUS
        ViewModel.getMenus(route.params.user.sid).then( (result) => {
            console.log(result)
        })
    },[])
    return (
        <View>
            <Text>Home</Text>
            <Button title="Reset" onPress={() => ViewModel.reset()}/>
        </View>
    )
}
export default Home;