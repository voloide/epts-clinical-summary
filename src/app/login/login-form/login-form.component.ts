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
  public locked: boolean=true;
  public accepted: boolean=false;

  public color;usern;passw;url;

  localUser = { url:'',username: '', password: '',pin:'' };

  public activationList=myGlobals.activationList;
  public activation;errorMessage;

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
 storelocalUser: []

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


  async  ngOnInit() {
    this.locked=true;
    this.accepted=false;
    this.menu.enable(false, 'first');
    
    await this.storage.create();

    this.localUser.url="https://fghomrsmpt.fgh.org.mz/openmrs";

    this.storage.get('key').then((data) => {
      if(data=="YES"){
        this.locked=false;
      }
          });

  this.storage.get('accepted').then((data) => {
    if(data=="YES"){
      this.accepted=true;
    }
        });

   if(this.locked){
    this.activation = this.activationList[Math.floor(Math.random() * this.activationList.length)];
   }
       
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
    
        }
    
      },
      error => console.error(error)
    );

    this.color = "";
    this.isDisabled = false;
    
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

    if(this.localUser.url==null||this.localUser.url.replace(/\s/g, "")==""||(!this.localUser.url.includes("http://")&&!this.localUser.url.includes("https://"))){

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

  login() {

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

        window.localStorage.setItem('user',JSON.stringify(this.user) );
         
          this.appService.callMethodOfSecondComponent();

          if (this.storelocalUser) {

            this.storage.set('storelocalUser', 'Sim');
            this.storage.set('url',this.localUser.url );
            this.storage.set('username',this.localUser.username );
          
          } else {
          this.storage.remove('username');
            }

          this.spinnerDialog.hide();
          this.navCtrl.navigateRoot('/home');

        } else {

          this.loginAccess = "";
          this.loginFail = "hide";
          this.isDisabled = false;

          this.spinnerDialog.hide();
          this.color = "danger";

          this.dialogs.alert("Credencias invalidas ou Acesso restrito!","Erro ao entrar");

          if (this.storelocalUser) {

            this.storage.set('storelocalUser', 'Sim');
            this.storage.set('url',this.localUser.url );
            this.storage.set('username',this.localUser.username )
            } else {
          this.storage.remove('username');
            }

        }
      } else {
        this.loginAccess = "hide";
        this.loginFail = "";
        this.isDisabled = false;

        if (this.storelocalUser) {

          this.storage.set('storelocalUser', 'Sim');
          this.storage.set('url',this.localUser.url );
          this.storage.set('username',this.localUser.username )
               
        } else {
           this.storage.remove('username');
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

      if (this.storelocalUser) {

        this.storage.set('storelocalUser', 'Sim');
        this.storage.set('url',this.localUser.url );
        this.storage.set('username',this.localUser.username )
        //this.storage.set('password',this.localUser.password )
        
      } else {
        this.storage.remove('username');
        }


     });


}
}