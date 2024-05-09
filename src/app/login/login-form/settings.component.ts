import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController  } from '@ionic/angular';
import { AppService } from '../../app.service';
import { Storage } from '@ionic/storage-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import * as myGlobals from '../../../globals';
import { HTTP } from '@ionic-native/http/ngx';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'page-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {


  public storelocalUser: boolean=true;
  public autoSync: boolean=true;
  public lastLoggedUsername;
  public session="15";

  public ClinicalSummaries2: any[] = [];
  public toLoad;loaded;errorOnLoop;

  constructor(
    private storage: Storage,
    private spinnerDialog: SpinnerDialog,
    private dialogs: Dialogs,
    private http: HTTP,
    private navCtrl: NavController,
  ) {


  }


  async ngOnInit() {

//Comment this
//this.locked=false;
//this.accepted=true;

/**/
this.http.setRequestTimeout(30);
    this.storage.get('storelocalUser').then((data) => {

        if(data==='Sim'){

            this.storelocalUser=true;

        }else{
          this.storelocalUser=false;
        }

      },
      error => console.error(error)
    );

    this.storage.get('autoSync').then((data) => {

      if(data==='Sim'){

          this.autoSync=true;

      }else{
        this.autoSync=false;
      }

      },
      error => console.error(error)
      );


      this.storage.get('lastLoggedUsername').then((data) => {

        this.lastLoggedUsername=data;

        if(this.lastLoggedUsername==null||this.lastLoggedUsername==""){
this.storelocalUser=true;
this.autoSync=true;
        }
    },
    error => console.error(error)

    );



  }

  storelocalUserChanged(e):void{

    if(e.detail.checked)
    this.storage.set('storelocalUser', 'Sim');
    else
    this.storage.remove('storelocalUser');

    }

 autoSyncChanged(e):void{

if(e.detail.checked)
this.storage.set('autoSync', 'Sim');
else
this.storage.remove('autoSync');

}

uploadUsageReports() {

  this.loaded=1;

  this.storage.get('epts-clinical-summaries').then(async (data) => {
    if (data) {
      this.ClinicalSummaries2 = data.filter(item=>item.username.toUpperCase()==this.lastLoggedUsername.toUpperCase() && item.status=="not_uploaded");
      var allCS= data;
      this.toLoad=this.ClinicalSummaries2.length;

      this.errorOnLoop="";

      if (this.ClinicalSummaries2.length > 0) {

        this.spinnerDialog.show(null, "Enviando "+this.toLoad+" relatórios...", true);

        for(let cs of this.ClinicalSummaries2){

          let payload = {
            eventDate: cs.dateOpened,
            status:"COMPLETED",
            completedDate:new Date(),
            program:"zUzKes56b9I",
            programStage:"t4XLfwKYcuO",
            orgUnit:"HxSLEPpHkuK",
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
              }
            ]
          };

      await this.http.post("https://dhis2.fgh.org.mz/api/events",             //URL
      JSON.stringify(payload),         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa("clinical.summary:Local123@")
      } // Headers
      )
      .then(response => {

        this.loaded=this.loaded+1;

        var clinicalsummaries=allCS.filter(item => item.dateOpened!=cs.dateOpened);
        cs.status="uploaded";
        clinicalsummaries.push(cs);

        this.storage.set("epts-clinical-summaries",clinicalsummaries);

        if(this.loaded>this.toLoad){
           this.spinnerDialog.hide();
           this.dialogs.alert(this.toLoad +" relatório(s) de uso enviado(s) com sucesso para a nuvem!","Informação");
         }


      })
      .catch(response => {
        this.spinnerDialog.hide();
        this.dialogs.alert("Não foi possivel enviar os dados para a nuvem. Verifique o seu sinal de internet!","Erro ao enviar");
        this.errorOnLoop="errorOnLoop";

      });

    if(this.errorOnLoop=="errorOnLoop"){
      break;
    }

        }

    }
    else{
      this.spinnerDialog.hide();
      this.dialogs.alert("Sem relatórios por enviar!","Informação");
    }


    }
  }).catch(error=>{this.dialogs.alert("Sem relatórios por enviar!","Informação");});

}


  async wipeData(){
  var confirm = await this.dialogs.confirm('Deseja reconfigurar o aplicativo com apoio da equipa de Sistemas de Informação?', 'Confirmação', ['Sim', 'Não']);

    if (confirm == 1) {
      this.spinnerDialog.show(null, "Eliminando dados...", true);

      window.localStorage.removeItem('url');
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('password');
      this.storage.remove('url');
      window.localStorage.clear();
      window.sessionStorage.clear();
      this.storage.clear();

      setTimeout(() => {
      this.navCtrl.navigateRoot("/login");
      this.spinnerDialog.hide();
  }, 3000);
}

  }


  async addHealthFacility(){

    var confirm = await this.dialogs.confirm('Deseja Adicionar mais uma unidade Sanitária?', 'Confirmação', ['Sim', 'Não']);

    if(confirm == 1){
      this.spinnerDialog.show(null, "Adicionando uma unidade ", true);

      this.storage.remove('healthfacility');
      this.storage.remove('selectedConfiguration');
      this.storage.remove('url');

      setTimeout(() => {
        this.navCtrl.navigateRoot("/login");
        this.spinnerDialog.hide();
      }, 3000);

    }

  }

}
