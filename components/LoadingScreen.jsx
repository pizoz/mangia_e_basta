import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

export default LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require("../assets/logo_no_nome.jpg")} style={styles.image}/>
            <ActivityIndicator size="large" color="#000000"/>
        </View>
    )
}
const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 200,
        height: 200,
    },
}