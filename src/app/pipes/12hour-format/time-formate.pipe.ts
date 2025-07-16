import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormate'
})
export class TimeFormatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let time=value?.split(':',2)
  
    let hours = time[0];
    let minutes = time[1];
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;

    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    minutes = minutes < 10 ?  minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    // return strTime;
       return strTime;
   
  }

}
