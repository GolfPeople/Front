import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import { 
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import { LoadingController, ModalController } from '@ionic/angular';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { element } from 'protractor';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { CampusDataService } from '../campus/services/campus-data.service';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userName: string;
  imageAvatarDefault: string = 'assets/img/default-avatar.png';
  isOpen: boolean = false;
  profileUrl: string = 'https://golf-people.web.app/tabs/user-profile';
  level: boolean;
  bolsa: boolean;
  campos: boolean;
  posts: boolean  = true;
  postsPage = 1;
  postsData: PostsResponse[] = [];
  isLoadingMore: boolean = false;

  segment = 'posts'

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value: string;


  toggleOptions = { one: 'Campos Jugados', two: 'Clubes Asociados' }
  toggle$ = new BehaviorSubject(false);

  courses = new BehaviorSubject([]);
  user_id: number;
  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private loadingSvc: LoadingService,
    private loadingCtrl: LoadingController,
    private postsSvc: PostsService,
    public gameSvc: GameService,
    public campusSvg: CampusDataService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
      this.value = `${this.profileUrl}/${res.id}`;
    });
    this.postsSvc.myPosts(this.postsPage).subscribe(({ data }) => {
      this.postsPage += 1;
      this.postsData = data;
      loading.dismiss();
    });
  }

  ionViewWillEnter(){
   this.user_id = JSON.parse(localStorage.getItem('user_id'));
   this.getCourses()
  }

  ionViewDidEnter() {
 
    setTimeout(() => {
      this.postsSvc.myPosts(1).subscribe(
        ({ data }) => {
          this.postsData = data;
          this.postsPage = 2;
       
        },
        (error) => {
          console.log(error);
        }
      );
    }, 1000);
  }

  getPosts(){

  }

 /**===================Mostrar Campos Jugados============== */

 getCourses() {
    
  this.campusSvg.getPlayerCourses(this.user_id).subscribe(res => {
    this.courses.next(res);
 
  }, err => {
    console.log(err);

  })
}


  shareQR() {
    if (this.value) {
      navigator.share({
        title: 'Mi Perfil Golfer',
        text: 'Check my profile golfer',
        url: this.value,
      });
    }
  }

  async openModal() {
    // this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: QrModalComponent,
      backdropDismiss: true,
      cssClass: 'options_modal',
      componentProps: {
        qr: this.value,
      },
    });

    await modal.present();
  }


  async startScan() {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
    }
  }

  async checkPermission() {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  }

  onLoadMore() {
    this.isLoadingMore = true;
    this.postsSvc.myPosts(this.postsPage).subscribe(
      ({ data }) => {
        this.postsData = this.postsData.concat(data);
        this.isLoadingMore = false;
        if (data.length) {
          this.postsPage += 1;
        }
      },
      (error) => {
        this.isLoadingMore = false;
        console.log(error);
      }
    );
  }



}
