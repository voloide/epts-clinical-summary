import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NavController  } from '@ionic/angular';
import { InfoComponent} from './home/info/info.component';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public user;url;show;appVersion;


  constructor(public appService: AppService,
    private router: Router,
    private menu: MenuController,
    private http: HTTP,
    private storage: Storage,
    private navCtrl: NavController) {

    this.appService.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.callMyMethod();
      }
    });

  }

  async callMyMethod() {
    await this.storage.create();

    this.storage.get('appVersion').then(data => {
      if(data!=null){
        this.appVersion=data;
      }
    });

    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.url = window.localStorage.getItem('url');
    this.show = true;



  }

  openDashboard(){
    this.router.navigateByUrl("/home");
    this.menu.close();
  }

  openClinicalSummary(){
    this.router.navigateByUrl("/csparameter");
    this.menu.close();
  }

  openReportUsage() {
    this.router.navigateByUrl("/reportusage");
    this.menu.close();
  }

  logout(){

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

     InfoComponent.clearInterval();

  }



}
