import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { SettingsComponent } from './login-form/settings.component';

const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent,
  }
,{
  path: 'settings',
  component: SettingsComponent,
},
{
  path: 'login',
  component: LoginFormComponent,
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
