import { Injectable } from '@angular/core';

import {Subject} from 'rxjs'; 

@Injectable()
export class AppService {
  
   invokeEvent: Subject<any> = new Subject(); 

      callMethodOfSecondComponent() { 
        this.invokeEvent.next('someVal');     
      }

      callMethodOfSecondComponent2() { 
        this.invokeEvent.next('someVal2');     
      }


}