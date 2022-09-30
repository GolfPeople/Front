import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PlayersGroup } from 'src/app/core/models/players-group.model';
import { FriendsService } from 'src/app/core/services/friends.service';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { SelectGolfCourseComponent } from 'src/app/pages/tabs/components/select-golf-course/select-golf-course.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { SelectFriendComponent } from '../../../../components/select-friend/select-friend.component';
import { CampusDataService } from '../../../campus/services/campus-data.service';
import { GuestFormComponent } from '../../components/guest-form/guest-form.component';


@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.page.html',
  styleUrls: ['./create-game.page.scss'],
})
export class CreateGamePage implements OnInit {

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  players$ = new BehaviorSubject([]);
  date$ = new BehaviorSubject('');
  campusSelected;


  loading: boolean;
  creating: boolean;
  loadingUsers: boolean;

  campus_id;
  player_id;

  user;

  currentDate = '';

  currentUserPlaying: boolean = true;

  playersGroup = {
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    seven: [],
  } as PlayersGroup;

  swapActive = false;
  playerToSwapId: number;

  constructor(
    private modalController: ModalController,
    private campusSvc: CampusDataService,
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private actRoute: ActivatedRoute,
    private friendsSvc: FriendsService,
    private userService: UserService,
    private datePipe: DatePipe,
  ) {
    /**
     * Si el usuario viene desde un campo, se selecciona el campo automaticamente con su id.
     * Si este valor es 'x' entonces el campo no se selecciona.
     */
    if (this.actRoute.snapshot.paramMap.get('id') !== 'x') {
      this.campus_id = JSON.parse(this.actRoute.snapshot.paramMap.get('id'))
    } else {
      this.campus_id = this.actRoute.snapshot.paramMap.get('id')
    }

    /**
     * Si el usuario viene desde el perfil de un amigo, se agrega ese usuario a la partida automaticamente con su id.
     * Si este valor es 'x' entonces no hay jugadores selecciona.
     */
    if (this.actRoute.snapshot.paramMap.get('playerId') !== 'x') {
      this.player_id = JSON.parse(this.actRoute.snapshot.paramMap.get('playerId'))
    } else {
      this.player_id = this.actRoute.snapshot.paramMap.get('playerId')
    }

  }

  ngOnInit() {

  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  ionViewWillEnter() {
    this.getUsers();
    this.getCurrentUser();
    this.getGolfCourse();
    this.currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd') + 'T00:00:00';
  }

  getCurrentUser() {
    this.userService.user$.subscribe((data) => {
      this.user = data;
    });
  }



  /**
   * We're checking if the player_id is not equal to 'x' (which is the default value). If it's not, we're
   * setting the loadingUsers variable to true, and then we're calling the search function from the
   * FriendsService. 
   * 
   * Once we get the response, we're filtering the data to get the player with the id that matches the
   * player_id. 
   * 
   * Then we're setting the loadingUsers variable to false, and we're setting the players$ variable to
   * the player we just filtered.
   */
  getUsers() {
    if (this.player_id !== 'x') {
      this.loadingUsers = true;
      this.friendsSvc.search('').subscribe(res => {
        let player = res.data.filter(u => u.id == this.player_id)

        this.loadingUsers = false;
        this.players$.next(player)
        this.getPlayersGroups()
      });
    }
  }

  /**
   * The function gets the golf course information from the database and displays it on the page
   */
  getGolfCourse() {
    if (this.campus_id !== 'x') {
      this.campusSvc.getCourseGames(this.campus_id).subscribe(res => {
        this.campusSelected = res;
      })
    }
  }


  /**
   * It creates a modal, presents it, and then waits for the modal to be dismissed. 
   * 
   * When the modal is dismissed, it checks to see if the modal passed back any data. If it did, it sets
   * the campusSelected variable to the data that was passed back.
   */
  async selectGolfCourse() {
    const modal = await this.modalController.create({
      component: SelectGolfCourseComponent,
      cssClass: 'select-course-modal'
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.campusSelected = data.course;
    }
  }



  /**
   * It takes the data from the form and assigns it to the game object
   */
  async createGame() {
    this.gameSvc.game.value.address = this.campusSelected.address;
    this.gameSvc.game.value.lat = this.campusSelected.latitude;
    this.gameSvc.game.value.long = this.campusSelected.longitude;
    this.gameSvc.game.value.date = this.date$.value;
    this.gameSvc.game.value.campus = this.campusSelected;
    this.gameSvc.game.value.campus.hour = [].push(this.gameSvc.game.value.campus.hour);
    this.gameSvc.game.value.campus.day = this.gameSvc.game.value.campus.day;
    this.gameSvc.game.value.campus.services = this.gameSvc.game.value.campus.services;
    this.gameSvc.game.value.users = this.players$.value;
    this.gameSvc.game.value.extra = this.gameSvc.game.value.reservation;
    this.gameSvc.game.value.currentUserPlaying = this.currentUserPlaying;

    this.firebaseSvc.routerLink('/tabs/play/available-hours');
  }



  /**
   * We create a modal, present it, and then when it's dismissed, we add the guest to the game
   */
  async addGuest() {
    const modal = await this.modalController.create({
      component: GuestFormComponent,
      cssClass: 'fullscreen-modal',
      componentProps: { playersLength: this.players$.value.length }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.gameSvc.game.value.guests.push(data.guest)
    }
  }


  /**
   * We're using the `splice()` method to remove the guest at the specified index
   * @param index - the index of the guest to remove
   */
  removeGuest(index) {
    this.gameSvc.game.value.guests.splice(index, 1);
  }



  //========================Players=======================
  /**
   * It opens a modal that allows the user to select friends from a list of friends
   */
  async selectPlayers() {

    const modal = await this.modalController.create({
      component: SelectFriendComponent,
      cssClass: 'fullscreen-modal',
      componentProps: {
        usersId: this.players$.value.map(u => { return (u.profile.id) })
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.players$.value.push(...data.players);
      this.getPlayersGroups();
    }
  }


  /**
 * It removes a player from the players array and then calls the getPlayersGroups function
 * @param userId - The id of the user to be removed from the players array.
 */
  removePlayer(userId) {
    this.players$.next(this.players$.value.filter(player => player.profile.id !== userId));
    this.getPlayersGroups();
  }

  /**
   * It takes the players array and slices it into 6 arrays of 4 players each
   */
  getPlayersGroups() {
    this.playersGroup.one = this.players$.value.slice(0, 3);
    this.playersGroup.two = this.players$.value.slice(3, 7);
    this.playersGroup.three = this.players$.value.slice(7, 11);
    this.playersGroup.four = this.players$.value.slice(11, 15);
    this.playersGroup.five = this.players$.value.slice(15, 19);
    this.playersGroup.six = this.players$.value.slice(19, 23);
  }

filterToSwapPlayers(userIdFrom, userIdTo){
  console.log('ids',userIdFrom, userIdTo);
  
  let indexFrom;
  let indexTo;

  this.players$.value.map((player, index) =>{

    if(player.profile.id == userIdFrom){
      indexFrom = index;       
    }

    if(player.profile.id == userIdTo){
      indexTo = index;
    }
  })

  this.swapPlayers(indexFrom, indexTo);
  
}


swapPlayers(indexFrom, indexTo){
  let element = this.players$.value[indexFrom]
  this.players$.value[indexFrom] = this.players$.value[indexTo]
  this.players$.value[indexTo] = element
  
  this.swapActive = false
  this.playerToSwapId = null
  this.getPlayersGroups();
}

  validator() {
    if (this.players$.value.length == 0) {
      return false;
    }
    if (!this.date$.value) {
      return false;
    }
    if (!this.campusSelected) {
      return false;
    }
    if (!this.gameSvc.game.value.name) {
      return false;
    }

    return true;
  }
}
