import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonToData',
})
export class JsonToDataPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const data = JSON.parse(value);

    return data;
  }
}
