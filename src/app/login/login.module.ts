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
import { SettingsComponent } from './login-form/settings.component';

@NgModule({
  imports: [
    IonicModule,
    LoginRoutingModule,
    FormsModule, ReactiveFormsModule,CommonModule
    
  ],
  declarations: [
    LoginFormComponent,
    SettingsComponent
  ],
  exports: [
    LoginFormComponent,
    SettingsComponent
  ],
  providers: [
  ],
  entryComponents: [
    LoginFormComponent,
    SettingsComponent
  ]
})
export class LoginModule { }
