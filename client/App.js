import * as React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setUpTables, getAllTables, createNewCollection, getAllCollections, removeCollectionById, getCollectionById } from './database';


function HomeScreen({ navigation }) {
  const isFocused = useIsFocused()
  const [collections, setCollections] = React.useState([])
  // const [test, setTest] = React.useState([])
  React.useEffect(() => {
    getAllCollections(setCollections)
    // getCollectionById(1, setTest)
    // console.log("test: " + test[0].name)
    console.log(collections)

  }, [isFocused])
  function handleRemoveButton(id) {
    let newList = collections.filter((collection) => collection.id != id);
    setCollections(newList)
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {
        collections.map((collection) => {
          return (
            <View key={collection.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'black' }}>
              <Button title={collection.name} onPress={() => {
                navigation.navigate("Details", {
                  collectionId: collection.id
                })
              }} />
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
    </View>
  );
}
function DetailsScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const [collection, setCollection] = React.useState([])
  const { collectionId } = route.params;
  React.useEffect(() => {
    getCollectionById(collectionId, setCollection)
    console.log("String collection: " + collection)
  }, [isFocused])
  return (
    < View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }
    }>
      <Text>Input ID: {collection.name}</Text>
    </View >
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
