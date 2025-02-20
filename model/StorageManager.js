import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class StorageManager {
  // Database 
  constructor() {
    this.db = null;
  }

  // apre il database e crea le tabelle se non esistono 
  async openDB() {
    console.log("openDB");

    // Apre il database 
    this.db = await SQLite.openDatabaseAsync("usersDB", {
      useNewConnection: true,
    });

    // Crea le tabelle se non esistono
    // users: contiene l'uid e il sid dell'utente
    // menuImages: contiene le immagini dei menu con mid, imageVersion e image
    const query =
      "CREATE TABLE IF NOT EXISTS users (ID INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, sid TEXT); CREATE TABLE IF NOT EXISTS menuImages (mid INTEGER PRIMARY KEY, imageVersion INTEGER, image TEXT)";
    await this.db.execAsync(query);
  }

  // salva l'utente nel database 
  async saveUserInDB(uid, sid) {
    console.log("saveUserInDB");
    const query = "INSERT INTO users (uid, sid) VALUES (?, ?)";
    await this.db.runAsync(query, uid, sid);
  }
  
  async getUserFromDB() {
    console.log("getUserFromDB");
    const query = "SELECT * FROM users";
    const result = await this.db.getFirstAsync(query);
    return result;
  }
  async getAllUsersFromDB() {
    console.log("getAllUsersFromDB");
    const query = "SELECT * FROM users";
    const result = await this.db.getAllAsync(query);
    return result;
  }

  // recupera l'immagine dal database
  async getImageFromDB(mid) {
    console.log("getImageFromDB");
    const query = "SELECT * FROM menuImages WHERE mid = ?";
    const result = await this.db.getFirstAsync(query, mid);
    return result;
  }

  // salva l'immagine nel database
  async saveImageInDB(mid, imageVersion, image, alreadyExists) {
    console.log("saveImageInDB");
    if (alreadyExists) {
      const query = "UPDATE menuImages SET imageVersion = ?, image = ? WHERE mid = ?";
      await this.db.runAsync(query, imageVersion, image, mid);
    } else {
      const query = "INSERT INTO menuImages (mid, imageVersion, image) VALUES (?, ?, ?)";
      await this.db.runAsync(query, mid, imageVersion, image);
    }
  }
  async deleteUserFromDB() {
    console.log("deleteUserFromDB");
    const query = "DELETE FROM users";
    await this.db.runAsync(query);
  }
  async closeDB() {
    console.log("closeDB");
    await this.db.closeAsync();
  }
  async deleteDB() {
    console.log("deleteDB");
    await this.db.execAsync("DROP TABLE users");
    await this.db.execAsync("DROP TABLE menuImages");

  }

  // Async storage

  async saveUserAsync(user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }
  
  // recupera l'utente da async storage 
  async getUserAsync() {
    console.log("getUserAsync");
    let user = null;
    try {
      user = await AsyncStorage.getItem("user");
    } catch (error) {
      console.log(error);
    }
    return JSON.parse(user);
  }

  async deleteUserAsync() { // cambia da lstScreen Data a lastMenu


    console.log("deleteUserAsync");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("lastScreen");
    await AsyncStorage.removeItem("lastMenu");
  }
  
  // salva l'ultima schermata visitata e l'ultimo menu visitato in async storage
  async saveLastScreenAsync(screen, lastMenu) {
    if (lastMenu) {
      await AsyncStorage.setItem("lastMenu", JSON.stringify(lastMenu));
    }
    if (screen) {
      await AsyncStorage.setItem("lastScreen", screen);
    }
  }

  // restituisce un oggetto con l'ultima schermata visitata e l'ultimo menu visitato
  async getLastScreenAsync() {
    console.log("getLastScreenAsync");
    const screen = await AsyncStorage.getItem("lastScreen");
    const lastMenu = await AsyncStorage.getItem("lastMenu");
    

    return { screen, lastMenu: JSON.parse(lastMenu) };
  }

  // recupera l'ultimo menu visitato da async storage
  async getLastMenuAsync() {
    console.log("getLastMenuAsync");
    const lastMenu = await AsyncStorage.getItem("lastMenu");
    return JSON.parse(lastMenu);
  }
}
