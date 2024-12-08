import CommunicationController from "./CommunicationController";
import StorageManager from "./StorageManager";
import PositionController from "./PositionController";
import * as Location from "expo-location";
class ViewModel {
  static storageManager = null;
  static positionController = null;
  static lastMenu = null;
  static user = null;
  static lastOid = null;
  // Inizializza StorageManager e PositionController, nel caso in cui ci sia bisogno di aprire il database, lo apre
  static async initViewModel(db) {
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
  // Restituisce l'utente dal database, se non lo trova, lo crea, lo salva nel database e lo restituisce
  static async getUserFromDB() {
    await this.initViewModel(true);
    const user = await this.storageManager.getUserFromDB();
    if (!user) {
      const newUser = await CommunicationController.createUser();
      await this.storageManager.saveUserInDB(newUser.uid, newUser.sid);
      return newUser;
    } else {
      return user;
    }
  }
  // Restituisce l'utente dall'AsyncStorage, se non lo trova, lo crea, lo salva nell'AsyncStorage e lo restituisce
  static async getUserFromAsyncStorage() {
    await this.initViewModel(false);
    console.log("getUserFromAsyncStorage");

    // Cerco l'utente nell'AsyncStorage
    let user = null;
    try {
      user = await this.storageManager.getUserAsync();
    } catch (error) {
      console.log(error);
    }
    // Se non lo trovo, chiedo al server di crearlo e lo salvo nell'AsyncStorage
    //
    if (!user) {
      const newUser = await CommunicationController.createUser();
      const fullUser = await CommunicationController.getUser(
        newUser.uid,
        newUser.sid
      );
      const finalUser = { ...newUser, ...fullUser };

      try {
        await this.storageManager.saveUserAsync(finalUser);
      } catch (error) {
        console.log(error);
      }
      // lo restituisco
      return finalUser;
    } else {
      // altrimenti lo restituisco direttamente dall'AsyncStorage
      return user;
    }
  }
  // Restituisce un menu senza immagine
  static async GetMenu(mid, sid) {
    await this.initViewModel(false);
    console.log(
      this.positionController.location.coords.latitude,
      this.positionController.location.coords.longitude
    );

    try {
      return await CommunicationController.GetMenu(
        mid,
        sid,
        this.positionController.location.coords.latitude,
        this.positionController.location.coords.longitude
      );
    } catch (error) {
      console.log(error);
    }
    return null;
  }
  // Restituisce il PositionController
  static async getPositionController() {
    await this.initViewModel(false);
    return this.positionController;
  }
  // Restituisce l'immagine aggiornata di un menu. Se non la trova nel db o quella trovata è vecchia, la scarica dal server e la salva nel db
  //  alla fine dell'esecuzione restituisce l'immagine in base64 e sarà salvata nel db
  static async getUpdatedImage(mid, sid, lastVersion) {
    console.log("getUpdatedImage");
    // se Db non è aperto lo apro
    await this.initViewModel(true);
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
  // Restituisce il menu con immagine e longDesc, pronto per essere visualizzato in MenuDetail
  static async getMenuDetail(menu, sid) {
    await this.initViewModel(true);

    const newmenu = await this.GetMenu(menu.mid, sid);
    if (!newmenu) {
      return null;
    }
    menu = { ...menu, ...newmenu };
    //restituisce menu, con immagine e longDesc
    this.lastMenu = menu;
    return menu;
  }
  // Restituisce il menu con l'immagine aggiornata, pronto per essere visualizzato in HomePage
  static async getHomePageMenu(menu, sid) {
    const image = await this.getUpdatedImage(menu.mid, sid, menu.imageVersion);
    menu.image = `data:image/png;base64,${image}`;
    //questo menu ha info menu e immagine (no longdesc)
    return menu;
  }
  // Resetta il database e l'utente dall'AsyncStorage
  static async reset() {
    // elimina il database e l'utente dall'AsyncStorage
    await this.initViewModel(true);
    await this.storageManager.deleteDB();
    await this.storageManager.deleteUserAsync();
  }
  // Restituisce i 20 menu più vicini alla posizione passata con l'immagini aggiornate
  static async getMenus(sid) {
    console.log("getMenus");
    // restituisce i 20 menu più vicini alla posizione passata
    let menus = [];
    menus = await CommunicationController.GetMenus(
      this.positionController.location.coords.latitude,
      this.positionController.location.coords.longitude,
      sid
    );
    for (let menu of menus) {
      menu = await this.getHomePageMenu(menu, sid);
    }
    return menus;
  }
  static async checkFirstRun() {
    console.log("checkFirstRun");
    await this.initViewModel(false);
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
    //  inizializza il positionController e lo storageManager
    await this.initViewModel(false);
    // controlla se è il primo avvio dell'app controllando se c'è un utente nell'AsyncStorage
    const firstRun = await this.checkFirstRun();
    // se è la prima volta che avviamo l'app restituisce un oggetto con firstRun a true e user a null
    if (firstRun) {
      return { firstRun: firstRun, user: null, location: null };
    } else {
      // altrimenti restituisce false,  l'utente trovato nell'AsyncStorage e la posizione attuale
      const user = await this.getUserFromAsyncStorage();
      this.user = user;
      await this.positionController.getLocationAsync();
      return {
        firstRun: firstRun,
        user: user,
        location: this.positionController.location,
      };
    }
  }
  static async getMenuDetail(menu, user) {
    let newMenu = await CommunicationController.GetMenu(
      menu.mid,
      user.sid,
      this.positionController.location.coords.latitude,
      this.positionController.location.coords.longitude
    );
    menu = { ...menu, ...newMenu };
    return menu;
  }
  static async getAddress() {
    const address = await Location.reverseGeocodeAsync({
      latitude: this.positionController.location.coords.latitude,
      longitude: this.positionController.location.coords.longitude,
    });
    return address[0];
  }
  static async getLocation() {
    await this.positionController.getLocationAsync();
  }
  static async getDeliveryTime(minutes) {
    let string = "";
    if (minutes == 0) {
      return "Immediata";
    }
    if (minutes >= 60 * 24) {
      string += `${Math.floor(minutes / (60 * 24))} giorni `;
      minutes = minutes % (60 * 24);
    }
    if (minutes >= 60) {
      string += `${Math.floor(minutes / 60)} ore `;
      minutes = minutes % 60;
    }
    if (minutes > 0) {
      string += `${minutes} minuti`;
    }
    return string;
  }
  static isValidUser(user) {
    if (!user) {
      return false;
    }
    if (
      !user.uid ||
      !user.sid ||
      !user.firstName ||
      !user.lastName ||
      !user.cardFullName ||
      !user.cardNumber ||
      user.cardExpireMonth === null ||
      user.cardExpireYear === null ||
      !user.cardCVV
    ) {
      return false;
    }
    return true;
  }
  static getLastMenu() {
    return this.lastMenu;
  }
  //restituisce coordinate di location del positionController con latitudine e longitudine
  static getLocationCoords() {
    return this.positionController.location.coords;
  }

  //conferma l'ordine (quando il profilo è già completo) e lo invia al server
  static async confirmOrder(menu, user, coords) {
    try {
      let order = await CommunicationController.createOrder(
        menu.mid,
        user.sid,
        coords.latitude,
        coords.longitude
      );
      this.lastOid = order.oid;
      this.user = {
        ...user,
        lastOid: order.oid,
        orderStatus: order.status,
        orderName: menu.name,
      };
      //salva user nello storage con l'oid e lo status dell'ordine
      await this.storageManager.saveUserAsync(this.user);
      return order;
    } catch (error) {
      console.log(error);
      if (
        error.message ===
        'Error message from the server. HTTP status: 409 {"message":"User already has an active order"}'
      ) {
        const customError = new Error("Hai già un ordine attivo");
        customError.status = 409; // Imposta il codice di stato personalizzato
        throw customError; // Lancia l'errore personalizzato
      }
      throw error;
    }
  }
  //restituisce l'ordine con l'oid passato
  static async getOrder(oid, sid) {
    return await CommunicationController.getOrder(oid, sid);
  }
}

export default ViewModel;
