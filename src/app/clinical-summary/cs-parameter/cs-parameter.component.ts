import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Console } from 'console';

@Component({
  selector: 'cs-paramerter',
  templateUrl: 'cs-parameter.component.html',
  styleUrls: ['cs-parameter.component.scss']
})
export class CsParameterComponent {

  public search; index: number; count: number = 0; moreData;
  public form: FormGroup;
  public loading; color; user; patients: any; patient; newPatients: any;

  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private spinnerDialog: SpinnerDialog,
    private dialogs: Dialogs,
    private http: HTTP,
    private router: Router) {

      this.form = formBuilder.group({
        search: []

      });

  }

  ngOnInit() {
    this.color = "primary";
    this.user = JSON.parse(window.localStorage.getItem('user'));

    this.storage.get('search-criteria').then((data) => {
      if (data != null && data != "") {
        this.search = data;
      }
    });

  }

  async confirmReport(patient) {

    let gender = patient.person.gender;
    if (gender == 'F') {
      gender = 'a'
    }
    else {
      gender = 'o';
    }

    /**/
    var confirm = await this.dialogs.confirm('Deseja carregar o sumário clínico d' + gender + ' paciente ' + patient.display + '?', 'Confirmação', ['Sim', 'Não']);

    if (confirm == 1) {

      window.localStorage.removeItem('patient');
      window.localStorage.removeItem('search');
      window.localStorage.setItem('search', 'Yes');
      window.localStorage.setItem('patient', JSON.stringify(patient));
      this.router.navigateByUrl("/csreport");
    }

  }

  getNextPatients(refresher) {
    this.newPatients = [];
    this.index = this.index + 50;

    var newURL= encodeURI(window.localStorage.getItem('url') + "/ws/rest/v1/patient?q=" + this.search + "&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))&limit=50&startIndex=" + this.index);

    this.http.get(
      newURL,             //URL
      {},         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
      } // Headers
    )
      .then(response => {

        this.newPatients = JSON.parse(response.data);
        this.newPatients = this.newPatients.results;
        this.count = this.newPatients.length;
        this.patients = this.patients.concat(this.newPatients);
        refresher.target.complete();
        this.spinnerDialog.hide();
        this.color = "primary";
        if (this.count == 50) {
          this.moreData = true;
        } else {
          this.moreData = false;
          refresher.target.disabled = true;
        }

        if (this.count < 1) {
          this.dialogs.alert("Nenhum paciente foi encontrado de acordo com o criterio de busca!", "Informação");
        }

      })
      .catch(response => {
        refresher.target.complete();
        this.spinnerDialog.hide();
        this.dialogs.alert("Não foi possivel carregar. Verifique o estado da sua ligação com o servidor e se tem uma sessão valida!", "Erro ao pesquisar");
        this.color = "danger";
      });

  }

  searchPatients() {
    this.index = 0;
    this.moreData = false;
    this.color = "primary";
    if (this.search == null || this.search == "" || this.search.length <= 2) {
      this.color = "danger";

      this.dialogs.alert("Por favor preencha o campo de pesquisa com pelo menos 3 caracteres!", "Informação");

    } else {

      this.spinnerDialog.show(null, "Carregando...", true);

      if ((this.search.match(/\//g) || []).length==2&&this.search.replace(/\s/g, "").length>12) {

        var newURL= encodeURI(window.localStorage.getItem('url') + "/ws/rest/v1/patient?identifier=" + this.search.replace(/\s/g, "") + "&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))");

        this.storage.set('search-criteria', this.search);
        this.http.get(
          newURL,             //URL
          {},         //Data
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
          } // Headers
        )
          .then(response => {

            this.patients = JSON.parse(response.data);

            this.patients = this.patients.results;
            this.count = this.patients.length;
            this.spinnerDialog.hide();
            this.color = "primary";
            if (this.count < 1) {
              this.dialogs.alert("Nenhum paciente foi encontrado de acordo com o criterio de busca!", "Informação");
              this.spinnerDialog.hide();
            }
          })
          .catch(response => {

            this.spinnerDialog.hide();
            this.dialogs.alert("Não foi possivel carregar. Verifique o estado da sua ligação com o servidor e se tem uma sessão valida!", "Erro ao pesquisar");
            this.color = "danger";
          });
      } else {
        this.patients = [];
        this.storage.remove('search-criteria');

        var newURL= encodeURI(window.localStorage.getItem('url') + "/ws/rest/v1/patient?q=" + this.search + "&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))&limit=50&startIndex=" + this.index);

        this.http.get(
          newURL,             //URL
          {},         //Data
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
          } // Headers
        )
          .then(response => {

            this.patients = JSON.parse(response.data);
            this.patients = this.patients.results;
            this.count = this.patients.length;
            this.spinnerDialog.hide();

            this.color = "primary";
            if (this.count == 50) {
              this.moreData = true;
            } else {
              this.moreData = false;
            }

            if (this.count < 1) {

              this.dialogs.alert("Nenhum paciente foi encontrado de acordo com o criterio de busca!", "Informação");
              this.spinnerDialog.hide();


            }


          })
          .catch(response => {
console.log(response)
            this.spinnerDialog.hide();
            this.dialogs.alert("Não foi possivel carregar. Verifique o estado da sua ligação com o servidor e se tem uma sessão valida!", "Erro ao pesquisar");
            this.color = "danger";
          });
      }
    }
  }



}
