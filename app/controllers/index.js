import Controller from '@ember/controller';
import fetch from 'fetch';
import { OPEN_WEATHER_CONSTANTS } from '../constants/OPEN_WEATHER_CONSTANTS';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.handlePermission();
  },

  handlePermission() {
    let self = this;
    let geoSettings = {
      enableHighAccuracy: false,
      maximumAge        : 30000,
      timeout           : 20000
    };
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state == 'granted') {
        self.report(result.state);
        navigator.geolocation.getCurrentPosition(self.revealPosition.bind(self),self.positionDenied,geoSettings);
      //  geoBtn.style.display = 'none';
      } else if (result.state == 'prompt') {
        self.report(result.state);
        self.set('styleProperty', 'display: none;');
      //  geoBtn.style.display = 'none';
      if (!("geolocation" in navigator)) {
        alert("No geolocation available!");
      }
        navigator.geolocation.getCurrentPosition(self.revealPosition.bind(self),self.positionDenied,geoSettings);
      } else if (result.state == 'denied') {
        self.report(result.state);
        self.set('styleProperty', 'display: inline;');
        //geoBtn.style.display = 'inline';
      }
      result.onchange = function() {
        self.report(result.state);
      }
    });
  },

  report(state) {
    console.log('Permission ' + state);
  },

  async revealPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var response = await fetch(`${OPEN_WEATHER_CONSTANTS.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_CONSTANTS.API_KEY}`);
    var json = await response.json();
    this.set('data', json);
    console.log(json);
  },

  positionDenied() {
    console.log('denied');
  },

  getdata(json) {
    this.set('data', json._result);
  }

});
