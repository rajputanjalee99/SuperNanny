import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './services/http/http.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DatePipe, DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    HttpClientModule,
    MatSnackBarModule,
    CommonModule,
    MatTooltipModule,
  ],
  providers: [{ 
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpService, multi: true,
    },
    {
      provide:MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory, deps: [Overlay] 
    },
    NgxUiLoaderService,
    DatePipe,
    // {provide: DATE_PIPE_DEFAULT_TIMEZONE, useValue: {timezone: '-1200'}}
    {
      provide: DATE_PIPE_DEFAULT_TIMEZONE,
      useValue: new Date().getTimezoneOffset().toString(),      
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
