import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'

import { api } from '../api/api';

declare var google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  //Atribute that receives the map.
  private map:any
  //Atribute that receives the markers.
  private marker:any
  //Api file instance.
  private api = new api();


  constructor(private geolocation:Geolocation,private platform:Platform,
    public navCtrl: NavController){

     }
     
    

  ionViewDidLoad() {
    //The 'initPage' method will execute as soon as the platform loads.
    this.platform.ready().then((readySource) => {
         this.initPage();
    });
  }


   initPage(){
    //Getting your location.
    this.geolocation.getCurrentPosition().then((resp) => {
          var lat = resp.coords.latitude
          var lng = resp.coords.longitude 
          //The 'initMap' method will load the map, upon receveing the latitude and longitude.
          this.initMap(lat,lng)

     }).catch((error) => {
          //In case of an error, this message is executed.
          console.log('Error getting location', error);
     });   

  }

  initMap(lat,lng) {
      //Getting the paraments the latitude and longitude.
      let LatLng = new google.maps.LatLng(lat,lng);
      //Option of the map.
      let mapOptions = {
        center:LatLng,
        zoom:1

      }
      //Getting object of element that will load the map.
      let element = document.getElementById('map');
      //The map receive the element and the options.  
      this.map = new google.maps.Map(element,mapOptions);
      //Make the markers of map.  
      this.marker = new google.maps.Marker({
        position:LatLng,
        title:"My location",
        icon:"assets/icon/usuario2.png"
      });
      //The content that will be displayed upon click in marker.
      let content = `
          <div> 
              <ion-item class='item item-thumbnail-left item-text-wrap' >
                    <ion-row>
                        <h6>Eu</h6>
                    </ion-row>
              </ion-item>
          </div>
      `
        //The methods that will be used in map.
        this.addInfoWindow(this.marker,content);
        this.ZoomPoint(this.marker);
        this.focusUser();
        this.marker.setMap(this.map);
        this.getPoints(this.marker,this.map);
  }

  //Method that will get the other markers.  
  getPoints(marker,map){
 
          //Getting the points of api file.
          this.api.getPoints().then((points)=>{
                  
                  for(let key of Object.keys(points)){
                        
                        let LatLng = new google.maps.LatLng(points[key].lat,points[key].lng);  
                        let marker = new google.maps.Marker({
                            position:LatLng,
                            title:points[key].name
                        })
                    
                        let content = `
                            <div> 
                                <ion-item class='item item-thumbnail-left item-text-wrap' >
                                      <ion-row>
                                          <h6>`+points[key].name+`</h6>
                                      </ion-row>
                                </ion-item>
                            </div>
                        `
                       
                        this.addInfoWindow(marker,content);
                        this.ZoomPoint(marker);
                        marker.setMap(map);

                    }   
                    
          })

  }

  //This method will to give zoom in marker clicked.
  ZoomPoint(marker){
     google.maps.event.addListener(marker,"click",()=>{
          this.map.setZoom(16);
          this.map.setCenter(marker.getPosition());
     })
  }
  //This method will focus in your location.
  focusUser(){
     var map =  this.map
     var marker = this.marker
     document.getElementById("locale").addEventListener("click",function(){
        map.setZoom(11);
        map.setCenter(marker.getPosition());
    })
  }

  //This method will display the content of marker after being clicked.
  addInfoWindow(marker,content){
      let infoWindow = new google.maps.InfoWindow({
         content:content
      })

      google.maps.event.addListener(marker,"click",()=>{
          infoWindow.open(this.map,marker);
      })
  }


}
 