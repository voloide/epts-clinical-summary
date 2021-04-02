import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeTabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeTabsComponent,
    children: [
      {
        path: 'info',
        loadChildren: () => import('./info/info.module').then(m => m.InfoPageModule)
      },
      {
        path: '',
        redirectTo: '/home/info',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/info',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
