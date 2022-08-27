import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../campus/services/campus-data.service';

@Component({
  selector: 'app-game-finished-success',
  templateUrl: './game-finished-success.page.html',
  styleUrls: ['./game-finished-success.page.scss'],
})
export class GameFinishedSuccessPage implements OnInit {

  user;
  like = false;
  price = new BehaviorSubject(0);
  location = new BehaviorSubject(0);
  store = new BehaviorSubject(0);
  restaurant = new BehaviorSubject(0);
  facilities = new BehaviorSubject(0);
  comment = '';
  photos = [];

  id;

  course;
  constructor(
    private userService: UserService,
    private firebaseSvc: FirebaseService,
    public campusSvg: CampusDataService,
    private actRoute: ActivatedRoute
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.userService.user$.subscribe((data) => {
      this.user = data;
    });

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getGolfCourse();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  getGolfCourse() {
    this.campusSvg.getData().subscribe(res => {
      this.course = res.data.filter(c => this.id == c.id)[0];    
    })
  }

async  saveReview() {
    let data = {
      price: this.price.value,
      location: this.location.value,
      store: this.store.value,
      restaurant: this.restaurant.value,
      facilities: this.facilities.value,
      comment: this.comment,
      photos: this.photos,
    }   
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
  
    this.campusSvg.saveGeneralReview(this.id, data).subscribe(res => {
      console.log(res);
      this.firebaseSvc.Toast('Reseña guardada exitosamente');
      this.firebaseSvc.routerLink('tabs/play');
      loading.dismiss();
    }, error => {      
      loading.dismiss();
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo');
    })
  }

  validator(){
    if(!this.price.value){
      return false;
    }
    if(!this.location.value){
      return false;
    }   
    if(!this.facilities.value){
      return false;
    }

    if(!this.comment){
      return false;
    }

    return true;
  }

  removePhoto(index){
    this.photos.splice(index, 1);
  }

  async addImages() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      promptLabelHeader: 'Imagen',
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
      source: CameraSource.Prompt
    });
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    let imgUrl = await this.firebaseSvc.uploadPhoto(`course_${this.id}/` + image.dataUrl.slice(30, 40), image.dataUrl);
    this.photos.push(imgUrl);    
    loading.dismiss();
  }
}
