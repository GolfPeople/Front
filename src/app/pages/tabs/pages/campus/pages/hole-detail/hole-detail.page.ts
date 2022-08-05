import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { CampusDataService } from '../../services/campus-data.service';
import { NewReviewComponent } from '../campus-detail/components/new-review/new-review.component';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-hole-detail',
  templateUrl: './hole-detail.page.html',
  styleUrls: ['./hole-detail.page.scss'],
})
export class HoleDetailPage implements OnInit {

  detail;

  selectedHole = new BehaviorSubject(1);
  reviews = new BehaviorSubject([]);
  averageLevel = new BehaviorSubject(0 as any);
  photos = new BehaviorSubject([]);

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
  constructor(
    private actRoute: ActivatedRoute,
    public campusSvg: CampusDataService,
    private modalController: ModalController,
    private firebaseSvc: FirebaseService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('detail');
    this.detail = this.campusSvg.golfCourses.value.filter(res => res.id == this.id)[0];
    // this.detail.teesList = JSON.parse(this.detail.teesList);
    // this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);
  }
  ngOnInit() {
    this.getGolfCourse()
  }


  changeHole(h) {
    this.selectedHole.next(h)
    this.getYds();
    this.getHCPYPAR();
    this.filterReviews();
    this.getHolePhotos();
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


  async newReview() {
    const modal = await this.modalController.create({
      component: NewReviewComponent,
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7],
      componentProps: {
        campuses_id: this.detail.id,
        hole: this.selectedHole
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.getGolfCourse();
    }
  }

  filterReviews() {
    let averageLevel: any = [];

    this.reviews.next(this.detail.reviews.filter(r => r.hole == this.selectedHole.value).map(res => {
      averageLevel.push(parseInt(res.difficulty))
      let stars = []
      for (let i = 1; i < res.rating + 1; i++) {
        stars.push({ color: 'success' })
      }

      if (stars.length < 5) {
        let reduce = 5 - stars.length;
        for (let i = 1; i < reduce + 1; i++) {
          stars.push({ color: 'medium' })
        }
      }
      return {
        created_at: res.created_at,
        description: res.description,
        difficulty: res.difficulty,
        rating: res.rating,
        user: res.user,
        stars: stars,
        hole: res.hole
      }
    }).reverse())

    let level = (averageLevel.reduce((a, b) => a + b, 0) / this.reviews.value.length).toFixed(0);
    this.averageLevel.next(level);

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
      this.filterReviews();
      this.getHolePhotos();


    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }
}
