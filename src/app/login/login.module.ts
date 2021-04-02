/**
 * @author damasceno.lopes
 * @email damascenolopess@gmail.com
*/
import { NgModule } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoutingModule } from './login-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

@NgModule({
  imports: [
    IonicModule,
    LoginRoutingModule,
    FormsModule, ReactiveFormsModule,CommonModule
    
  ],
  declarations: [
    LoginFormComponent
  ],
  exports: [
    LoginFormComponent
  ],
  providers: [
  ],
  entryComponents: [
    LoginFormComponent
  ]
})
export class LoginModule { }
