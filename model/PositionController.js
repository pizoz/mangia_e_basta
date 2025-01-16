import * as Location from "expo-location";

export default class PositionController {
  
  constructor() {
    this.location = null;
    this.canUseLocation = false;
  }

  // Funzione per ottenere i permessi di localizzazione
  async locationPermissionAsync() {
    // Chiede i permessi di localizzazione
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    console.log(grantedPermission);
    // Se i permessi sono già stati concessi
    if (grantedPermission.status === "granted") {
      console.log("Ho i permessi");
      this.canUseLocation = true;
    } else {
      // Se i permessi non sono stati concessi
      console.log("Non ho i permessi");
      // Richiede i permessi
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      console.log("Ho richiesto i permessi");
      // Se i permessi sono stati concessi imposto canUseLocation a true
      if (permissionResponse.status === "granted") {
        this.canUseLocation = true;
      }
    }
  }

  // Funzione per ottenere la posizione attuale, se ci sono i permessi, chiede i permessi, se ci sono calcola la posizione
  async getLocationAsync() {
    await this.locationPermissionAsync();
    console.log("getLocationAsync");
    console.log("Can use Location: ",this.canUseLocation);
    if (this.canUseLocation) {
      this.location = await Location.getCurrentPositionAsync();
    }
  }

  async reverseGeocode() {
    let address = await Location.reverseGeocodeAsync({
      latitude: this.location.coords.latitude,
      longitude: this.location.coords.longitude,
    });
    return address;
  };
}
