import CommunicationController from "../CommunicationController";
import StorageManager from "./StorageManager";
import User from "./User";
class ViewModel {
  
  static storageManager = null;

  static async initDB(db) {
    // il valore db indica un booleano: true se si vuole aprire il database, false altrimenti
    // in entrambi i casi si inizializza lo storageManager se non è già stato inizializzato
    if (!this.storageManager) {
      this.storageManager = new StorageManager();
    }
    if (db) {
      await this.storageManager.openDB();
    }
  }
  static async getUserFromDB() {

    await this.initDB(true);
    const user = await this.storageManager.getUserFromDB();
    if (!user) {
      const newUser = await CommunicationController.createUser();
      await this.storageManager.saveUserInDB(newUser.uid, newUser.sid);
      return newUser;
    } else {
      return user;
    }
  }
  static async getUserFromAsyncStorage() {
    await this.initDB(false);
    console.log("getUserFromAsyncStorage");

    // Cerco l'utente nell'AsyncStorage
    let user = null;
    try {
      user = await this.storageManager.getUserAsync();
    } catch (error) {
      console.log(error);
    }
    // Se non lo trovo, chiedo al server di crearlo e lo salvo nell'AsyncStorage
    // per user qui si intende la coppia uid, sid e non tutte le informazioni dell'utente
    if (!user) {
      const newUser = await User.create();
      try {
        await this.storageManager.saveUserAsync(newUser.uid, newUser.sid);
      } catch (error) {
        console.log(error);
      }
      // lo restituisco
      return newUser;
    } else {
      // altrimenti lo restituisco direttamente dall'AsyncStorage
      return user;
    }
  }
  static async GetMenu(mid, sid, lat, lng) {
    await this.initDB(false);
    try {
      return await CommunicationController.GetMenu(mid, sid, lat, lng);
    } catch (error) {
      console.log(error);
    }
    return null;
  }
  static async getUpdatedImage(mid, sid, lastVersion) {
    console.log("getUpdatedImage");
    // se Db non è aperto lo apro
    await this.initDB(true);
    // cerco l'immagine nel db
    let savedImage;
    try {
      savedImage = await this.storageManager.getImageFromDB(mid);
    } catch (error) {
      console.log(error);
    }
    let image;

    // se non la trovo la scarico dal server e la salvo nel db
    if (!savedImage) {
      console.log("No Image in DB");
      image = await CommunicationController.GetImage(mid, sid);
      await this.storageManager.saveImageInDB(
        mid,
        lastVersion,
        image.base64,
        false
      );
      return image.base64;
    }

    // se la trovo, ma la versione non è quella aggiornata allora la scarico dal server e la salvo nel db
    if (savedImage.imageVersion !== lastVersion) {
      console.log("Found old Image in DB");
      image = await CommunicationController.GetImage(mid, sid);

      await this.storageManager.saveImageInDB(
        mid,
        lastVersion,
        image.base64,
        true
      );
      return image.base64;
    }
    // se la trovo e la versione è quella aggiornata la restituisco
    return savedImage.image;
  }
  static async getMenuPage(mid, sid, lat, lng) {
    await this.initDB(true);

    const menu = await this.GetMenu(mid, sid, lat, lng);
    console.log("Menu: ", menu);
    if (!menu) {
      console.log("Menu non trovato");
      return null;
    }
    const image = await this.getUpdatedImage(mid, sid, menu.imageVersion);
    menu.image = `data:image/png;base64,${image}`;
    return menu;
  }
  static async reset() {
    // elimina il database e l'utente dall'AsyncStorage
    await this.initDB(true);
    await this.storageManager.deleteDB();
    await this.storageManager.deleteUserAsync();
  }

  static async getMenus(lat, long, sid) {
    // restituisce i 20 menu più vicini alla posizione passata e li filtra eliminando quelli vuoti
    let menus = [];
    menus = await CommunicationController.GetMenus(lat, long, sid);
    menus = menus.filter((menu) => {
      return menu.name !== "string";
    });
    return menus;
  }
}

export default ViewModel;
