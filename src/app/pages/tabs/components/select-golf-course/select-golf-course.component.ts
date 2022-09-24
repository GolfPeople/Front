import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CampusDataService } from '../../pages/campus/services/campus-data.service';

@Component({
  selector: 'app-select-golf-course',
  templateUrl: './select-golf-course.component.html',
  styleUrls: ['./select-golf-course.component.scss'],
})
export class SelectGolfCourseComponent implements OnInit {

  loading: boolean;
  search = '';

  courses = [];
  constructor(    
    private campusSvc: CampusDataService,
    private modalController: ModalController
    ) { }

  ngOnInit() { 
    this.getCourses();
  }

  getCourses() {
    if(!this.courses.length){
       this.loading = true;
    }
   
    this.campusSvc.searchCourses(this.search).subscribe(res => {
      
      if(!this.search){
        this.courses = res.my_courses;
        this.courses.push(...res.all_courses)
      }else{
        this.courses = res.all_courses;
      }
      

      this.loading = false;
    }, err => {
      console.log(err);

    })
  }

  selectGolfCourse(course){
   this.modalController.dismiss({ course });
  }
}
