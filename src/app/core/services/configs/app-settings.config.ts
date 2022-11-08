import { Injectable } from '@angular/core';

@Injectable()
export class AppSettingsConfig {
   countries = [
    {
        name: 'Spain',
        code: 'ES'
    },
    {
        name: 'English',
        code: 'EN'
    }
  ];
  locales = [
    { title: 'Spanish', id: 'es-ES', flag: 'es' },
    { title: 'English', id: 'en-US', flag: 'us' }
  ];
  roles = ['user', 'admin'];

}
