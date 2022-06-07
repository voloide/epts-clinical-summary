import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


//Custom Libs
import { IonicStorageModule } from '@ionic/storage-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AppService } from './app.service';


//Modules
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { HTTP } from '@ionic-native/http/ngx';
import { ClinicalSummaryModule } from './clinical-summary/cs.module';
import { ReportUsageModule } from './report-usage/report.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(),
    LoginModule,
    HomeModule,
    ClinicalSummaryModule,
    ReportUsageModule
  
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },SpinnerDialog,Dialogs,AppService,HTTP],
  bootstrap: [AppComponent],
})
export class AppModule {}
