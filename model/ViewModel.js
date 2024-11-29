import CommunicationController from "./CommunicationController";
import StorageManager from "./StorageManager";
import PositionController from "./PositionController";
class ViewModel {
  
  static storageManager = null;
  static positionController = null;

  static async initDB(db) {
    // il valore db indica un booleano: true se si vuole aprire il database, false altrimenti
    // in entrambi i casi si inizializza lo storageManager se non è già stato inizializzato
    if (!this.storageManager) {
      this.storageManager = new StorageManager();
    }
    if (!this.positionController) {
      this.positionController = new PositionController();
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
      const newUser = await CommunicationController.createUser();
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
  static async GetMenu(mid, sid) {
    await this.initDB(false);
    try {
      return await CommunicationController.GetMenu(mid, sid, this.positionController.location.coords.latitude, this.positionController.location.coords.longitude);
    } catch (error) {
      console.log(error);
    }
    return null;
  }
  static async getPositionController() {
    await this.initDB(false);
    return this.positionController;
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
  static async getMenuDetail(menu, sid) {
    await this.initDB(true);

    const newmenu = await this.GetMenu(menu.mid, sid);
    if (!newmenu) {
      return null;
    }
    menu = {...menu, ...newmenu}
    //restituisce menu, con immagine e longDesc
    return menu;
  }

  static async getHomePageMenu(menu, sid){
    const image = await this.getUpdatedImage(menu.mid, sid, menu.imageVersion);
    menu.image = `data:image/png;base64,${image}`;
    //questo menu ha info menu e immagine (no longdesc)
    console.log(menu.image == null)
    return menu;
  }

  static async reset() {
    // elimina il database e l'utente dall'AsyncStorage
    await this.initDB(true);
    await this.storageManager.deleteDB();
    await this.storageManager.deleteUserAsync();
  }

  static async getMenus(sid) {
    console.log("getMenus")
    // restituisce i 20 menu più vicini alla posizione passata
    let menus = [];
    menus = await CommunicationController.GetMenus(this.positionController.location.coords.latitude, this.positionController.location.coords.longitude, sid);
    for (let menu of menus) {
      menu = await this.getHomePageMenu(menu,sid)
    }
    return menus;
  }
  static async checkFirstRun() {
    console.log("checkFirstRun");
    await this.initDB(false);
    let firstRun = false;
    let user = null;
    try {
      user = await this.storageManager.getUserAsync();
    } catch (error) {
      console.log(error);
    }
    if (!user) {
      firstRun = true;
    }
    return firstRun;
  }
  static async initApp() {
    console.log("initApp");
    await this.initDB(false);
    const firstRun = await this.checkFirstRun();
    
    if (firstRun) {
      return {firstRun: firstRun, user: null, positionController: this.positionController};
    } else {
      const user = await this.getUserFromAsyncStorage();
      return {firstRun: firstRun, user: user, positionController: this.positionController};
    }
  }
  static async getMenuDetail(menu, user) {
    let newMenu = await CommunicationController.GetMenu(menu.mid, user.sid, this.positionController.location.coords.latitude, this.positionController.location.coords.longitude);
    menu = {...menu, ...newMenu};
    return menu;
  }
}

export default ViewModel;
