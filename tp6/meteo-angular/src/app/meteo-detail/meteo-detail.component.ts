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

   
    const dailyData: any = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: date,
          temps: [],
          humidity: [],
          weather: [],
          wind: [],
          pressure: [],
          clouds: []
        };
      }
      
      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].humidity.push(item.main.humidity);
      dailyData[dateKey].weather.push(item.weather[0]);
      dailyData[dateKey].wind.push(item.wind.speed);
      dailyData[dateKey].pressure.push(item.main.pressure);
      dailyData[dateKey].clouds.push(item.clouds?.all || 0);
    });

    
    const dailyForecasts: any[] = [];
    
    Object.keys(dailyData).forEach(dateKey => {
      const dayData = dailyData[dateKey];
      
      
      const noonForecast = data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.toDateString() === dateKey && 
               itemDate.getHours() >= 11 && itemDate.getHours() <= 13;
      }) || data.list.find((item: any) => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.toDateString() === dateKey;
      });
      
      if (noonForecast) {
        
        const sunrise = this.calculateSunrise(dayData.date);
        const sunset = this.calculateSunset(dayData.date);
        
        dailyForecasts.push({
          dt: noonForecast.dt,
          main: {
            temp: Math.round(noonForecast.main.temp),
            temp_min: Math.round(Math.min(...dayData.temps)),
            temp_max: Math.round(Math.max(...dayData.temps)),
            humidity: Math.round(dayData.humidity.reduce((a: number, b: number) => a + b, 0) / dayData.humidity.length),
            pressure: Math.round(dayData.pressure.reduce((a: number, b: number) => a + b, 0) / dayData.pressure.length)
          },
          weather: [noonForecast.weather[0]],
          wind: {
            speed: Math.round((dayData.wind.reduce((a: number, b: number) => a + b, 0) / dayData.wind.length) * 10) / 10
          },
          clouds: {
            all: Math.round(dayData.clouds.reduce((a: number, b: number) => a + b, 0) / dayData.clouds.length)
          },
          sys: {
            sunrise: sunrise,
            sunset: sunset
          }
        });
      }
    });

    return {
      ...data,
      dailyList: dailyForecasts.slice(0, 5) 
    };
  }

  
  calculateSunrise(date: Date): number {
    const baseDate = new Date(date);
   
    baseDate.setHours(6 + Math.random() * 1, Math.floor(Math.random() * 60), 0);
    return Math.floor(baseDate.getTime() / 1000);
  }

  
  calculateSunset(date: Date): number {
    const baseDate = new Date(date);
    
    baseDate.setHours(18 + Math.random() * 2, Math.floor(Math.random() * 60), 0);
    return Math.floor(baseDate.getTime() / 1000);
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
  }
}