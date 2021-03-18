import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorHandler } from '@angular/core';
import { ApplicationInsightsErrorHandler } from './ApplicationInsightsErrorHandler'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{  
      provide: ErrorHandler,  
      useClass: ApplicationInsightsErrorHandler  
  }, ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
