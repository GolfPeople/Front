import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../services/campus-data.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-holes',
  templateUrl: './holes.page.html',
  styleUrls: ['./holes.page.scss'],
})
export class HolesPage implements OnInit {

  detail;

  selectedHole = new BehaviorSubject(1);
  reviews = new BehaviorSubject([]);
  averageLevel = new BehaviorSubject(0 as any);
  photos = new BehaviorSubject([]);
  advice = ''

  holes = [];
  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  selectedSegment = '1';
  segments = [
    { id: '1', name: 'Información' },
    { id: '2', name: 'Comentarios' },
    { id: '3', name: 'Fotos de Hoyo' },
  ]

  holeData;
  hcpHole;
  parHole;
  yds = [];

  img;
  id;

  loading: boolean;
  constructor(
    private actRoute: ActivatedRoute,
    public campusSvg: CampusDataService,
    private firebaseSvc: FirebaseService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id'); 

  }
  ngOnInit() {
    this.getGolfCourse()
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  changeHole(h) {
    this.selectedHole.next(h)
    this.getYds();
    this.getHCPYPAR();
    this.getHolePhotos();
  }

  submit() {
     this.loading = true;
    setTimeout(() => {
         this.loading = false;
    }, 2000);

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
    let imgUrl = await this.firebaseSvc.uploadPhoto('holes/' + image.dataUrl.slice(30, 40), image.dataUrl);
    let images = [];
    images.push(imgUrl)

    let data = {
      course_id: this.detail.id,
      hole: this.selectedHole.value.toString(),
      images: images
    }

    this.campusSvg.savePics(data).subscribe(res => {
      this.getGolfCourse();
      this.firebaseSvc.Toast('La foto se ha guardado exitosamente')
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      loading.dismiss();
    })
  }

  getHCPYPAR() {
    let hcpHole = this.detail.scorecarddetails.menScorecardList[0].hcpHole;
    let parHole = this.detail.scorecarddetails.menScorecardList[0].parHole;
    hcpHole.map((n, index) => {
      if (index == this.selectedHole.value - 1) {
        this.hcpHole = n;
      }
    });
    parHole.map((n, index) => {
      if (index == this.selectedHole.value - 1) {
        this.parHole = n;
      }
    });

  }

  getYds() {
    this.yds = [];
    for (let t of this.detail.teesList.teesList) {
      t.ydsHole.map((res, index) => {
        if (index == this.selectedHole.value - 1) {
          this.yds.push({ yds: res, color: t.teeColorValue });
        }
      })
    }
  }

  getHolesLength() {

    let holeData = this.detail.teesList.teesList.map(hole => {

      return (hole.ydsHole.map((h, index) => {
        return {
          holeNumber: index + 1,
          ydsHole: h,
          color: hole.teeColorValue
        }
      }))
    })


    for (let i = 1; i < parseInt(this.detail.layoutHoles) + 1; i++) {
      this.holes.push({ index: i - 1, holeNumber: i })
    }
  }


  getHolePhotos() {
    this.photos.next(this.detail.images_holes.filter(res => parseInt(res.hole) == this.selectedHole.value));
  }

  getGolfCourse() {

    this.campusSvg.getData().subscribe(async ({ data }) => {
      this.campusSvg.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];
      this.detail.teesList = JSON.parse(this.detail.teesList);
      this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);

      this.getHolesLength();
      this.getYds();
      this.getHCPYPAR();
      this.getHolePhotos();

    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }


}
