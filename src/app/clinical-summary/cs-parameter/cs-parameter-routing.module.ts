import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsParameterComponent } from './cs-parameter.component';

const routes: Routes = [
  {
    path: 'csparameter',
    component: CsParameterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsParameterRoutingModule {}
