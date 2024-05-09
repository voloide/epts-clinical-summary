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


  localUser = {url:'',username: '', password: '',pin:'' ,roles:'', healthfacility:''};

  indexuser = {accepted:'', key:'', autoSync:'', lastLoggedUsername:'', storelocalUser:'' ,url:'',username: '' , healthfacility:'', user: null, localUser:null};

  configuracoes: any[] = [];


  public activationList=myGlobals.activationList;
  public activation;
  public ClinicalSummaries2: any[] = [];
  public lastLoggedUsername;
  public toLoad;loaded;errorOnLoop;
  public selectHealthFacility;
  public isAddHealthFacility: boolean;


    // Variavel para Definicao das variaveis de pesquisa com base na role
    public receptionistaUUID = "bd53e025-4bea-441d-ab63-c5f65657bf71"
    public conselheiroUUID = "481db7f3-601e-4dd9-be59-3f24bc080134"
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
      healthfacility: ['', [
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
    this.isAddHealthFacility=false;
    this.localUser.username='';
    this.localUser.pin="";
    this.localUser.healthfacility="";

  this.storage.get('selectedConfiguration').then((data) => {

      if(data.key=="YES"){
        this.locked=false;
      }else{
        this.locked=true;
        this.localUser.pin="";
      }

            if(data.accepted=="YES"){
              this.accepted=true;
            }else{
              this.accepted=false;
            }

              this.lastLoggedUsername=data.lastLoggedUsername

              if(this.lastLoggedUsername==null||this.lastLoggedUsername==""){
  this.storelocalUser=true;
  this.autoSync=true;
              }


        },
        error => console.error(error)
        );


   if(this.locked){
    this.activation = this.activationList[Math.floor(Math.random() * this.activationList.length)];
   }
//Comment this
//this.locked=false;
//this.accepted=true;


        setTimeout(async () =>
        {
        if(!this.locked&&!this.accepted){

          var confirm=await this.dialogs.confirm('O utilizador deste aplicativo se compromete a fazer uso adequado dos conteúdos e das informações que o aplicativo oferece respeitando as políticas de sigilo e confidencialidade em vigor na organização;\n\na) Ao acessar este sistema, você está prestes a visualizar informações altamente confidenciais de utentes. É sua responsabilidade protegê-las adequadamente e usá-las somente para os fins autorizados. A privacidade dos utentes é essencial para nossa missão. \n\nb) O utilizador não deve se envolver em actividades que sejam ilegais ou contrárias à boa fé do compromisso sigilo e confidencialidade durante a utilização do aplicativo;\n\nc) O utilizador não deve difundir o conteúdo do aplicativo (ex.: informação mostrada sobre os pacientes, credenciais de acesso).', 'Política de Privacidade e Termos de Uso', ['Concordo', 'Não concordo']);

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


this.storage.get('configuracoes').then((data) => {
  if(data!=null){
  this.configuracoes = data;

  }else{
   this.configuracoes = [];
  }

});

    this.storage.get('storelocalUser').then((data) => {

        if(data==='Sim'){
          this.isAddHealthFacility=true;
          this.storage.remove('storelocalUser');
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
              this.url=data;

            }
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
        this.storage.remove('autoSync');
          this.autoSync=true;

      }else{
        this.autoSync=false;
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


        window.localStorage.setItem('appVersion',"v1.8.0" );
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

        if(this.localUser.healthfacility==null||this.localUser.healthfacility.replace(/\s/g, "")==""){

        this.color = "danger";
            this.isDisabled = false;
            this.dialogs.alert("Escreva um Nome válida!","Erro ao gravar O Nome da Unidade Sanitaria");

            return;

      }
      for(let config of this.configuracoes){
        if(config.url == this.localUser.url){
          this.color = "danger";
          this.isDisabled = false;
          this.dialogs.alert("Ja Foi Adicionada uma Unidade Sanitaria Neste Servidor" + this.localUser.url,"Erro ao gravar A Unidade Sanitaria");

          return;

        }
     }

      if(this.isAddHealthFacility){
        this.spinnerDialog.show(null,"Adicionando uma Unidade...",true);
      }else{
        this.spinnerDialog.show(null,"Gravando a URL...",true);
      }

    setTimeout(async () =>

    {

       if(this.localUser.pin.toUpperCase().replace(/\s/g, "")==this.activation.value){

          this.locked=false;
          this.spinnerDialog.hide();
          this.indexuser.key="YES";
          this.indexuser.url=this.localUser.url;
          this.indexuser.healthfacility=this.localUser.healthfacility;
          this.localUser.url="http://";
          this.localUser.username='';

//Terms and conditions
if(!this.locked&&!this.accepted){

  var confirm=await this.dialogs.confirm('O utilizador deste aplicativo se compromete a fazer uso adequado dos conteúdos e das informações que o aplicativo oferece respeitando as políticas de sigilo e confidencialidade em vigor na organização;\n\na) O utilizador não deve se envolver em actividades que sejam ilegais ou contrárias à boa fé do compromisso sigilo e confidencialidade durante a utilização do aplicativo;\n\nb) O utilizador não deve difundir o conteúdo do aplicativo (ex.: Informação mostrada sobre os pacientes nos relatórios, credenciais de acesso).', 'Política de Privacidade e Termos de Uso', ['Concordo', 'Não concordo']);

if (confirm==1){

this.indexuser.accepted="YES";

this.configuracoes.push(this.indexuser);
this.storage.set('selectedConfiguration', this.indexuser)
this.storage.set('configuracoes', this.configuracoes)

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

  handleChange(ev){

    this.indexuser = ev.target.value;
    this.localUser.url = this.indexuser.url;
    this.localUser.username=this.indexuser.username;
    console.log('Index');
    console.log(this.indexuser);
    window.localStorage.setItem('url',this.localUser.url.replace(/\s/g, ""));

    if(this.indexuser.accepted==='YES'){
      this.accepted = true;
    }else{
      this.accepted = false;
    }

    if(this.indexuser.autoSync==='Sim'){
      this.autoSync = true;
    }else{
      this.autoSync = false;
    }

    if(this.indexuser.storelocalUser==='Sim'){
      this.storelocalUser = true;
    }else{
      this.storelocalUser = false;
    }

    this.storage.set('selectedConfiguration', this.indexuser);
  }

  noAcess(){
    this.loginAccess = "";
          this.loginFail = "hide";
          this.isDisabled = false;

          this.spinnerDialog.hide();
          this.color = "danger";

          this.dialogs.alert("Credencias invalidas ou Acesso restrito!","Erro ao entrar");

  }

  login() {

    this.http.get(
      this.localUser.url+'/ws/rest/v1/session',             //URL
      {},         //Data
      { 'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(this.localUser.username+":"+this.localUser.password) } // Headers
     )
     .then(response => {

      this.user = JSON.parse(response.data);

      this.indexuser.user = this.user;
      this.indexuser.localUser = this.localUser;
      this.indexuser.autoSync='Sim';
      this.indexuser.lastLoggedUsername=this.localUser.username;
      this.indexuser.username=this.localUser.username;
      this.indexuser.storelocalUser='Sim';
      this.indexuser.username=this.localUser.username;

      this.storage.set('selectedConfiguration', this.indexuser);
      this.storage.set('configuracoes', this.configuracoes);
      if (this.user) {
        if (this.user.authenticated === true) {

           //Definicao do view Level baseado na role
      this.user.user.roles.forEach(element => {
      if (element.uuid === this.receptionistaUUID){
        window.localStorage.setItem('roleViewLevel',"one" );
        this.roleViewLevel = "one"
      } else
      if (element.uuid == this.conselheiroUUID){
        window.localStorage.setItem('roleViewLevel',"two" );
        this.roleViewLevel = "two"
      } else
      if (element.uuid === this.tecFarmaciaUUID){
        window.localStorage.setItem('roleViewLevel',"three" );
        this.roleViewLevel = "three"
      } else
      if (element.uuid === this.tecLabUUID){
        window.localStorage.setItem('roleViewLevel',"four" );
        this.roleViewLevel = "four"
      } else
      if (element.uuid === this.provedorSaudeUUID){
        window.localStorage.setItem('roleViewLevel',"five" );
        this.roleViewLevel = "five"
      }
    });
      if (this.roleViewLevel !== null){
        console.log(this.roleViewLevel)
        window.localStorage.setItem('user',JSON.stringify(this.user) );

          this.appService.callMethodOfSecondComponent();

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

        this.spinnerDialog.hide();
        this.color = "danger";

        this.dialogs.alert("Não foi possivel iniciar a secção. Verifique o estado da sua ligação com o servidor!","Erro ao entrar");

      }


     })
     .catch(response => {

      this.spinnerDialog.hide();
      this.color = "danger";
      this.dialogs.alert(response,"Erro ao entrar");
      this.dialogs.alert("Não foi possivel iniciar a secção. Verifique o estado da sua ligação com o servidor!","Erro ao entrar");
      this.isDisabled = false;


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
