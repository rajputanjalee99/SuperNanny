import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';



@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  websiteConnect: Subject<boolean> = new Subject<boolean>();
  isWebsiteConnect = this.websiteConnect.asObservable();

  constructor(
    private httpService : HttpService
  ) { }

  initSocket(data: any = null) {
    
    this.socket = socketIo.connect(environment.socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: Infinity,
      query: {
        token: this.httpService.getToken()
      }
    });
    
    data && this.socket.on('connect', (res: any) => {
      console.log('debug connect', res);
    
    });

    this.socket.on('disconnect', (message: any) => {
      console.log('debug disconnect', message);
    });
  }

  isConnected(){
   return  this.socket != null;
  }

  
  emitAction(action: any, payload: any): void {
    this.socket.emit(action, payload)    
  }

  public onEvent(event: any): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, (data:any) => observer.next(data));
    });
  }

  close() {
    this.socket.close();
  }
}
