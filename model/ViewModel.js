import CommunicationController from "./CommunicationController";
import StorageManager from "./StorageManager";
import PositionController from "./PositionController";
import * as Location from "expo-location";
class ViewModel {
  static storageManager = null;
  static positionController = null;
  static lastScreen = null;
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
    // in entrambi i casi si inizializza il positionController se non è già stato inizializzato
    if (!this.positionController) {
      this.positionController = new PositionController();
    }
    // se db è true, allora apro il database
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
    if (!user) {
      const newUser = await CommunicationController.createUser();
      const fullUser = await CommunicationController.getUser(
        newUser.uid,
        newUser.sid
      );
      const finalUser = { ...newUser, ...fullUser };

      try {
        await this.storageManager.saveUserAsync(finalUser);
        this.user = finalUser;
      } catch (error) {
        console.log(error);
      }
      // lo restituisco
      console.log(finalUser);
      return finalUser;
    } else {
      // altrimenti lo restituisco direttamente dall'AsyncStorage
      this.user = user;
      console.log(user);
      return user;
    }
  }

  // Restituisce un menu senza immagine ma con longDesc
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

  static async getMenu(mid, sid) {
    const coords = this.getLocationCoords();
    return await CommunicationController.GetMenu(
      mid,
      sid,
      coords.latitude,
      coords.longitude
    );
  }

  // Restituisce il PositionController
  static async getPositionController() {
    await this.initViewModel(false);
    return this.positionController;
  }

  // Restituisce l'immagine aggiornata di un menu. 
  // Se non la trova nel db o quella trovata è vecchia, la scarica dal server e la salva nel db
  // alla fine dell'esecuzione restituisce l'immagine in base64 e sarà salvata nel db
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
      // scarico l'immagine dal server
      image = await CommunicationController.GetImage(mid, sid);
      // salvo l'immagine nel db
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
      // scarico l'immagine dal server
      image = await CommunicationController.GetImage(mid, sid);
      // salvo l'immagine nel db
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
    // se Db non è aperto lo apro
    await this.initViewModel(true);
    // recupero dettagli del menu con longDesc
    const newmenu = await this.GetMenu(menu.mid, sid);
    if (!newmenu) {
      return null;
    }
    // aggiungo longDesc al menu
    menu = { ...menu, ...newmenu };
    //restituisce menu 
    this.lastMenu = menu;
    return menu;
  }


  // Restituisce il menu con l'immagine aggiornata, pronto per essere visualizzato in HomePage
  static async getHomePageMenu(menu, sid) {
    // recupero immagine aggiornata del menu
    const image = await this.getUpdatedImage(menu.mid, sid, menu.imageVersion);
    // setto l'immagine del menu (aggiungo il prefisso data:image/png;base64,)
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
  
  // Restituisce i 20 menu più vicini alla posizione passata con le immagini aggiornate
  static async getMenus(sid) {
    console.log("getMenus");
    // restituisce i 20 menu più vicini alla posizione passata
    let menus = [];
    menus = await CommunicationController.GetMenus(
      this.positionController.location.coords.latitude,
      this.positionController.location.coords.longitude,
      sid
    );
    // per ogni menu restituito, restituisce il menu con l'immagine aggiornata
    for (let menu of menus) {
      menu = await this.getHomePageMenu(menu, sid);
    }
    return menus;
  }

  // Controlla se è il primo avvio dell'app, se non c'è un utente nell'AsyncStorage restituisce true, altrimenti false
  static async checkFirstRun() {
    console.log("checkFirstRun");
    // inizializza il positionController e lo storageManager se non sono già stati inizializzati e non apre il database 
    await this.initViewModel(false);

    let firstRun = false;
    let user = null;
    // cerca l'utente nell'AsyncStorage e se non lo trova setta firstRun a true 
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

  // Inizializza l'app, controlla se è il primo avvio, 
  // -> se lo è restituisce un oggetto con firstRun a true e user a null, 
  // -> altrimenti restituisce un oggetto con firstRun a false, l'utente trovato nell'AsyncStorage e la posizione attuale del dispositivo (se permessi concessi)
  static async initApp() {
    console.log("initApp");

    //  inizializza il positionController e lo storageManager
    await this.initViewModel(false);

    // controlla se è il primo avvio dell'app controllando se c'è un utente nell'AsyncStorage
    const firstRun = await this.checkFirstRun();

    // se è la prima volta che avviamo l'app restituisce un oggetto con firstRun a true e user a null e posizione a null
    if (firstRun) {
      return { firstRun: firstRun, user: null, location: null };
    } else {
      // altrimenti restituisce un ogetto con firstRun: false, l'utente trovato nell'AsyncStorage, la posizione attuale e l'ultimo screen visitato
      const user = await this.getUserFromAsyncStorage();
      const lastScreen = await this.storageManager.getLastScreenAsync();
      this.user = user;
      await this.positionController.getLocationAsync();
      return {
        firstRun: firstRun,
        user: user,
        location: this.positionController.location,
        lastScreen: lastScreen.screen,
      };
    }
  }
  
  // restituisce il menu con l'immagine aggiornata, pronto per essere visualizzato in MenuDetail (con longDesc)
  static async getMenuDetail(menu, user) {
    // recupera il menu con longDesc
    let newMenu = await CommunicationController.GetMenu(
      menu.mid,
      user.sid,
      this.positionController.location.coords.latitude,
      this.positionController.location.coords.longitude
    );
    // aggiunge longDesc al menu
    menu = { ...menu, ...newMenu };
    return menu;
  }

  // Restituisce l'indirizzo della posizione attuale utilizzando la funzione reverseGeocodeAsync di Location
  static async getAddress() {
    const address = await Location.reverseGeocodeAsync({
      latitude: this.positionController.location.coords.latitude,
      longitude: this.positionController.location.coords.longitude,
    });
    return address[0];
  }

  // Restituisce posizione attuale utilizzando la funzione getCurrentPositionAsync di Location
  static async getLocation() {
    await this.positionController.getLocationAsync();
  }
  static async getDeliveryTime(minutes) {
    let string = "";
    if (minutes == 0) {
      return "Meno di un minuto";
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

  // controlla che l'utente sia valido, cioè che abbia tutti i campi completi
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

  // restituisce l'ultimo menu visitato (con immagine) dallo storage
  static async getLastMenu() {
    if (!this.lastMenu) {
      const newMenu = await this.storageManager.getLastMenuAsync();
      console.log("New Menu", newMenu.image);
      this.lastMenu = newMenu;
      return newMenu;
    }
    console.log("Last Menu", this.lastMenu);
    return this.lastMenu;
  }
  //restituisce coordinate di location del positionController con latitudine e longitudine
  static getLocationCoords() {
    return this.positionController.location.coords;
  }

  //conferma l'ordine (quando il profilo è già completo) e lo invia al server
  static async confirmOrder(menu, user, coords) {
    try {
      //crea l'ordine
      let order = await CommunicationController.createOrder(
        menu.mid,
        user.sid,
        coords.latitude,
        coords.longitude
      );
      //salva l'oid dell'ordine e lo status dell'ordine nell'utente
      this.lastOid = order.oid;
      const newUser = {
        ...user,
        lastOid: order.oid,
        orderStatus: order.status,
      };
      //salva user nello storage con l'oid e lo status dell'ordine
      await this.saveUserAsync(newUser);
      console.log(newUser);
      this.user = newUser;
      //restituisce l'ordine e il nuovo utente
      return { order, newUser };
    } catch (error) {
      console.log(error);
      //se l'errore è dovuto al fatto che l'utente ha già un ordine attivo, lancia un errore personalizzato
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

  // restituisce l'ordine con l'oid passato e il sid dell'utente
  static async getOrder(oid, sid) {
    return await CommunicationController.getOrder(oid, sid);
  }

  // Restituisce il tempo rimanente per la consegna
  static async getTimeRemaining(deliveryTimestamp) {
    const now = new Date(); // Tempo corrente
    const deliveryTime = new Date(deliveryTimestamp); // Converte il timestamp di consegna in un oggetto Date
    const diffInMs = deliveryTime - now; // Calcola la differenza in millisecondi
    // Calcola il tempo rimanente in giorni, ore, minuti e secondi
    const seconds = Math.floor(diffInMs / 1000) % 60;
    const minutes = Math.floor(diffInMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffInMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    let string = "";
    if (days > 0) {
      string += `${days} giorni, `;
    }
    if (hours > 0) {
      string += `${hours} ore, `;
    }
    if (minutes > 0) {
      string += `${minutes} minuti, `;
    }
    if (seconds > 0) {
      string += `${seconds} secondi`;
    }
    if (string === "") {
      string = "Meno di un secondo";
    }
    // Formatta la risposta in un formato leggibile
    return string;
  }

  //salva l'utente nell'AsyncStorage e nel ViewModel
  static async saveUserAsync(user) {
    console.log("utenteSalvatoo: ", user);
    this.user = user;
    await this.storageManager.saveUserAsync(user);
  }

  // dal timestamp restituisce la data e l'ora
  static fromTimeStampToDayAndTime(timestamp) {
    const parts = timestamp.split("T");
    const date = parts[0];
    let dateParts = date.split("-");
    const time = parts[1].split(".")[0].slice(0, -3);
    let string =
      dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] + " ore " + time;
    return string;
  }

  static setLastScreen(screen) {
    this.lastScreen = screen;
  }
  static setLastMenu(menu) {
    this.lastMenu = menu;
  }
  static async saveLastScreenAsync(screen) {
    console.log("saveLastScreenAsync");
    console.log(this.lastScreen);
    console.log(this.lastMenu);
    await this.storageManager.saveUserAsync(this.user);
    await this.storageManager.saveLastScreenAsync(screen, this.lastMenu);
  }

  // funzione che recupera l'ultima schermata visitata dall'async (e menu) storage e setta lastScreen e lastMenu
  static async getLastScreenAsync() {
    console.log("getLastScreenAsync");
    // recupero la schermata visitata dall'async storage (con l'ultimo menu visitato)
    const screen = await this.storageManager.getLastScreenAsync();
    console.log(screen.screen !== null ? screen.screen : "null");
    // setto lastScreen e lastMenu nel ViewModel
    ViewModel.setLastScreen(screen.screen);
    ViewModel.setLastMenu(JSON.parse(screen.lastMenu));
    return screen;
  }

  // Restituisce le schermate iniziali in base all'ultima schermata visitata
  static getInitialRouteNames(lastScreen) {
    
    let initialRouteNames = new Map();
  
    switch (lastScreen) {
      // in base all'ultima schermata visitata, mostra la schermata corrispondente

      // se l'ultima schermata visitata è Menu, allora 
      case "Menu":
        // setto la schermata iniziale di Root a Home, la schermata iniziale di Home a Menu e la schermata iniziale di Profile a ProfilePage
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "Menu");
        initialRouteNames.set("Profile", "ProfilePage");
        break;

      // se l'ultima schermata visitata è ConfirmOrder
      case "ConfirmOrder":
        //setto la schermata iniziale di Root a Home, la schermata inziale di Home a ConfirmOrder e la schermata inziale di Profile a Profilepage
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "ConfirmOrder");
        initialRouteNames.set("Profile", "ProfilePage");
        break;

      // se l'ultima schermata visitata è Homepage
      case "Homepage":
        // setto la schermata iniziale di Root a Home, la schermata iniziale di Home a Homepage e la schermata iniziale di Profile a ProfilePage
        initialRouteNames.set("Root", "Home");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
        break;

      // se l'ultima schermata visitata è ProfilePage
      case "ProfilePage":
        // setto la schermata iniziale di Root a Profile, la schermata iniziale di Home a Homepage e la schermata iniziale di Profile a ProfilePage
        initialRouteNames.set("Root", "Profile");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      
      // se l'ultima schermata visitata è Form
      case "Form":
        // setto la schermata iniziale di Root a Profile, la schermata iniziale di Home a Homepage e la schermata iniziale di Profile a Form
        initialRouteNames.set("Root", "Profile");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "Form");
        break;
      
      // se l'ultima schermata visitata è Order
      case "Order":
        // setto la schermata iniziale di Root a Order, la schermata iniziale di Home a Homepage e la schermata iniziale di Profile a ProfilePage
        initialRouteNames.set("Root", "Order");
        initialRouteNames.set("Home", "Homepage");
        initialRouteNames.set("Profile", "ProfilePage");
        break;
      default:
    }
    return initialRouteNames;
  }
}
export default ViewModel;
