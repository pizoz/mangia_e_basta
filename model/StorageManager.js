import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class StorageManager {
  // Database
  constructor() {
    this.db = null;
  }
  async openDB() {
    // apre il database e crea le tabelle se non esistono 
    // TODO: la tabella degli utenti serve? Secondo me no
    console.log("openDB");
    this.db = await SQLite.openDatabaseAsync("usersDB", {
      useNewConnection: true,
    });
    const query =
      "CREATE TABLE IF NOT EXISTS users (ID INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, sid TEXT); CREATE TABLE IF NOT EXISTS menuImages (mid INTEGER PRIMARY KEY, imageVersion INTEGER, image TEXT)";
    await this.db.execAsync(query);
  }
  async saveUserInDB(uid, sid) {
    console.log("saveUserInDB");
    const query = "INSERT INTO users (uid, sid) VALUES (?, ?)";
    await this.db.runAsync(query, uid, sid);
  }
  
  async createUserInDB() {
    console.log("createUserInDB");
    await User.create().then((user) => {
      this.saveUser(user.uid, user.sid).then(() => {
        console.log("Utente salvato");
      });
    });
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
  async getImageFromDB(mid) {
    console.log("getImageFromDB");
    const query = "SELECT * FROM menuImages WHERE mid = ?";
    const result = await this.db.getFirstAsync(query, mid);
    return result;
  }
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

  async saveUserAsync(uid, sid) {
    let user = { uid: uid, sid: sid };
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }
  
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
  async deleteUserAsync() {
    console.log("deleteUserAsync");
    await AsyncStorage.removeItem("user");
  }
}
