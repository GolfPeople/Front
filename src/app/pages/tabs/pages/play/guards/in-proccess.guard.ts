import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class InProccessGuard implements CanActivate {

  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService    
    ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    

    if(this.gameSvc.game.value.campus){
      return true;
    }else{
      this.firebaseSvc.routerLink('tabs/play/create-game/x');
      return false;
    }
  }
  
}
