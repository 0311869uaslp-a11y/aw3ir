import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor() { }

  getMeteo(name: string): Promise<any> {
    console.log('from service', name);

   
    return fetch(
      'https://api.openweathermap.org/data/2.5/weather/?q=' +
        name +
        '&units=metric&lang=fr&appid=feac79144fa3d24dfbe3e8cf0dac9b51'
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.cod === 200) {
          return Promise.resolve(json);
        } else {
          console.error(
            'Météo introuvable pour ' + name + ' (' + json.message + ')'
          );
          return Promise.reject(
            'Météo introuvable pour ' + name + ' (' + json.message + ')'
          );
        }
      });
  }
}