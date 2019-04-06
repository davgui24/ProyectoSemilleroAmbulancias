import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, AlertController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private geolocation: Geolocation, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.cargarMapa();
  }

  async cargarMapa() {
  //  Mostar un loading mientras carga el map
   const loading = await this.loadingCtrl.create();
    loading.present();

    const respuesta = await this.geolocation.getCurrentPosition();
    // Obtengo las cordenadas de mi ubicacion
    const miCoordenada = {
      lat: respuesta.coords.latitude,
      lng: respuesta.coords.longitude
    };

    console.log(miCoordenada);

    // Obtengo el div del HTML
    const mapElement: HTMLElement = document.getElementById('map');

    // le asigno las coordenadas a el div con un zoom
    const map = new google.maps.Map(mapElement, {
      center: miCoordenada,
      zoom: 16
    });

    // Espero que se cargue el mapa par colocar una marca (mark) y cerrar el loaging
    google.maps.event.addListenerOnce(map, 'idle', () => {
      console.log(' Ya cargó');
      loading.dismiss();

      // Agregamos un marker con las mismas cordenadas de la ubicación actual
      const marker1 = new google.maps.Marker({
        position: {
          lat: miCoordenada.lat,
          lng: miCoordenada.lng
        },
        map: map,
        title: 'Hello World!',
        icon: 'assets/icon/ambulancia.png'
      });
      
      let mensaje: string = ("Latitud: " + miCoordenada.lat + " \<br> Longitud: " + miCoordenada.lng);
      this.presentAlert('Alerta', 'Mi ubicación', mensaje);

      const marker2 = new google.maps.Marker({
        position: {
          lat: 10.4136537,
          lng: -75.52965999999999
        },
        map: map,
        title: 'Hello World!',
        icon: 'assets/icon/ambulancia.png'
      });
    });



    // +++++++++++++++++++++++++++
  // get api uses
  const directionsService = new google.maps.DirectionsService;
  const directionsDisplay = new google.maps.DirectionsRenderer;
  // waypoints to add
  const waypts = [{ location: { lat: miCoordenada.lat, lng: miCoordenada.lng }, stopover: true }, { location: { lat: 10.4136537, lng: -75.52965999999999 }, stopover: true }];

  // api map
  const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: { lat: waypts[0].location.lat, lng: waypts[0].location.lng }
  });
  // add map
  directionsDisplay.setMap(map);

  // set the new
  // new Array(waypts[0].location.lat,waypts[0].location.lng)
  directionsService.route({
      origin: { lat: waypts[0].location.lat, lng: waypts[0].location.lng }, // db waypoint start
      destination: { lat: waypts[0].location.lat, lng: waypts[0].location.lng }, // db waypoint end
      waypoints: waypts,
      travelMode: google.maps.TravelMode.WALKING
  }, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
      } else {
          window.alert('Ha fallat la comunicació amb el mapa a causa de: ' + status);
      }
  });


  }




  async presentAlert(header: string = '', subHeader: string = '', mensaje: string = ''){
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
