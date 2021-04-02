import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoComponent } from './info.component';

import { InfoPageRoutingModule } from './info-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    InfoPageRoutingModule
  ],
  declarations: [InfoComponent]
})
export class InfoPageModule {}
