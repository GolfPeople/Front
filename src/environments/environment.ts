// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebaseConfig: {
    projectId: 'golf-people',
    appId: '1:248337356424:web:aab2d7e1bb1bc13494313d',
    databaseURL: 'https://golf-people-default-rtdb.firebaseio.com',
    storageBucket: 'golf-people.appspot.com',
    locationId: 'europe-west6',
    apiKey: 'AIzaSyC0OsRsAPOyimEggpzSGd_rfm6N_Hfrz2w',
    authDomain: 'golf-people.firebaseapp.com',
    messagingSenderId: '248337356424',
  },
  production: false,
  golfpeopleAPI: 'https://www.api.app.golfpeople.com',
  mapsKey: 'AIzaSyCYXOtwSsEFgz7R14Y-ZKcyef-f-0Bs_s0',



  //===========Endpoints==============
  createChatRoom: '/chat/create/room',
  createGame: '/games/create',
  games: '/games/show/all',

  gameToggle: '/games/toogle/', //Acepta o rechaza si agregan al usuario actual a un juego
  gameRequestToggle: '/games/request/toogle/', //Acepta o rechaza una solicitud para entrar a un juego del usuario actual

  joinRequest: '/games/create/request',
  gameStatus: '/games/status/toogle/',
  destroyGame: '/games/destroy/'
  
  // firebaseConfig: {
  //   apiKey: 'AIzaSyC0OsRsAPOyimEggpzSGd_rfm6N_Hfrz2w',
  //   authDomain: 'golf-people.firebaseapp.com',
  //   projectId: 'golf-people',
  //   storageBucket: 'golf-people.appspot.com',
  //   messagingSenderId: '248337356424',
  //   appId: '1:248337356424:web:aab2d7e1bb1bc13494313d',
  // },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
