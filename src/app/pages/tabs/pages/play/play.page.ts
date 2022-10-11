import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { AlertConfirmComponent } from '../../components/alert-confirm/alert-confirm.component';
import { GameDetailPage } from './pages/game-detail/game-detail.page';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {
 
  toggleOptionsGameType = { one: 'Partidas', two: 'Torneos' };
  toggleOptionsUserGames = { one: 'Partidas', two: 'Mis Partidas' };
  toggleGameType$ = new BehaviorSubject(false);
  toggleUserGames$ = new BehaviorSubject(false);
  date$ = new BehaviorSubject('')
  userInfo$ = this.date$.asObservable(); 
  games = [];
  filteredGames = [];
  filteredTournaments = [];
  searchResult = '';
  searchAddressResult = '';
  dateResult = '';

  loading: boolean;

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  filterSelected = '0';
  gameFilters = [
    { id: '0', name: 'Todo' },
    { id: '1', name: 'Próximos' },
    { id: '2', name: 'En proceso' },
    { id: '4', name: 'Jugados' },
    { id: '3', name: 'Anulados' }
  ]

  upcoming = [];
  inProccess = [];
  played = [];
  canceled = []

  user
  constructor(
    private translateService: TranslateService,
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getAllGames();
    this.getTournaments();
    this.getCurrentUser();

  }

  getUserInfo(id){
    
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  getCurrentUser() {
    this.userService.user$.subscribe((data) => {
      this.user = data;
    });
  }

  createNewGame() {
    if (this.user.profile.handicap) {
      this.firebaseSvc.routerLink('/tabs/play/create-game/x/x')
    } else {
      this.handicapRequired();
    }

  }



  async removeGame() {

    this.gameSvc.removeGame(29).subscribe(res => {
      console.log(res);

    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')

    })


  }


  /**
*===================Handicap Requerido========================
*/
  async handicapRequired() {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Agregar',
        content: 'Necesitas agregar tu handicap antes de poder crear o participar en una partida.'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.firebaseSvc.routerLink('/tabs/profile/edit')
    }
  }

  changeLabels() {

    if (!this.toggleGameType$.value) {
      this.toggleOptionsUserGames = { one: 'Partidas', two: 'Mis Partidas' };
    } else {
      this.toggleOptionsUserGames = { one: 'Torneos', two: 'Mis Torneos' };
    }
  //  this.date$.next('');
    this.searchResult = '';
    this.searchAddressResult = '';
  //  this.dateResult = '';
     this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
     this.filteredTournaments = this.gameSvc.tournament$.value;
  }

  async openGameDetail(id) {
    const modal = await this.modalController.create({
      component: GameDetailPage,
      componentProps: { game_id: id },
      cssClass: 'modal-full'
    });

    await modal.present();

  }

  filterGames() {
  
    if(this.toggleGameType$.value == false){
    if (this.searchResult) {
      console.log('if 1 mis partidas')
      this.filterByName();
    } else {
      if (!this.toggleUserGames$.value) {
        console.log('else if mis partidas')
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
        this.filteredTournaments = this.gameSvc.tournament$.value;
    
      } else {
        console.log('else mis partidas')
        this.filterByStatus();
      }
    }
    }else if(this.toggleGameType$.value == true){
      if (this.searchResult) {
        console.log('if mis torneos')
        this.filterByName();
      } else {
        if (!this.toggleUserGames$.value) {
          console.log('else if mis torneos')
          this.filteredTournaments = this.gameSvc.tournament$.value;
          console.log(this.filteredTournaments)
        
        } else {
          console.log('else mis torneos')
          this.filterByStatus();
        }
      }
    }
  }

  filterDates(){

    console.log('filterDates filterDates');
    console.log(this.date$.value);

    this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
    this.filteredTournaments = this.gameSvc.tournament$.value;
 
    if(this.toggleGameType$.value == false){
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
        return datePipe.transform(g.date, 'mediumDate').includes(datePipe.transform(this.date$.value, 'mediumDate'));
      })
    }else if(this.toggleGameType$.value == true){
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => {
       return datePipe.transform(g.date, 'mediumDate').includes(datePipe.transform(this.date$.value, 'mediumDate'));
      })
    }
  
  }

  filterByName() {
    if(this.toggleGameType$.value == false){
    if (!this.toggleUserGames$.value) {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    } else {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    }
  }else if(this.toggleGameType$.value == true){
    if (!this.toggleUserGames$.value) {
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    }
  }
  }

  filterByStatus() {
   if(this.toggleGameType$.value == false){
    if (this.filterSelected !== '0') {
      console.log(this.filterSelected)
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true && g.status == this.filterSelected);
      console.log(this.filteredGames)
    } else {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true);
      console.log(this.filteredGames)
    }
  }else if(this.toggleGameType$.value == true){
   if (this.filterSelected !== '0') {
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.status == this.filterSelected);
      console.log(this.filteredTournaments)
    }else {
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true);
      console.log(this.filteredTournaments)
    }
  }
  }

  filterByAddress() {
    if(this.toggleGameType$.value == false){
    const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
    this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
      
      return g.address.toLocaleLowerCase().includes(this.searchAddressResult.toLocaleLowerCase())
    })
    }else if(this.toggleGameType$.value == true){
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => {
        return g.address.toLocaleLowerCase().includes(this.searchAddressResult.toLocaleLowerCase())
      })

    }
  }

  getTournaments() {
   
      if (!this.filteredTournaments.length) {
        this.loading = true;
      }
  
     let tournamentWithoutCreator = [];
  
      this.gameSvc.getTournaments().subscribe(res => {
        this.loading = false;
  
      //  console.log(res);
  
        //Verficar si hay partidas sin creador
       
        this.gameSvc.tournament$.next(res.data.reverse().filter(t => !tournamentWithoutCreator.includes(t.id)).map(t => {
  
            
            return {
              id: t.id,
              campuses_id: t.campuses_id,
              game_init: t.game_init,
              address: t.address,
              created_at: t.created_at,
              name: t.name,
              date: t.date,
              players: t.players,
              price: t.price,
              lat: t.lat,
              long: t.long,
              services: t.services,
              isMember: (t.players.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status)).length ? true : false),
           
              description: t.description,
              image: t.image,
              status: t.status,
              courses: t.courses, 
             }
  
        }).sort(function (a, b) {
          if (parseInt(a.status) > parseInt(b.status)) {
            return 1;
          }
          if (parseInt(a.status) < parseInt(b.status)) {
            return -1;
          }
          return 0;
        })
  
        )
  
  
        this.filterGames();
      })
    
  }

  getAllGames() {
    if (!this.filteredGames.length) {
      this.loading = true;
    }

   let gamesWithoutCreator = [];

    this.gameSvc.getAllGames().subscribe(res => {
      this.loading = false;

     // console.log(res);

      //Verficar si hay partidas sin creador
      res.data.map(game => {
        if (!game.users.filter(user => user.status == '4')[0]) {
          gamesWithoutCreator.push(game.id)
        }
      })

      this.gameSvc.games$.next(res.data.reverse().filter(g => !gamesWithoutCreator.includes(g.id)).map(g => {

          return {
            game_init: g.game_init,
            address: g.address,
            created_at: g.created_at,
            campuses_id: g.campuses_id,
            date: g.date,
            id: g.id,
            lat: g.lat,
            long: g.long,
            name: g.name,
            reserves: g.reserves,
            isOwner: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '4').length ? true : false),
            owner_id: g.users.filter(u => u.status == '4')[0].user_id,
            users: g.users.filter(u => { return ['2', '4'].includes(u.status) }),
            noColor: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && !u.teeColor).length ? false : true),
            fav: false,
            isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status)).length ? true : false),
            status: g.status,
            request_users: g.request_users,
            isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
            pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
            validate: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status) && u.validate).length ? true : false)
          }

      }).sort(function (a, b) {
        if (parseInt(a.status) > parseInt(b.status)) {
          return 1;
        }
        if (parseInt(a.status) < parseInt(b.status)) {
          return -1;
        }
        return 0;
      })

      )


      this.filterGames();
    })
  }

  filterGamesByCategory(id) {
    this.filterSelected = id;
    this.filterGames();
  }


}
