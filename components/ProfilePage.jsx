import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfilePage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Page</Text>
        </View>
    )
}
export default ProfilePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#000000'
    }
})