import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../services/campus-data.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {

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
      this.detail.teesList = JSON.parse(this.detail.teesList);
      this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);  
          
    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }
}