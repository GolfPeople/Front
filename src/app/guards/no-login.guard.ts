import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {

  constructor(
    private auth: AngularFireAuth,
    private router: Router
    ) { }


  canActivate(): Observable<boolean> | boolean {
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');


    return this.auth.authState.pipe(map(auth => {

      if(auth && user_id && token){        
        return true;
      }else{ 
        this.router.navigateByUrl('/login')
        return false;
      }  
       
    }))
   
  }
}
