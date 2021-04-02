import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsReportComponent } from './cs-report.component';

const routes: Routes = [
  {
    path: 'csreport',
    component: CsReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsReportRoutingModule {}
