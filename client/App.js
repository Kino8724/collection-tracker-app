import * as React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  setUpTables,
  getAllTables,
  createNewCollection,
  getAllCollections,
  removeCollectionById,
  getCollectionById,
  getItemById,
  createNewItem,
  removeItemById,
  getAllItemsByCollection
} from './database';



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

function CreateCollectionScreen({ navigation }) {
  const [name, setName] = React.useState("")
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput placeholder='Collection Name:' onChangeText={newText => setName(newText)} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <Button title='Submit' onPress={() => {
        console.log("Button submitted with: " + name)
        try {
          createNewCollection(name)
        } catch (error) {
          console.log(error)
        }
        navigation.navigate("Home")
      }} />
    </View>

  )
}

function DetailsScreen({ route, navigation }) {
  const isFocused = useIsFocused();
  const [items, setItems] = React.useState([])
  const [collection, setCollection] = React.useState([])
  const { collectionId } = route.params;
  React.useEffect(() => {
    getCollectionById(collectionId, setCollection)
    getAllItemsByCollection(collectionId, setItems)
  }, [isFocused])
  return (
    < View style={{ alignItems: 'center', justifyContent: 'center', padding: 25 }}>
      <Text style={{ fontSize: 36, marginBottom: 25 }}>{collection.name}</Text>
      {
        items.map((item) => {
          return (
            <View key={item.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'black' }}>
              <Button title={item.name} onPress={() => {
                console.log(item.description)
              }} />
              <Button title='Remove' onPress={() => {
                handleRemoveButton(item.id)
                removeItemById(item.id)
              }
              } />
            </View>
          )
        })
      }
      <Button title='Add New Item' onPress={() => navigation.navigate("NewItem", { id: collection.id })} />
    </View >
  );
}

function CreateItemScreen({ route, navigation }) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [collectionId, setCollectionID] = React.useState(route.params.id);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <TextInput placeholder='Item Name:' onChangeText={newText => setName(newText)} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <TextInput placeholder='Description:' onChangeText={newText => setDescription(newText)} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <Button title='Submit' onPress={() => {
        console.log("Button submitted with: " + name + ", " + description + ", " + collectionId)
        try {
          createNewItem(name, description, collectionId)
        } catch (error) {
          console.log(error)
        }
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
        <Stack.Screen name="NewItem" component={CreateItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
