import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Ahora';
      const intervals = {
        'año': 31536000,
        'mes': 2592000,
        'sem': 604800,
        'día': 86400,
        'h': 3600,
        'min': 60,
        'seg': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i; // singular (1 day ago)
          } else {
            return counter + ' ' + i + (['sem','min','h','seg'].includes(i) ? '' : 's'); // plural (2 days ago)
          }
      }
    }
    return value;
  }

}
