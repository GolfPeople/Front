import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../services/campus-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.page.html',
  styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {

  imageAvatarDefault = 'assets/img/default-img.png';
  form: FormGroup;
  loading: boolean;
  detail;
  id;

  constructor(
    private formBuilder: FormBuilder,
    public campusSvc: CampusDataService,
    private actRoute: ActivatedRoute,
    private translate: TranslateService,
    private firebaseSvc: FirebaseService
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.detail = this.campusSvc.golfCourses.value.filter(res => res.id == this.id)[0];
  }

  ngOnInit() {
    this.getForm();
    this.getGolfCourse();
  }

  getForm() {
    if (!this.detail) {
      this.form = this.formBuilder.group({
        courseName: ['', [Validators.required]],
        email: [''.toLowerCase(), [Validators.required, Validators.email]],
        cif: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        stateShort: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        countryFull: ['', [Validators.required]],
        id_language: ['', [Validators.required]],
      });
    } else {
      this.form = this.formBuilder.group({
        courseName: [this.detail.courseName, [Validators.required]],
        email: [this.detail.email, [Validators.required, Validators.email]],
        cif: [this.detail.cif, [Validators.required]],
        phone: [this.detail.phone, [Validators.required]],
        address: [this.detail.address, [Validators.required]],
        stateShort: [this.detail.stateShort, [Validators.required]],
        zipCode: [this.detail.zipCode, [Validators.required]],
        countryFull: [this.detail.countryFull, [Validators.required]],
        id_language: [this.detail.id_language, [Validators.required]],
      });
    }

  }


  submit() {
    this.loading = true;
    this.campusSvc.updateGolfCourse(this.id, this.form.value).subscribe(res => {   
      this.loading = false;
      this.firebaseSvc.Toast(this.translate.instant('UTILS.saved_success'));
      this.getGolfCourse();
    }, error => {
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'));
      this.loading = false;
    })
  }

  getGolfCourse() {

    this.campusSvc.getData().subscribe(async ({ data }) => {
      this.campusSvc.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];
      this.detail.teesList = JSON.parse(this.detail.teesList);
      this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);
      this.getForm();
        
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
    let imgUrl = await this.firebaseSvc.uploadPhoto('golfcourses/' + image.dataUrl.slice(30, 40), image.dataUrl);   
    let data = {thumbnailImage: imgUrl};

    this.campusSvc.updateGolfCourse(this.id, data).subscribe(res => {
      this.getGolfCourse();
      this.firebaseSvc.Toast(this.translate.instant('UTILS.uploaded_images'))
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'))
      loading.dismiss();
    })
  }

  get courseName() {
    return this.form.get('courseName');
  }
  get email() {
    return this.form.get('email');
  }
  get cif() {
    return this.form.get('cif');
  }
  get phone() {
    return this.form.get('phone');
  }
  get address() {
    return this.form.get('address');
  }
  get stateShort() {
    return this.form.get('stateShort');
  }
  get zipCode() {
    return this.form.get('zipCode');
  }
  get countryFull() {
    return this.form.get('countryFull');
  }
  get id_language() {
    return this.form.get('id_language');
  }
}
