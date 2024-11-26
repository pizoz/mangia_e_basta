import * as Location from "expo-location";

export default class PositionController {
  
  constructor() {
    this.location = null;
    this.canUseLocation = false;
  }

  async locationPermissionAsync() {
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    console.log(grantedPermission);
    if (grantedPermission.status === "granted") {
      console.log("Ho i permessi");
      this.canUseLocation = true;
    } else {
      console.log("Non ho i permessi");
      const permissionResponse =
        await Location.requestForegroundPermissionsAsync();
      console.log("Ho richiesto i permessi");
      if (permissionResponse.status === "granted") {
        this.canUseLocation = true;
      }
    }
  }
  async getLocationAsync() {
    await this.locationPermissionAsync();
    if (this.canUseLocation) {
      this.location = await Location.getCurrentPositionAsync();
      return this.location.coords;
    }
  }
}
