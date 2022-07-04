import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/core/services/friends.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {

  constructor(
    public notificationSvc: NotificationsService,
    private friendService: FriendsService,
    private firebaseService: FirebaseService
    ) { }

  ngOnInit() {}

  acceptRequest(connection_id){
    this.friendService.acceptRequest(connection_id).subscribe(res =>{ 
      this.firebaseService.Toast('Solicitud de amistad aceptada')   
    })
  }

  declineRequest(connection_id){
    this.friendService.declineRequest(connection_id).subscribe(res =>{
      this.firebaseService.Toast('Solicitud de amistad rechazada')    
    })
  }
}
