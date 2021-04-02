import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportUsageComponent } from './report.component';

const routes: Routes = [
  {
    path: 'reportusage',
    component: ReportUsageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportUsageRoutingModule {}
