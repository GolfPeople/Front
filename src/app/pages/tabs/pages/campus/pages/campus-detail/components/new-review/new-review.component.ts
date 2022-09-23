import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../../services/campus-data.service';

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.scss'],
})
export class NewReviewComponent implements OnInit {

  @Input() hole;
  @Input() campuses_id;
  rating: number;
  levelRange: number;
  description: string;

  constructor(
    private campusSvg: CampusDataService,
    private modalController: ModalController,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {

  }

  async sendReview() {
    let review: any = {
      campuses_id: this.campuses_id,
      rating: this.rating,
      difficulty: this.levelRange,
      description: this.description
    }

    if (this.hole.value) {
      review.hole = this.hole.value.toString();
    }  

    
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.campusSvg.sendReview(review).subscribe(res => {
      this.modalController.dismiss({saved: true});
      this.rating = 0;
      this.description = '';
      this.levelRange = 0;

      this.firebaseSvc.Toast('Reseña enviada exitosamente');
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
      console.log(error);
    })
  }

  selectRating(value) {
    this.rating = value;
  }

  validator() {
    if (!this.rating) {
      return false;
    }
    if (!this.description) {
      return false;
    }
    if (!this.levelRange) {
      return false;
    }

    return true;
  }

}
