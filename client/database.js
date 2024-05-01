import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("collections.db")
const setUpTables = () => {
  db.transaction(
    tx => {
      tx.executeSql(
        "create table if NOT EXISTS collections(id integer primary key autoincrement, name text);", []
      )
      tx.executeSql("create table if NOT EXISTS items(id integer primary key autoincrement, name text, description text, collection_id integer, foreign key(collection_id) references collections(id));", [])
    }
  )
}

const getAllTables = (successCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "SELECT tbl_name FROM sqlite_master WHERE type='table';",
        [],
        (_, { rows: { _array } }) => {
          successCallback(_array)
        }
      )
    }
  )
}

const getAllCollections = (successCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "select * from collections;",
        [],
        (_, { rows: { _array } }) => {
          successCallback(_array)
        }
      )
    }
  )
}

const createNewCollection = (collectionName) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "insert into collections(name) values(?)",
        [collectionName]
      )
    }
  )

}

const removeCollectionById = (id) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "delete from collections where id=?;",
        [id]
      )
    }
  )
}

const getCollectionById = (id, successCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "select * from collections where id=?;",
        [id],
        (_, { rows: { _array } }) => {
          let arr = JSON.stringify(_array)
          console.log("JSON String initially: " + arr)
          let finalArray = "";
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "[") {
              continue
            }
            else if (arr[i] == "]") {
              continue
            }
            else {
              finalArray += arr[i]
            }

          }
          console.log("Final Array after parsing" + finalArray)


          successCallback(JSON.parse(finalArray))
        }
      )
    }
  )
}

const createNewItem = (itemName, itemDescription, collectionId) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "insert into items(name, description, collection_id) values(?,?,?);",
        [itemName, itemDescription, collectionId]
      )
    }
  )
}

const getAllItems = (successCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "select * from items",
        [],
        (_, { rows: { _array } }) => {
          successCallback(_array)
        }
      )
    }
  )
}

const getItemById = (id, successCallback) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "select * from collections where id=?;",
        [id],
        (_, { rows: { _array } }) => {
          let arr = JSON.stringify(_array)
          console.log("JSON String initially: " + arr)
          let finalArray = "";
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "[") {
              continue
            }
            else if (arr[i] == "]") {
              continue
            }
            else {
              finalArray += arr[i]
            }

          }
          console.log("Final Array after parsing" + finalArray)


          successCallback(JSON.parse(finalArray))
        }
      )
    }
  )
}

const removeItemById = (id) => {
  db.transaction(
    tx => {
      tx.executeSql(
        "delete from items where id=?;",
        [id]
      )
    }
  )
}

export { getAllTables, setUpTables, createNewCollection, getAllCollections, removeCollectionById, getCollectionById, getAllItems, getItemById, removeItemById, createNewItem }
