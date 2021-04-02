import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'splitAndGet',
})
export class SplitAndGetPipe implements PipeTransform {
  transform(input: string, separator: string,index:number): string {
    return input.split(separator)[index];
  }
}
