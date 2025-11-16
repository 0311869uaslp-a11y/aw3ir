import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor() { }

  getMeteo(name: string): Promise<any> {
    console.log('from service', name);

    // ⚠️ REEMPLAZA 'TU_API_KEY' CON TU CLAVE REAL DE OPENWEATHERMAP
    const apiKey = 'feac79144fa3d24dfbe3e8cf0dac9b51'; // Cambia esto por tu API key real
    
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather/?q=${name}&units=metric&lang=fr&appid=${apiKey}`
    )
      .then((response: Response) => {
        return response.json();
      })
      .then((json: any) => {
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


  getMeteo5Days(name: string): Promise<any> {
  console.log('from service - 5 days forecast', name);

  // ⚠️ REEMPLAZA 'TU_API_KEY' CON TU CLAVE REAL
  const apiKey = 'feac79144fa3d24dfbe3e8cf0dac9b51';
  
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast/?q=${name}&units=metric&lang=fr&appid=${apiKey}`
  )
    .then((response: Response) => {
      return response.json();
    })
    .then((json: any) => {
      if (json.cod === "200") {
        return Promise.resolve(json);
      } else {
        console.error(
          'Prévisions introuvables pour ' + name + ' (' + json.message + ')'
        );
        return Promise.reject(
          'Prévisions introuvables pour ' + name + ' (' + json.message + ')'
        );
      }
    });
}
}
