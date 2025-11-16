import { Component, OnInit } from '@angular/core';
import { MeteoItem } from '../meteoItem';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {
  city: MeteoItem = {
    name: '',
    id: 0,
    weather: null
  };

  cityList: MeteoItem[] = [];

  constructor() { }

  ngOnInit() {
    const storedList = localStorage.getItem('cityList');
    if (storedList !== null) {
      this.cityList = JSON.parse(storedList);
    }
  }

  onSubmit() {
    if (this.city.name && !this.isCityExist(this.city.name)) {
      let currentCity = new MeteoItem();
      currentCity.name = this.city.name;
      this.cityList.push(currentCity);
      this.saveCityList();
      this.city.name = '';
    }
  }

  remove(city: MeteoItem) {
    this.cityList = this.cityList.filter(item => item.name !== city.name);
    this.saveCityList();
  }

  isCityExist(cityName: string): boolean {
    return this.cityList.some(item => 
      item.name?.toUpperCase() === cityName.toUpperCase()
    );
  }

  saveCityList() {
    localStorage.setItem('cityList', JSON.stringify(this.cityList));
  }
}