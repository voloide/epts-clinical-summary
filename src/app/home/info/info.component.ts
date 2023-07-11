import { Component} from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NavController  } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

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
  public ClinicalSummaries2: any[] = [];
  public toLoad;loaded;errorOnLoop;

  constructor(
    private menu: MenuController,
    private http: HTTP,
    private navCtrl: NavController,
    private router: Router,
    private storage: Storage
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
    console.log(this.user)
    this.http.setDataSerializer( "utf8" );

    this.storage.get('autoSync').then((data) => {

      if(data==='Sim'){

        this.doSync();

      }

      },
      error => console.error(error)

      );
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

doSync(){
  return new Promise((resolve, reject) => {

    this.loaded=1;

  this.storage.get('epts-clinical-summaries').then(async (data) => {
    if (data) {
      this.ClinicalSummaries2 = data.filter(item=>item.username.toUpperCase()==this.user.user.username.toUpperCase() && item.status=="not_uploaded");
      var allCS= data;
      this.toLoad=this.ClinicalSummaries2.length;

      this.errorOnLoop="";

      if (this.ClinicalSummaries2.length > 0) {

       // this.spinnerDialog.show(null, "Carregando "+this.toLoad+" relatórios...", true);

        for(let cs of this.ClinicalSummaries2){

          let payload = {
            eventDate: cs.dateOpened,
            status:"COMPLETED",
            completedDate:new Date(),
            program:"zUzKes56b9I",
            programStage:"t4XLfwKYcuO",
            orgUnit:cs.orgUnit,
            dataValues:[
              {
                 dataElement:"B1ifFNRXkzo",
                 value:cs.report
              },
              {
                dataElement:"D37WjvR8AIt",
                value:cs.us
              },
              {
                dataElement:"bRYKxt09HrK",
                value:cs.username
              },
              {
                dataElement:"iYompJgWa6M",
                value:""
              },
              {
                dataElement:"PEK0zg7jLdy",
                value:cs.terms
              },
              {
                dataElement:"N3ZdmJS2k14",
                value:"v1.8.0"
              },
              {
                dataElement:"TlRYVhyidTx",
                value:cs.location
              },
              {
                dataElement:"B8ynUVKINff",
                value:cs.location_uuid
              }
            ]
          };

      await this.http.post("http://10.10.12.96:8099/dhis/api/events",             //URL
      JSON.stringify(payload),         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa("admin:district")
      } // Headers
      )
      .then(response => {

        this.loaded=this.loaded+1;

        var clinicalsummaries=allCS.filter(item => item.dateOpened!=cs.dateOpened);
        cs.status="uploaded";
        clinicalsummaries.push(cs);

        this.storage.set("epts-clinical-summaries",clinicalsummaries);

        if(this.loaded>this.toLoad){
           //this.spinnerDialog.hide();
           //console.log(this.toLoad +" relatório(s) de uso enviado(s) com sucesso para a nuvem!");
         }


      })
      .catch(response => {
        //console.log("Não foi possivel enviar os dados para a nuvem. Verifique o seu sinal de internet!");
        this.errorOnLoop="errorOnLoop";

      });

    if(this.errorOnLoop=="errorOnLoop"){
      break;
    }

        }

    }
    else{
      //this.spinnerDialog.hide();
      console.log("Sem relatórios por enviar!");
    }


    }
  });

});

}



}
