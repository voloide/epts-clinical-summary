import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController  } from '@ionic/angular';
import { AppService } from '../../../app/app.service';
import { Storage } from '@ionic/storage-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import * as myGlobals from '../../../globals';
import { HTTP } from '@ionic-native/http/ngx';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'page-login',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {

  user: any;

  form: FormGroup;
  loginFail: string = "hide";
  loginAccess: string = "hide";
  isDisabled: boolean;
  public type = 'password';
  public showPass = false;

  public storelocalUser: boolean=true;
  public autoSync: boolean=true;
  public locked: boolean=true;
  public accepted: boolean=false;

  public color;usern;passw;url;

  localUser = { url:'',username: '', password: '',pin:'' ,roles:''};

  public activationList=myGlobals.activationList;
  public activation;
  public ClinicalSummaries2: any[] = [];
  public lastLoggedUsername;
  public toLoad;loaded;errorOnLoop;

    // Variavel para Definicao das variaveis de pesquisa com base na role
    public receptionistaUUID = "e2f0aff0-1d5f-11e0-b929-000c29ad1d07"
    public conselheiroUUID = "e2f0ab90-1d5f-11e0-b929-000c29ad1d07"
    public tecFarmaciaUUID = "e2f0b43c-1d5f-11e0-b929-000c29ad1d07"
    public tecLabUUID = "e2f0b55e-1d5f-11e0-b929-000c29ad1d07"
    public provedorSaudeUUID = "e2f0acbc-1d5f-11e0-b929-000c29ad1d07"
    public roleViewLevel = null;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private storage: Storage,
    private spinnerDialog: SpinnerDialog,
    private dialogs: Dialogs,
    private http: HTTP,
    private menu: MenuController
  ) {


    this.form = formBuilder.group({
      url: ['', [
        Validators.required
      ]],
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
      pin: ['', [
        Validators.required
      ]],
 storelocalUser: [],
 autoSync: []

    });

  }

  showPassword() {
    this.showPass = !this.showPass;

    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }


  openSettings() {
   this.navCtrl.navigateForward('/settings');
  }

  ionViewWillEnter() {
    this.ngOnInit();
}

  async  ngOnInit() {
    this.locked=true;
    this.accepted=false;
    this.menu.enable(false, 'first');
    this.http.setRequestTimeout(30);

    await this.storage.create();

    this.localUser.url="http://";

    this.storage.get('key').then((data) => {
      if(data=="YES"){
        this.locked=false;
      }else{
        this.locked=true;
        this.localUser.pin="";
      }
          });

  this.storage.get('accepted').then((data) => {
    if(data=="YES"){
      this.accepted=true;
    }else{
      this.accepted=false;
    }
        });

   if(this.locked){
    this.activation = this.activationList[Math.floor(Math.random() * this.activationList.length)];
   }
//Comment this
//this.locked=false;
//this.accepted=true;


        setTimeout(async () =>
        {
        if(!this.locked&&!this.accepted){

          var confirm=await this.dialogs.confirm('O utilizador deste aplicativo se compromete a fazer uso adequado dos conteúdos e das informações que o aplicativo oferece respeitando as políticas de sigilo e confidencialidade em vigor na organização;\n\na) O utilizador não deve se envolver em actividades que sejam ilegais ou contrárias à boa fé do compromisso sigilo e confidencialidade durante a utilização do aplicativo;\n\nb) O utilizador não deve difundir o conteúdo do aplicativo (ex.: informação mostrada sobre os pacientes, credenciais de acesso).', 'Política de Privacidade e Termos de Uso', ['Concordo', 'Não concordo']);

     if (confirm==1){

          this.storage.set('accepted','YES');
          this.accepted=true;

            }
            else{
              this.spinnerDialog.show(null,"Fechando o aplicativo...",true);
              setTimeout(async () =>
        {
              this.spinnerDialog.hide();
              navigator['app'].exitApp();
        },2000);

            }

        }

        },500);

/**/

    this.storage.get('storelocalUser').then((data) => {

        if(data==='Sim'){

          this.storage.get('username')
          .then(
            data => {
              this.localUser.username=data;
              this.usern=data;
            });

            this.storage.get('url')
          .then(
            data => {
              if(data!=null){
              this.localUser.url=data;
              this.url=data;}
            });

            this.storelocalUser=true;


        }else{
          this.storelocalUser=false;
          this.storage.get('url')
          .then(
            data => {
              if(data!=null){
              this.localUser.url=data;
              this.url=data;}
            });
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

    this.color = "";
    this.isDisabled = false;

    this.http.setDataSerializer( "utf8" );


  }


  logoutLogin(){
        this.color = "";
        this.isDisabled = true;

        if(this.localUser.url==null||this.localUser.url.replace(/\s/g, "")==""||
        this.localUser.username==null||this.localUser.username.replace(/\s/g, "")==""||
        this.localUser.password==null||this.localUser.password.replace(/\s/g, "")==""){

          this.color = "danger";
              this.isDisabled = false;
              this.dialogs.alert("Preencha o Utilizador e Password!","Erro ao entrar");

              return;

        }


        window.localStorage.setItem('url',this.localUser.url );
        window.localStorage.setItem('username',this.localUser.username );
        window.localStorage.setItem('password',this.localUser.password );
        this.spinnerDialog.show(null,"Iniciando a sessão...",true);
        setTimeout(() =>
      {

        this.http.delete(
          this.localUser.url+'/ws/rest/v1/session',             //URL
          {},         //Data
          { 'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(this.localUser.username+":"+this.localUser.password) } // Headers
         )
         .then(response => {
          this.login();
         })
         .catch(response => {
          this.login();
         });

  },2000);

  }


  setURL(){
    this.color = "";
    this.isDisabled = true;

    if(this.localUser.url=="http://"||this.localUser.url=="https://"||this.localUser.url==null||this.localUser.url.replace(/\s/g, "")==""||(!this.localUser.url.includes("http://")&&!this.localUser.url.includes("https://"))){

          this.color = "danger";
              this.isDisabled = false;
              this.dialogs.alert("Escreva uma URL válida!","Erro ao gravar URL");

              return;

        }

    this.spinnerDialog.show(null,"Gravando a URL...",true);
    setTimeout(async () =>
      {

        if(this.localUser.pin.toUpperCase().replace(/\s/g, "")==this.activation.value){
          this.storage.set('url',this.localUser.url.replace(/\s/g, ""));
          window.localStorage.setItem('url',this.localUser.url.replace(/\s/g, ""));
          this.storage.set('key','YES');
          this.locked=false;
          this.spinnerDialog.hide();


//Terms and conditions
if(!this.locked&&!this.accepted){

  var confirm=await this.dialogs.confirm('O utilizador deste aplicativo se compromete a fazer uso adequado dos conteúdos e das informações que o aplicativo oferece respeitando as políticas de sigilo e confidencialidade em vigor na organização;\n\na) O utilizador não deve se envolver em actividades que sejam ilegais ou contrárias à boa fé do compromisso sigilo e confidencialidade durante a utilização do aplicativo;\n\nb) O utilizador não deve difundir o conteúdo do aplicativo (ex.: Informação mostrada sobre os pacientes nos relatórios, credenciais de acesso).', 'Política de Privacidade e Termos de Uso', ['Concordo', 'Não concordo']);

if (confirm==1){

  this.storage.set('accepted','YES');
  this.accepted=true;

    }
    else{
      this.spinnerDialog.show(null,"Fechando o aplicativo...",true);
      setTimeout(async () =>
{
      this.spinnerDialog.hide();
      navigator['app'].exitApp();
},2000);

    }
  }

        }else{

          this.spinnerDialog.hide();
              this.color = "danger";
              this.isDisabled = false;
              this.dialogs.alert("Chave inválida, não é possivel gravar URL!","Erro ao gravar URL");

        }

      },2000);

  }

  noAcess(){
    this.loginAccess = "";
          this.loginFail = "hide";
          this.isDisabled = false;

          this.spinnerDialog.hide();
          this.color = "danger";

          this.dialogs.alert("Credencias invalidas ou Acesso restrito!","Erro ao entrar");

          if (this.autoSync) {
            this.storage.set('autoSync', 'Sim');
          }else{
            this.storage.remove('autoSync');
          }

          if (this.storelocalUser) {

            this.storage.set('storelocalUser', 'Sim');
            this.storage.set('url',this.localUser.url );
            this.storage.set('username',this.localUser.username )
            } else {
          this.storage.remove('username');
          this.storage.remove('storelocalUser');

            }
  }

  login() {
    this.storage.set('lastLoggedUsername', this.localUser.username);
    this.http.get(
      this.localUser.url+'/ws/rest/v1/session',             //URL
      {},         //Data
      { 'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(this.localUser.username+":"+this.localUser.password) } // Headers
     )
     .then(response => {

      this.user = JSON.parse(response.data);
      if (this.user) {
        if (this.user.authenticated == true) {

           //Definicao do view Level baseado na role
    this.user.user.roles.forEach(element => {
      if (element.uuid == this.receptionistaUUID){
        window.localStorage.setItem('roleViewLevel',"one" );
        this.roleViewLevel = "one"
      } else
      if (element.uuid == this.conselheiroUUID){
        window.localStorage.setItem('roleViewLevel',"two" );
        this.roleViewLevel = "two"
      } else
      if (element.uuid == this.tecFarmaciaUUID){
        window.localStorage.setItem('roleViewLevel',"three" );
        this.roleViewLevel = "three"
      } else
      if (element.uuid == this.tecLabUUID){
        window.localStorage.setItem('roleViewLevel',"four" );
        this.roleViewLevel = "four"
      } else
      if (element.uuid == this.provedorSaudeUUID){
        window.localStorage.setItem('roleViewLevel',"five" );
        this.roleViewLevel = "five"
      } else {
        this.noAcess()
      }
    });
      if (this.roleViewLevel !== null){
        console.log(this.roleViewLevel)
        window.localStorage.setItem('user',JSON.stringify(this.user) );

          this.appService.callMethodOfSecondComponent();

          if (this.autoSync) {
            this.storage.set('autoSync', 'Sim');
          }else{
            this.storage.remove('autoSync');
          }

          if (this.storelocalUser) {

            this.storage.set('storelocalUser', 'Sim');
            this.storage.set('url',this.localUser.url );
            this.storage.set('username',this.localUser.username );

          } else {
          this.storage.remove('username');
          this.storage.remove('storelocalUser');
            }

          this.spinnerDialog.hide();
          this.navCtrl.navigateRoot('/home');
        }
        } else {
this.noAcess()

        }
      } else {
        this.loginAccess = "hide";
        this.loginFail = "";
        this.isDisabled = false;


        if (this.autoSync) {
          this.storage.set('autoSync', 'Sim');
        }else{
          this.storage.remove('autoSync');
        }

        if (this.storelocalUser) {

          this.storage.set('storelocalUser', 'Sim');
          this.storage.set('url',this.localUser.url );
          this.storage.set('username',this.localUser.username )

        } else {
           this.storage.remove('username');
           this.storage.remove('storelocalUser');
          }

        this.spinnerDialog.hide();
        this.color = "danger";

        this.dialogs.alert("Não foi possivel iniciar a secção. Verifique o estado da sua ligação com o servidor!","Erro ao entrar");

      }


     })
     .catch(response => {

      this.spinnerDialog.hide();
      this.color = "danger";
      this.dialogs.alert("Não foi possivel iniciar a secção. Verifique o estado da sua ligação com o servidor!","Erro ao entrar");
      this.isDisabled = false;


      if (this.autoSync) {
        this.storage.set('autoSync', 'Sim');
      }else{
        this.storage.remove('autoSync');
      }

      if (this.storelocalUser) {

        this.storage.set('storelocalUser', 'Sim');
        this.storage.set('url',this.localUser.url );
        this.storage.set('username',this.localUser.username )
        //this.storage.set('password',this.localUser.password )

      } else {
        this.storage.remove('username');
        this.storage.remove('storelocalUser');
        }


     });


}


uploadUsageReports() {
  this.color = "";

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
        this.color="danger";
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

}
