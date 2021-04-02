/**
 * @author damasceno.lopes
 * @email damascenolopess@gmail.com
*/
import { NgModule } from '@angular/core';
import { HomeTabsComponent } from './tabs/tabs.component';
import { InfoPageModule } from './info/info.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';  
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    HomeRoutingModule,
    InfoPageModule
  ],
  declarations: [
    HomeTabsComponent
  ],
  exports: [
    HomeTabsComponent
  ],
  providers: [

  ],
  entryComponents: [
    HomeTabsComponent
  ]
})
export class HomeModule { }