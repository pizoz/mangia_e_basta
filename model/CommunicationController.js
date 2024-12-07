export default class CommunicationController {
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";
  
    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
      const queryParamsFormatted = new URLSearchParams(queryParams).toString();
      const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
      let fatchData = {
        method: verb,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      if (verb != "GET") {
        fatchData.body = JSON.stringify(bodyParams);
      }
      let httpResponse = await fetch(url, fatchData);
  
      const status = httpResponse.status;
      if (status == 200) {
        console.log("Richiesta andata a buon fine");
        let deserializedObject = await httpResponse.json();
        return deserializedObject;
      } else if (status == 204) {
        console.log("Tutto a posto, probabilmente una put");
      } else {
        //console.log(httpResponse);
        const message = await httpResponse.text();
        let error = new Error(
          "Error message from the server. HTTP status: " + status + " " + message
        );
        throw error;
      }
    }
    static async getUser(uid, sid) {
      const endpoint = "user/" + uid;
      const verb = "GET";
      const queryParams = { sid: sid };
      console.log("Richiesta GET per ottenere utente");
      return await this.genericRequest(endpoint, verb, queryParams, null);
    }
    static async UpdateUser(uid, sid, bodyParams, queryParams = {}) {
      const endpoint = "user/" + uid;
      const verb = "PUT";
      bodyParams = { sid: sid, ...bodyParams };
      console.log("Richiesta PUT per aggiornare utente");
      return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
    }
    static async createUser() {
      const endpoint = "user";
      const verb = "POST";
      console.log("Richiesta POST per creare utente");
      return await this.genericRequest(endpoint, verb, {}, {});
    }
    static async GetImage(mid, sid) {
      console.log("GetImage From Server");
      const endpoint = "menu/" + mid + "/image";
      const verb = "GET";
      const queryParams = { sid: sid };
      console.log("Richiesta GET per ottenere immagine");
      return await this.genericRequest(endpoint, verb, queryParams, {});
    }
    static async GetMenu(mid,sid, lat, lng) {
      const endpoint = "menu/" + mid;
      const verb = "GET";
      const queryParams = { lat: lat, lng: lng, sid: sid };
      console.log("Richiesta GET per ottenere menu");
      let response = null
      try {
        response = await this.genericRequest(endpoint, verb, queryParams, {});
        return response;
      } catch (error) {
        console.log(error);
      }
    }
    static async GetMenus(lat, long, sid) {
      const endpoint = "menu";
      const verb = "GET";
      const queryParams = { lat: lat, lng: long, sid: sid };
      console.log("Richiesta GET per ottenere tanti menu");
      return await this.genericRequest(endpoint, verb, queryParams, {});
    }
    static async createOrder(mid, sid, lat, lng) {
      const endpoint = "menu/" + mid + "/buy";
      const verb = "POST";
      const bodyParams = { sid: sid, deliveryLocation: { lat: lat, lng: lng } };
      console.log("Richiesta POST per creare ordine");
      return await this.genericRequest(endpoint, verb, {}, bodyParams);
    }
  
  }
  