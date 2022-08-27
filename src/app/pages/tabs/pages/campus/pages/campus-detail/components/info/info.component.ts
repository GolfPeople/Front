import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../../services/campus-data.service';
declare const google;

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, AfterViewInit {

  @Input() average;
  @Input() detail; 
  @Input() reviews; 
  schedule = [];
  games = [];
  levelRange = 3;
  services = [];

  features = [
    {id: '1', name: 'Buggy', icon: '../../../../../../../../../assets/icons/buggy.svg'},
    {id: '2', name: 'Hoyos', icon: '../../../../../../../../../assets/icons/golf-ball.svg'},
    {id: '3', name: 'Tienda', icon: '../../../../../../../../../assets/icons/shirt.svg'},
  ]

  @ViewChild('mapElement', { static: false }) mapElement;
  constructor(
    private firebaseSvc: FirebaseService,
    public campusSvg: CampusDataService
    ) { }

  ngOnInit() {
        
  }

  ngAfterViewInit(): void {
    this.createMap();
    this.getCourseGame();
    if(this.detail.hour && this.detail.hour.length){
      this.detail.day.map(d => {
        this.detail.hour.map(h => {
          this.schedule.push({day: d, hour:h})
        })
      })
    } 
        
  }

  getCourseGame(){
    this.campusSvg.getCourseGames(this.detail.id).subscribe(res =>{
      this.games = res.games.map(g => {

        return {
          game_init: g.game_init,
          address: g.address,
          created_at: g.created_at,
          date: g.date,
          id: g.id,
          lat: g.lat,
          long: g.long,
          name: g.name,
          reserves: g.reserves,
          isOwner: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '4').length ? true : false),
          owner_id: g.users.filter(u => u.status == '4')[0].user_id,
          users: g.users.filter(u => { return ['2', '4'].includes(u.status) }),
          fav: false,
          isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '2').length ? true : false),
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
        }
      }).filter(res => res.isOwner == true || res.isMember == true); 
          
    })
  }

  goToAdminRequest(){      
    this.firebaseSvc.routerLink('/tabs/campus/admin-request/')
  }

  async createMap() {
 
    const map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 5,
        center: {lat: parseInt(this.detail.latitude) , lng: parseInt(this.detail.longitude)},
      }
    );

    new google.maps.Marker({
      position:{lat: parseInt(this.detail.latitude) , lng: parseInt(this.detail.longitude)},
      map,
      title: this.detail.courseName,
      icon: '../../../../../assets/img/marker-golfp.png'
    });
  }

}
