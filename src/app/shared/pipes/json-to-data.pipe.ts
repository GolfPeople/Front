import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToData',
})
export class JsonToDataPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): any {
    const data = JSON.parse(value);

    return data;
  }
}
