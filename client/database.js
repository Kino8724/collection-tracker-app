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

export { getAllTables, setUpTables, createNewCollection, getAllCollections }