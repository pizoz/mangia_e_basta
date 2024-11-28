import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';

const Home = ({navigation}) => {
    return (
        <View>
            <Text>Home</Text>
            <Button title="Reset" onPress={() => ViewModel.reset()}/>
        </View>
    )
}
export default Home;