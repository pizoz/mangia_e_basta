import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';

const MenuItem = ({navigation}) => {


    return (
        <View>
            <Text>Menu</Text>
        </View>
    )
}
export default Menu;

const DishListItem = ({ dish, handleShowDetails, handleDelete }) => {
    return (
        <li key={dish.id}>
            <h2>{dish.name}</h2>
            <p>{dish.shortDescription}</p>
            <button onClick={() => handleShowDetails(dish)}>Show details</button>
            <button onClick={() => handleDelete(dish)}>Delete</button>
        </li>
    );
};

export default DishListItem;
