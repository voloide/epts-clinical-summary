import { NgModule } from '@angular/core';
import { CsParameterComponent } from './cs-parameter.component';
import { CsParameterRoutingModule } from './cs-parameter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';  

@NgModule({
  imports: [
    IonicModule,
    CsParameterRoutingModule,
    FormsModule, ReactiveFormsModule,CommonModule
    
  ],
  declarations: [
    CsParameterComponent
  ],
  exports: [
    CsParameterComponent
  ],
  providers: [
    
  ],
  entryComponents: [
    CsParameterComponent
  ]
})
export class CsParameterModule { }
