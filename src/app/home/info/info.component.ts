import { Component} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NavController  } from '@ionic/angular';
import { Router } from '@angular/router';

const MINUTES_UNITL_AUTO_LOGOUT = 15 // in mins
const CHECK_INTERVAL = 60000 // in ms
const STORE_KEY =  'lastAction';

@Component({
  selector: 'page-home-backups',
  templateUrl: 'info.component.html'
})
export class InfoComponent {
  
  public user;color;interval;
  val: any;
  static interval: number;

  
  
  constructor(
    private menu: MenuController,
    private http: HTTP,
    private navCtrl: NavController,
    private router: Router
   ) {

    if(window.localStorage.getItem('user')){
      this.check();
      this.initListener();
      this.initInterval();
      sessionStorage.setItem(STORE_KEY,Date.now().toString());
     }

    

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

  ngOnDestroy(){
    //console.log("DESTROIED")
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

     window.sessionStorage.clear();
     window.clearInterval(this.interval);

  }



//LOGOUT
initListener() {
  document.body.addEventListener('click', () => this.reset());
  document.body.addEventListener('mouseover',()=> this.reset());
  document.body.addEventListener('mouseout',() => this.reset());
  document.body.addEventListener('keydown',() => this.reset());
  document.body.addEventListener('keyup',() => this.reset());
  document.body.addEventListener('keypress',() => this.reset());
  document.body.addEventListener('touchstart',() => this.reset());
  document.body.addEventListener('touchend',() => this.reset());
  document.body.addEventListener('touchcancel',() => this.reset());
  document.body.addEventListener('touchmove',() => this.reset());

   window.addEventListener("storage",() => this.storageEvt());

}


reset() {

 //console.log('date got by using events',Date.now());
  this.setLastAction(Date.now());
  //console.log('store key',sessionStorage.getItem(STORE_KEY));

}

initInterval() {
 this.interval=setInterval(() => {
    this.check();
  }, CHECK_INTERVAL);
}

check() {
  const now = Date.now();
  const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
  const diff = timeleft - now;
  //console.log('difference',diff)
  const isTimeout = diff < 0;

  if (isTimeout)  {
   this.logout();
  }
}
storageEvt(){
//console.log("storage");
this.val = sessionStorage.getItem(STORE_KEY);
}


public getLastAction() {
  return parseInt(sessionStorage.getItem(STORE_KEY));
}
public setLastAction(lastAction: number) {
sessionStorage.setItem(STORE_KEY, lastAction.toString());
}

public static clearInterval(){
  window.sessionStorage.clear();
  window.clearInterval(this.interval);
  //console.log("Interval cleared")
}


}
