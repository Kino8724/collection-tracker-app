import * as React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { NavigationContainer, useIsFocused, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  updateItemById,
  updateCollectionById,
  setUpTables,
  getAllTables,
  createNewCollection,
  getAllCollections,
  removeCollectionById,
  getCollectionById,
  getItemById,
  createNewItem,
  removeItemById,
  getAllItemsByCollection,
  getAllItems
} from './database';



function HomeScreen() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [collections, setCollections] = React.useState([])
  const [items, setItems] = React.useState([])
  React.useEffect(() => {
    getAllCollections(setCollections)
    getAllItems(setItems)
    console.log(collections)
    console.log(items)

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
                navigation.navigate("Collection Details", {
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
      <Button title='Add New Collection' onPress={() => navigation.navigate("New Collection")} />
    </View>
  );
}

function CreateCollectionScreen() {
  const navigation = useNavigation()
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

function CollectionUpdateScreen({ route }) {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const [collection, setCollection] = React.useState([])
  const { collectionId } = route.params;
  React.useEffect(() => {
    getCollectionById(collectionId, setCollection)
  }, [isFocused])
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <TextInput value={collection.name} onChangeText={newText => setCollection({ ...collection, name: newText })} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <Button title='Submit' onPress={() => {
        console.log("Update submitted with: " + collection.name + ", " + collection.description)
        try {
          updateCollectionById(collection.id, collection.name, collection.description)
        } catch (error) {
          console.log(error)
        }
        navigation.goBack()
      }} />
    </View>
  )
}

function CollectionDetailsScreen({ route }) {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const [items, setItems] = React.useState([])
  const [collection, setCollection] = React.useState([])
  const { collectionId } = route.params;
  React.useEffect(() => {
    getCollectionById(collectionId, setCollection)
    getAllItemsByCollection(collectionId, setItems)
  }, [isFocused])
  function handleRemoveButton(id) {
    let newList = items.filter((item) => item.id != id);
    setItems(newList)
  }
  return (
    < View style={{ alignItems: 'center', justifyContent: 'center', padding: 25, gap: 10 }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 15 }}>{collection.name}</Text>
      {
        items.map((item) => {
          return (
            <View key={item.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'black' }}>
              <Button title={item.name} onPress={() => {
                navigation.navigate("Item Details", {
                  itemId: item.id
                })
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
      <Button title='Edit Collection Name' onPress={() => navigation.navigate("Update Collection", { collectionId: collection.id })} />
    </View >
  );
}

function CreateItemScreen({ route }) {
  const navigation = useNavigation()
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
        navigation.goBack()
      }} />
    </View>
  )
}

function ItemDetailsScreen({ route }) {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const [item, setItem] = React.useState([])
  const { itemId } = route.params;
  React.useEffect(() => {
    getItemById(itemId, setItem)
  }, [isFocused])
  return (
    <View style={{ padding: 25, gap: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 15 }}>{item.name}</Text>
      <Text style={{ fontSize: 18 }}>{item.description}</Text>
      <Button title='Edit Item' onPress={() => {
        navigation.navigate("Update Item", { itemId: item.id })

      }} />
    </View>
  )
}

function ItemUpdateScreen({ route }) {
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const [item, setItem] = React.useState([])
  const { itemId } = route.params;
  React.useEffect(() => {
    getItemById(itemId, setItem)
  }, [isFocused])
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <TextInput value={item.name} onChangeText={newText => setItem({ ...item, name: newText })} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <TextInput value={item.description} onChangeText={newText => setItem({ ...item, description: newText })} style={{
        borderWidth: 2, borderColor: 'black', padding: 15
      }} />
      <Button title='Submit' onPress={() => {
        console.log("Update submitted with: " + item.name + ", " + item.description)
        try {
          updateItemById(item.id, item.name, item.description)
        } catch (error) {
          console.log(error)
        }
        navigation.goBack()
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
        <Stack.Screen name="Collection Details" component={CollectionDetailsScreen} />
        <Stack.Screen name="New Collection" component={CreateCollectionScreen} />
        <Stack.Screen name="NewItem" component={CreateItemScreen} />
        <Stack.Screen name="Item Details" component={ItemDetailsScreen} />
        <Stack.Screen name="Update Item" component={ItemUpdateScreen} />
        <Stack.Screen name="Update Collection" component={CollectionUpdateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
