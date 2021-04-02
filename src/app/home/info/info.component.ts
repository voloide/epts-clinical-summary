import { Component} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NavController  } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'page-home-backups',
  templateUrl: 'info.component.html'
})
export class InfoComponent {
  public user;color;
  
  constructor(
    private menu: MenuController,
    private http: HTTP,
    private navCtrl: NavController,
    private router: Router
   ) {

    

  }

  openMenu() {
    this.menu.open('first');
  }

  ngOnInit() {
    this.menu.enable(true, 'first');
    this.color="primary";
    window.localStorage.removeItem('search');
    this.user = JSON.parse(window.localStorage.getItem('user'));
  }

  openClinicalSummary() {
    this.router.navigateByUrl("/csparameter");
  }

  openReportUsage() {
    this.router.navigateByUrl("/reportusage");
  }

  
  logout() {
   
    this.http.delete(
      window.localStorage.getItem('url')+'/ws/rest/v1/session',             //URL
      {},         //Data 
      { 'Content-Type': 'application/json', 
      Authorization: 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')) } // Headers
     )
     .then(response => {
      this.navCtrl.navigateRoot('/');
      this.menu.close();
      window.localStorage.clear();
     })
     .catch(response => {
      this.navCtrl.navigateRoot('/');
      this.menu.close();
      window.localStorage.clear();
     });
  }

}
