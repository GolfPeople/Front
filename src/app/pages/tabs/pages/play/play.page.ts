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

  filteredApplyGames = 0;
  filteredApplyTournamen = 0;

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

    this.filteredApplyGames = 0;
    this.filteredApplyTournamen = 0;

    if (!this.toggleGameType$.value) {

      this.toggleOptionsUserGames = { one: 'Partidas', two: 'Mis Partidas' };
     
    
      if(this.toggleUserGames$.value == true && this.toggleGameType$.value == false){
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true);
      }else{
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
      }

      if(this.filteredGames.length == 0){
       this.filteredApplyGames = 1;
      }
    } else { 
      this.toggleOptionsUserGames = { one: 'Torneos', two: 'Mis Torneos' };
      if(this.toggleUserGames$.value == true && this.toggleGameType$.value == true){
        this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true);
      }else{
        this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false);
      }
     if(this.filteredTournaments.length == 0){
       this.filteredApplyTournamen = 1;
      }
    }
  //  this.date$.next('');
    this.searchResult = '';
    this.searchAddressResult = '';
  //  this.dateResult = '';
  
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
      this.filterByName();
    } else {
      if (!this.toggleUserGames$.value) { 
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
        if(this.filteredGames.length == 0){
         this.filteredApplyGames = 1;
        }
      //  this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false);
    
      } else { 
        this.filterByStatus();
      }
    }
    }else if(this.toggleGameType$.value == true){
      if (this.searchResult) { 
        this.filterByName();
      } else {
        if (!this.toggleUserGames$.value) { 
          this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false); 
          if(this.filteredTournaments.length == 0){
            this.filteredApplyTournamen = 1;
           }
        
        } else { 
          this.filterByStatus();
        }
      }
    }
  }

  filterDates(){
 

   // this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
   // this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false);
 
    if(this.toggleGameType$.value == false){
      if (!this.toggleUserGames$.value) {
        this.filteredApplyGames = 1;
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
        return datePipe.transform(g.date, 'mediumDate').includes(datePipe.transform(this.date$.value, 'mediumDate'));
      })
    } else {
      this.filteredApplyGames = 1;
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true).filter(g => {
        return datePipe.transform(g.date, 'mediumDate').includes(datePipe.transform(this.date$.value, 'mediumDate'));
      })
      
    }
    }else if(this.toggleGameType$.value == true){
      if (!this.toggleUserGames$.value) {
        this.filteredApplyTournamen = 1;
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false).filter(g => {
       return datePipe.transform(g.date, 'mediumDate').includes(datePipe.transform(this.date$.value, 'mediumDate'));
      })
    } else {
      this.filteredApplyTournamen = 1;
      const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true
        ).filter(g => {
       return datePipe.transform(g.date, 'mediumDate').includes(datePipe.transform(this.date$.value, 'mediumDate'));
      })
      
    }
    }
  
  }

  filterByName() {
    if(this.toggleGameType$.value == false){
    if (!this.toggleUserGames$.value) {
       this.filteredApplyGames = 1;
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    } else {
      this.filteredApplyGames = 1;
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    }
  }else if(this.toggleGameType$.value == true){
    if (!this.toggleUserGames$.value) {
      this.filteredApplyTournamen = 1;
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    }else{
      this.filteredApplyTournamen = 1;
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    }
  }
  }

  filterByAddress() {  
    if(this.toggleGameType$.value == false){
      if (!this.toggleUserGames$.value) {
        this.filteredApplyGames = 1;
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
          return g.address.toLocaleLowerCase().includes(this.searchAddressResult.toLocaleLowerCase())
        })
      } else {
        this.filteredApplyGames = 1;
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true).filter(g => {
          return g.address.toLocaleLowerCase().includes(this.searchAddressResult.toLocaleLowerCase())
        })
      }
    }else if(this.toggleGameType$.value == true){
      if (!this.toggleUserGames$.value) {
        this.filteredApplyTournamen = 1;
        this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == false).filter(g => {
          return g.address.toLocaleLowerCase().includes(this.searchAddressResult.toLocaleLowerCase())
        })
      }else{
        this.filteredApplyTournamen = 1;
        this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true).filter(g => {
          return g.address.toLocaleLowerCase().includes(this.searchAddressResult.toLocaleLowerCase())
        })
      }
    }
  }

  filterByStatus() {
   if(this.toggleGameType$.value == false){
    if (this.filterSelected !== '0') { 
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true && g.status == this.filterSelected);
    } else {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true);
    }
    if(this.filteredGames.length == 0){
      this.filteredApplyGames = 1;
     }
  }else if(this.toggleGameType$.value == true){
   if (this.filterSelected !== '0') {
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true && g.status == this.filterSelected);
    }else {
      this.filteredTournaments = this.gameSvc.tournament$.value.filter(g => g.isMember == true);
    }
    if(this.filteredTournaments.length == 0){
      this.filteredApplyTournamen = 1;
     }
  }
  }

  getTournaments() {
   
      if (!this.filteredTournaments.length) {
        this.loading = true;
      }
  
     let tournamentWithoutCreator = [];
  
      this.gameSvc.getTournaments().subscribe(res => {
        this.loading = false;

        //Verficar si hay partidas sin creador
       
        this.gameSvc.tournament$.next(res.data.reverse().filter(t => !tournamentWithoutCreator.includes(t.id)).map(t => {
 
            return {
              id: t.id,
              campuses_id: t.campuses_id,
              tournament_init: t.tournament_init,
              address: t.address,
              created_at: t.created_at,
              name: t.name,
              date: t.date,
              points: t.points,
              players: t.players,
              price: t.price,
              lat: t.lat,
              long: t.long,
              services: t.services,
              isMember: (t.players.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
              isInvited: (t.players.filter(u => u.user.id == JSON.parse(localStorage.getItem('user_id')) &&  u.admin == 1).length ? true : false ),
              validate: (t.players.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status) && u.validate).length ? true : false),
        
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

/*
  getPostPageOne() {
    this.postsSvc.all(1).subscribe(
      ({ data }) => {

        this.posts = data;

        this.page += 1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadMorePost() {

    this.postsSvc.all(this.page).subscribe(
      ({ data }) => {

        this.posts.push(...data);
        this.page += 1;
      },
      (error) => {
        console.log(error);
      }
    );
  }*/


}
