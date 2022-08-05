import { Component, OnInit } from '@angular/core';
import { Campus } from 'src/app/core/models/campus.interface';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CampusDataService } from '../../services/campus-data.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {

  items: any = [
    {
      name: this.translate.instant('ADMIN_PANEL.campus_description'),
      route: ['description'],
    },
    {
      name: this.translate.instant('ADMIN_PANEL.holes'),
      route: ['holes'],
    },
    {
      name: this.translate.instant('ADMIN_PANEL.reviews'),
      route: ['reviews'],
    },
    {
      name: this.translate.instant('ADMIN_PANEL.posts'),
      route: ['posts'],
    },
    {
      name: this.translate.instant('ADMIN_PANEL.messages'),
      route: ['messages'],
    },
    {
      name: this.translate.instant('ADMIN_PANEL.members'),
      route: ['members'],
    },
  ];
  campus: Campus;
  designer: any;
  imageAvatarDefault = 'assets/img/default-img.png';
  id;
  detail;

  constructor(
    public campusSvc: CampusDataService,
    private actRoute: ActivatedRoute,
    private translate: TranslateService,
    private firebaseSvc: FirebaseService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.detail = this.campusSvc.golfCourses.value.filter(res => res.id == this.id)[0];
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getGolfCourse();
  }

  getGolfCourse() {

    this.campusSvc.getData().subscribe(async ({ data }) => {
      this.campusSvc.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];                 
    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }

  async addImage() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      promptLabelHeader: this.translate.instant('UTILS.image'),
      promptLabelPhoto: this.translate.instant('UTILS.choose_image'),
      promptLabelPicture: this.translate.instant('UTILS.take_pic'),
      source: CameraSource.Prompt
    });
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.detail.thumbnailImage = await this.firebaseSvc.uploadPhoto('golfcourses/' + image.dataUrl.slice(30, 40), image.dataUrl);   
   
    this.campusSvc.updateGolfCourse(this.id, this.detail).subscribe(res => {
      this.getGolfCourse();
      this.firebaseSvc.Toast(this.translate.instant('UTILS.uploaded_images'))
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'))
      loading.dismiss();
    })
  }
}
