import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  constructor(private geolocation: Geolocation, private loadingCtrl: LoadingController) {}

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
        title: 'Hello World!'
      });

      const marker2 = new google.maps.Marker({
        position: {
          lat: 10.2,
          lng: -74.7864063
        },
        map: map,
        title: 'Hello World!'
      });
    });

  }
}
