import * as React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setUpTables, getAllTables, createNewCollection, getAllCollections, removeCollectionById } from './database';


function HomeScreen({ navigation }) {
  const isFocused = useIsFocused()
  const [collections, setCollections] = React.useState([])
  React.useEffect(() => {
    getAllCollections(setCollections)
    console.log(collections)

  }, [isFocused])
  function handleRemoveButton(id) {
    let newList = collections.filter((collection) => collection.id != id);
    setCollections(newList)
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {
        collections.map((collection) => {
          return (
            <View key={collection.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text>{collection.name}</Text>
              <Button title='Remove' onPress={() => {
                handleRemoveButton(collection.id)
                removeCollectionById(collection.id)
              }
              } />
            </View>
          )
        })
      }
      <Button title='Add New Collection' onPress={() => navigation.navigate("NewCollection")} />
      <Button title='Go to Details' onPress={() => navigation.navigate("Details")} />
    </View>
  );
}
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title='Go to Home' onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
function CreateCollectionScreen({ navigation }) {
  const [name, setName] = React.useState("")
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput placeholder='Collection Name:' onChangeText={newText => setName(newText)} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <Button title='Submit' onPress={() => {
        console.log("Button submitted with: " + name)
        createNewCollection(name)
        navigation.navigate("Home")
      }} />
    </View>

  )
}

const Stack = createNativeStackNavigator();

function App() {
  React.useEffect(() => {
    setUpTables()
  })
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="NewCollection" component={CreateCollectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
