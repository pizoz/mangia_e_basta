import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [firstRun, setFirstRun] = useState(null);
  const [coords, setCoords] = useState(null);
  const [user, setUser] = useState(null);
  const [changed, setChanged] = useState(false);

  const checkFirstRun = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    if (!user) {
      setFirstRun(true);

    } else {
      setUser(user);
      setFirstRun(false);
    }
  }
  useEffect(() => {
    checkFirstRun().catch((e) => console.log(e));
  }, [changed]);

  if (firstRun) {
    return (
      <FirstStartComponent setChanged={setChanged} setCoords={setCoords} setUser={setUser}/>
    )
  }
  if (!coords && !firstRun) {
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  }
  return (
    <navigationContainer>
      <stack.Navigator>
        <stack.Screen name="Home" component={HomeScreen} />
        <stack.Screen name="Details" component={DetailsScreen} />
      </stack.Navigator>
    </navigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
