import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeteoService } from '../services/meteo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-meteo-detail',
  templateUrl: './meteo-detail.component.html',
  styleUrls: ['./meteo-detail.component.css']
})
export class MeteoDetailComponent implements OnInit {
  meteo: any;
  meteo5Days: any;
  mapUrl: SafeResourceUrl = '';
  loading: boolean = true;
  loadingForecast: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private meteoService: MeteoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getMeteo();
  }

  getMeteo(): void {
    const name = this.route.snapshot.paramMap.get('name');
    console.log('getMeteo pour', name);
    
    if (name) {
      this.loading = true;
      this.loadingForecast = true;
      
      // Obtener clima actual
      this.meteoService
        .getMeteo(name)
        .then((response: any) => {
          this.meteo = response;
          this.generateMapUrl();
          this.loading = false;
        })
        .catch((error: any) => {
          this.meteo = { cod: 404, message: error };
          this.loading = false;
        });

      // Obtener pronóstico de 5 días
      this.meteoService
        .getMeteo5Days(name)
        .then((response: any) => {
          this.meteo5Days = this.processForecastData(response);
          this.loadingForecast = false;
        })
        .catch((error: any) => {
          this.meteo5Days = null;
          this.loadingForecast = false;
        });
    }
  }

  processForecastData(data: any): any {
  if (!data || !data.list) return null;

  // Definir explícitamente el tipo del array
  const dailyForecasts: any[] = [];
  const processedDays = new Set();

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateString = date.toDateString();
    
    // Tomar solo una previsión por día (alrededor del mediodía)
    if (!processedDays.has(dateString) && date.getHours() >= 10 && date.getHours() <= 14) {
      dailyForecasts.push(item);
      processedDays.add(dateString);
    }
  });

  return {
    ...data,
    dailyList: dailyForecasts.slice(0, 5) // Solo 5 días
  };
}
  generateMapUrl(): void {
    if (this.meteo && this.meteo.coord) {
      const lon = this.meteo.coord.lon;
      const lat = this.meteo.coord.lat;
      
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
        lon - 0.1
      }%2C${lat - 0.1}%2C${lon + 0.1}%2C${
        lat + 0.1
      }&layer=mapnik&marker=${lat}%2C${lon}`;
      
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    }
  }

  getWindDirection(degrees: number): string {
    const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

 getDayName(timestamp: number): string {
  const date = new Date(timestamp);
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
}}