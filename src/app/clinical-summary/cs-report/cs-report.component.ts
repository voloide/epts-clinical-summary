import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { HTTP } from '@ionic-native/http/ngx';


@Component({
  selector: 'cs-report',
  templateUrl: 'cs-report.component.html'
})
export class CsReportComponent  {

  public color;user;patient;
  public searchParams;chart1;chart2;chart3;cabinet;door;timeOfDay;

//Vars
public allCD4Abs;allCD4Coverage;allHGB;allVLCopias;allAST;allALT;allAMI;allGLC;allCD4AbsFSR;allCD4CoverageFSR;allCD4AbsFLG;allCD4CoverageFLG;


//NewVars
public IPTStartFichaClinica;IPTEndFichaClinica;IPTStartFichaResumo;IPTEndFichaResumo;IPTStartFichaSeguimento;IPTEndFichaSeguimento;IPTEndFichaFILT;allVLCopiasV2;
public allGenexpert;allBaciloscopia;rastreioCacum;rastreioTBLAM;
public allVLCopiasFSR;allVLCopiasV2FSR;allVLCopiasFC;allVLCopiasV2FC;ARTPickupRegime;ARTPickupNextDate;ARTPickupMasterCard;
public allVLsV3;allVLsV2;allVLs;allIPTStart;allIPTStartProfilaxia;allIPTEnd;allIPTEndProfilaxia;
public allTBLAM;rastreioTBLAMLabGeral;rastreioTBLAMLabGeralPositividade;rastreioTBLAMELab;rastreioTBLAMELabPositividade;rastreioTBLAMFichaClinica;rastreioTBLAMFichaClinicaPositividade;
public ClinicalSummaries: any[]=[];

// Vars for profilaxia estado
public IPTStartFichaClinicaProfilaxia;IPTStartFichaResumoProfilaxia;IPTStartFichaSeguimentoProfilaxia;
public IPTEndFichaClinicaProfilaxia;IPTEndFichaResumoProfilaxia;IPTEndFichaSeguimentoProfilaxia;
//Data INicio Tarv
public ARTStartDate;


appVersion: any;

public roleViewLevel;

  constructor(
    private http: HTTP,
    public navCtrl: NavController,
    private spinnerDialog: SpinnerDialog,
    private dialogs: Dialogs,
    private storage: Storage) {

  }


  ngOnInit() {

    this.allCD4Abs=null;
    this.allCD4Coverage=null;
    this.allHGB=null;
    this.allVLCopias=null;
    this.allAST=null;
    this.allALT=null;
    this.allAMI=null;
    this.allGLC=null;
    this.ARTStartDate=null;

    this.roleViewLevel = window.localStorage.getItem('roleViewLevel')
    //new VArs
    this.IPTStartFichaClinica=null;this.IPTEndFichaClinica=null;this.IPTStartFichaResumo=null;this.IPTEndFichaResumo=null;this.IPTStartFichaSeguimento=null;this.IPTEndFichaSeguimento=null;this.IPTEndFichaFILT=null;
    this.allGenexpert=null;this.allBaciloscopia=null;
    this.allVLCopiasFSR=null;this.allVLCopiasV2FSR=null;this.allVLCopiasFC=null;this.allVLCopiasV2FC=null;
    this.ARTPickupRegime=null;this.ARTPickupNextDate=null;this.ARTPickupMasterCard=null;
    this.allVLs=null;this.allVLsV2=null;this.allIPTStart=null;this.allIPTStartProfilaxia=null;this.allIPTEnd=null;this.allIPTEndProfilaxia=null;
    this.allTBLAM=[];this.rastreioTBLAMLabGeral=null;this.rastreioTBLAMLabGeralPositividade=null;this.rastreioTBLAMELab=null;this.rastreioTBLAMELabPositividade=null;this.rastreioTBLAMFichaClinica=null;this.rastreioTBLAMFichaClinicaPositividade=null;


    // Vars for profilaxia estado
    this.IPTStartFichaClinicaProfilaxia=null;this.IPTStartFichaResumoProfilaxia=null;this.IPTStartFichaSeguimentoProfilaxia=null;
    this.IPTEndFichaClinicaProfilaxia=null;this.IPTEndFichaResumoProfilaxia=null;this.IPTEndFichaSeguimentoProfilaxia=null;
    //rastreioCacum
    this.rastreioCacum=null;
    
    //rastreioTBLAM
    this.rastreioTBLAM=null;

    this.chart1=false;
    this.chart2=true;

    this.color="primary";
    this.user = JSON.parse(window.localStorage.getItem('user'));
    this.patient = JSON.parse(window.localStorage.getItem('patient'));

    this.searchParams = JSON.parse(window.localStorage.getItem('payload'));

    if(window.localStorage.getItem('search')=="Yes"){
      this.callMyMethod();
    }


    this.appVersion = window.localStorage.getItem('appVersion');

  }

  async refreshSummary(){
    let gender=this.patient.person.gender;
    if(gender=='F'){
    gender='a'
    }
    else{
    gender='o';
    }
    var confirm=await this.dialogs.confirm('Deseja actualizar o sumário clínico d' + gender + ' paciente ' + this.patient.display + '?', 'Confirmação', ['Sim', 'Não']);

     if (confirm==1){

             this.callMyMethod();
            }

  }


  callMyMethod(){
    this.color="primary";
    this.allCD4Abs=null;
    this.allCD4Coverage=null;
    this.allHGB=null;
    this.allVLCopias=null;
    this.allAST=null;
    this.allALT=null;
    this.allAMI=null;
    this.allGLC=null;
    this.ARTStartDate=null;

    //new VArs
    this.IPTStartFichaClinica=null;this.IPTEndFichaClinica=null;this.IPTStartFichaResumo=null;this.IPTEndFichaResumo=null;this.IPTStartFichaSeguimento=null;this.IPTEndFichaSeguimento=null;this.IPTEndFichaFILT=null;
    this.allGenexpert=null;this.allBaciloscopia=null;
    this.allVLCopiasFSR=null;this.allVLCopiasV2FSR=null;this.allVLCopiasFC=null;this.allVLCopiasV2FC=null;
    this.ARTPickupRegime=null;this.ARTPickupNextDate=null;this.ARTPickupMasterCard=null;
    this.allVLs=null;this.allVLsV3=null;this.allVLsV2=null;this.allIPTStart=null;this.allIPTEnd=null;
    this.allTBLAM=[];this.rastreioTBLAMLabGeral=null;this.rastreioTBLAMLabGeralPositividade=null;this.rastreioTBLAMELab=null;this.rastreioTBLAMELabPositividade=null;this.rastreioTBLAMFichaClinica=null;this.rastreioTBLAMFichaClinicaPositividade=null;

    this.spinnerDialog.show(null,"Carregando...",true);

    this.storage.get('epts-clinical-summaries').then((data) => {
      if(data){
        this.ClinicalSummaries=data;
      }
          });

    //Start With Carga Viral e CD4

    this.http.get(
      window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1dd5ab4-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
      {},         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
      } // Headers
    )
      .then(response => {
        var data=JSON.parse(response.data);
        this.allCD4AbsFLG=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");
        this.allCD4AbsFSR=data.results.filter(item=>item.encounter.form.uuid=="5b7cecc3-4ba3-4710-85ae-fc0c13e83e27");
        this.allCD4Abs=this.allCD4AbsFLG.concat(this.allCD4AbsFSR);

        this.http.get(
          window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d48fba-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
          {},         //Data
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
          } // Headers
        )
          .then(response => {
            var data=JSON.parse(response.data);
            this.allCD4CoverageFLG=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");
            this.allCD4CoverageFSR=data.results.filter(item=>item.encounter.form.uuid=="5b7cecc3-4ba3-4710-85ae-fc0c13e83e27");
            this.allCD4Coverage=this.allCD4CoverageFLG.concat(this.allCD4CoverageFSR);

//Carga Viral Qualitativa
            this.http.get(
              window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1da2704-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,comment,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
              {},         //Data
              {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
              } // Headers
            )
              .then(response => {
                var data=JSON.parse(response.data);
                this.allVLCopiasV2=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");
                this.allVLCopiasV2FSR=data.results.filter(item=>item.encounter.form.uuid=="5b7cecc3-4ba3-4710-85ae-fc0c13e83e27");
                this.allVLCopiasV2FC=data.results.filter(item=>item.encounter.form.uuid=="3c2d563a-5d37-4735-a125-d3943a3de30a");


                //ARRAY CONCAT
                this.allVLsV2=this.allVLCopiasV2.concat(this.allVLCopiasV2FSR.concat(this.allVLCopiasV2FC));
    //Viral load quatitativa
                this.http.get(
                  window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d6247e-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,comment,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
                  {},         //Data
                  {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
                  } // Headers
                )
                  .then(response => {
                    var data=JSON.parse(response.data);
                    this.allVLCopias=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");
                    this.allVLCopiasFSR=data.results.filter(item=>item.encounter.form.uuid=="5b7cecc3-4ba3-4710-85ae-fc0c13e83e27");
                    this.allVLCopiasFC=data.results.filter(item=>item.encounter.form.uuid=="3c2d563a-5d37-4735-a125-d3943a3de30a");

               //ARRAY CONCAT
              // console.log(this.allVLsV2)


                    //Harmonizacao de Nomes CV
                    this.allVLsV2.forEach((element,i) => {
                      // console.log(typeof element.value)
                      if (typeof element.value == "object"){
                       if (element.value.name.uuid == "0afbb0c7-d58d-4737-8fb1-5f32761b97df"){
                        element.value.display = "<"
                        // console.log("entrou")
                      } else
                      if (element.value.name.uuid == "e24d576a-1d5f-11e0-b929-000c29ad1d07"){
                        element.value.display = "NIVEL DE DETECCAO BAIXO"
                        // console.log("entrou2")
                      } else
                      if (element.value.name.uuid == "65292e1c-87ec-4159-b051-25a9ef84d541"){
                        element.value.display = "INDETECTAVEL"
                      }
                    }
                    });


                    this.allVLsV3=this.allVLCopias.concat(this.allVLCopiasFSR.concat(this.allVLCopiasFC));
                    //console.log(this.allVLsV3)
                    this.allVLsV3.forEach(element => {
                this.allVLsV2.forEach((elementb,i) => {
                  if (element.obsDatetime == elementb.obsDatetime && element.encounter.form.uuid == elementb.encounter.form.uuid){
                    element.value = {
                      value:element.value,
                      display:element.value +" | "+elementb.value.display
                    }
                    this.allVLsV2.splice(i, 1);

                  }
                });
               });

               this.allVLs=this.allVLsV3.concat(this.allVLsV2);
                    //console.log(this.allVLs)

                    this.allVLs = this.allVLs.sort(function (a, b) {
                      var nameA = a.obsDatetime.toString().toUpperCase(); // ignore upper and lowercase
                      var nameB = b.obsDatetime.toString().toUpperCase(); // ignore upper and lowercase
                      if (nameA < nameB) {
                        return 1;
                      }
                      if (nameA > nameB) {
                        return -1;
                      }
                      return 0;
                    });

                     //ART Pickup
    this.http.get(
      window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d83e4e-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1",             //URL
      {},         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
      } // Headers
    )
      .then(response => {
        var data=JSON.parse(response.data);
        this.ARTPickupRegime=data.results.filter(item=>item.encounter.form.uuid=="49857ace-1a92-4980-8313-1067714df151");

        // CACUM Screeening
        this.http.get(
          window.localStorage.getItem('url') + "/ws/rest/v1/encounter?patient="+this.patient.uuid+"&encounterType=e2791f26-1d5f-11e0-b929-000c29ad1d07&v=custom:(uuid,encounterDatetime,auditInfo,form:(display),location:(display))&limit=1&order=desc",             //URL
          {},         //Data
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
          } // Headers
        )
          .then(response => {
            var data=JSON.parse(response.data);
            this.rastreioCacum=data.results;
            

        this.http.get(
          window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1e2efd8-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1",             //URL
          {},         //Data
          {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
          } // Headers
        )
          .then(response => {
            var data=JSON.parse(response.data);
            this.ARTPickupNextDate=data.results.filter(item=>item.encounter.form.uuid=="49857ace-1a92-4980-8313-1067714df151");

            //Laboratorio - outro
       this.http.get(
        window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1cdbe88-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
        {},         //Data
        {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
        } // Headers
      )
        .then(response => {
          var data=JSON.parse(response.data);
          this.allHGB=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");

          this.http.get(
            window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=b08eb89b-c609-4d15-ab81-53ad7c745332&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
            {},         //Data
            {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
            } // Headers
          )
            .then(response => {
              var data=JSON.parse(response.data);
              this.allGenexpert=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");

              this.http.get(
                window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d1564c-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
                {},         //Data
                {
                  'Content-Type': 'application/json',
                  Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
                } // Headers
              )
                .then(response => {
                  var data=JSON.parse(response.data);
                  this.allBaciloscopia=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");


                  this.http.get(
                    window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d43a74-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
                    {},         //Data
                    {
                      'Content-Type': 'application/json',
                      Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
                    } // Headers
                  )
                    .then(response => {
                      var data=JSON.parse(response.data);
                      this.allAST=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");

                      this.http.get(
                        window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d43c36-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
                        {},         //Data
                        {
                          'Content-Type': 'application/json',
                          Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
                        } // Headers
                      )
                        .then(response => {
                          var data=JSON.parse(response.data);
                           this.allALT=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");

                           this.http.get(
                            window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1da20e2-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
                            {},         //Data
                            {
                              'Content-Type': 'application/json',
                              Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
                            } // Headers
                          )
                            .then(response => {
                              var data=JSON.parse(response.data);
                              this.allAMI=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");


		this.http.get(
      window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d64968-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
      {},         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
      } // Headers
    )
      .then(response => {
        var data=JSON.parse(response.data);
        this.allGLC=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");


        	//TPT
		//Data de Inicio TPT

		this.http.get(
      window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=b6c4d473-2af5-4c4d-a9bb-ad3779fa5579&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
      {},         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
      } // Headers
    )
      .then(response => {
        var data=JSON.parse(response.data);

        // Datas de Inicio
         this.IPTStartFichaClinica=data.results.filter(item=>item.encounter.form.uuid=="3c2d563a-5d37-4735-a125-d3943a3de30a" && item.value.uuid=="e1d9ef28-1d5f-11e0-b929-000c29ad1d07");
         this.IPTStartFichaResumo=data.results.filter(item=>item.encounter.form.uuid=="05496c70-845c-40b1-9d28-070f67b3f7da"  && item.value.uuid=="e1d9ef28-1d5f-11e0-b929-000c29ad1d07");
         this.IPTStartFichaSeguimento=data.results.filter(item=>item.encounter.form.uuid=="78d47629-5ac4-4e16-8972-2166eef30bfd" && item.value.uuid=="e1d9ef28-1d5f-11e0-b929-000c29ad1d07");

        //  Datas de fim
        this.IPTEndFichaClinica=data.results.filter(item=>item.encounter.form.uuid=="3c2d563a-5d37-4735-a125-d3943a3de30a" && item.value.uuid=="e1d9facc-1d5f-11e0-b929-000c29ad1d07");
        this.IPTEndFichaResumo=data.results.filter(item=>item.encounter.form.uuid=="05496c70-845c-40b1-9d28-070f67b3f7da"  && item.value.uuid=="e1d9facc-1d5f-11e0-b929-000c29ad1d07");
        this.IPTEndFichaSeguimento=data.results.filter(item=>item.encounter.form.uuid=="78d47629-5ac4-4e16-8972-2166eef30bfd" && item.value.uuid=="e1d9facc-1d5f-11e0-b929-000c29ad1d07");


        //  TPT Profilaxia
     this.http.get(
      window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=9db4ce3b-4c1c-45dd-905f-c984a052f26e&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
      {},         //Data
      {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
      } // Headers
    )
      .then(response => {

        var data=JSON.parse(response.data);


        this.IPTStartFichaClinicaProfilaxia = data.results.filter(item=>item.encounter.form.uuid=="3c2d563a-5d37-4735-a125-d3943a3de30a");
          this.IPTStartFichaResumoProfilaxia = data.results.filter(item=>item.encounter.form.uuid=="05496c70-845c-40b1-9d28-070f67b3f7da");
        this.IPTStartFichaSeguimentoProfilaxia = data.results.filter(item=>item.encounter.form.uuid=="78d47629-5ac4-4e16-8972-2166eef30bfd");

        // console.log(this.IPTStartFichaResumo);
        // console.log(this.IPTStartFichaResumoProfilaxia);

        // this.IPTStartFichaResumo = this.IPTStartFichaResumo.forEach(function (itema) {
        //   this.IPTStartFichaResumoProfilaxia.forEach(function (itemb) {
        //     // if (itema.form.uuid == itemb.form.uuid){

        //       // console.log(itema);
        //     // }
        //   });
        // });







           this.allIPTStart=this.IPTStartFichaClinica.concat(this.IPTStartFichaResumo.concat(this.IPTStartFichaSeguimento));
           this.allIPTStartProfilaxia=this.IPTStartFichaClinicaProfilaxia.concat(this.IPTStartFichaResumoProfilaxia.concat(this.IPTStartFichaSeguimentoProfilaxia));
           this.allIPTEnd=this.IPTEndFichaClinica.concat(this.IPTEndFichaResumo.concat(this.IPTEndFichaSeguimento));

           console.log(this.allIPTStartProfilaxia);
           console.log(this.allIPTStart);

          this.allIPTStart.forEach(element => {
            this.allIPTStartProfilaxia.forEach(elementb => {
              if (element.encounter.form.uuid == elementb.encounter.form.uuid && element.encounter.uuid == elementb.encounter.uuid ){
              element.profilaxia = elementb.value.display
              }
            });

          });

          this.allIPTEnd.forEach(element => {
            this.allIPTStartProfilaxia.forEach(elementb => {
              if (element.encounter.form.uuid == elementb.encounter.form.uuid && element.encounter.uuid == elementb.encounter.uuid ){
                element.profilaxia = elementb.value.display
              }
            });

          });


           //console.log(this.allIPTStart);
          //  console.log(this.allIPTStartProfilaxia);


   this.allIPTStart = this.allIPTStart.sort(function (a, b) {
    var nameA = a.obsDatetime.toString().toUpperCase(); // ignore upper and lowercase
    var nameB = b.obsDatetime.toString().toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }
    return 0;
    });


  this.allIPTEnd = this.allIPTEnd.sort(function (a, b) {
    var nameA = a.obsDatetime.toString().toUpperCase(); // ignore upper and lowercase
    var nameB = b.obsDatetime.toString().toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }
    return 0;
  });

   
  //FILT

  this.http.get(
    window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=d5c15047-58f3-4eb2-9f98-af82e3531cb5&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1",             //URL
    {},         //Data
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
    } // Headers
  )
    .then(response => {
      var data=JSON.parse(response.data);
      this.IPTEndFichaFILT=data.results.filter(item=>item.encounter.form.uuid=="4ce83895-5c0e-4170-b0cc-d3974b54131f");

   // TB LAM
   this.http.get(
    window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=ef139cb2-97c1-4c0f-9189-5e0711a45b8f&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
    {},         //Data
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
    } // Headers
  )
    .then(response => {
      var data=JSON.parse(response.data);

      // TB LAM - Laboratorio Geral
      this.rastreioTBLAMLabGeral=data.results.filter(item=>item.encounter.form.uuid=="8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");
      this.rastreioTBLAMLabGeral.sort((item1, item2) => item1.encounter.encounterId - item2.encounter.encounterId);

      // TB LAM - Form e-Lab
      this.rastreioTBLAMELab=data.results.filter(item=>item.encounter.form.uuid=="5b7cecc3-4ba3-4710-85ae-fc0c13e83e27");
      this.rastreioTBLAMELab.sort((item1, item2) => item1.encounter.encounterId - item2.encounter.encounterId);

      // TB LAM - Ficha Clinica
      this.rastreioTBLAMFichaClinica=data.results.filter(item=>item.encounter.form.uuid=="3c2d563a-5d37-4735-a125-d3943a3de30a");
      this.rastreioTBLAMFichaClinica.sort((item1, item2) => item1.encounter.encounterId - item2.encounter.encounterId);

      //this.allTBLAM=this.rastreioTBLAMLabGeral.concat(this.rastreioTBLAMELab.concat(this.rastreioTBLAMFichaClinica));

        // TB LAM - NIVEL DE POSITIVIDADE
  this.http.get(
    window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=303a4480-f2b3-4192-a446-725a401ebb09&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12",             //URL
    {},         //Data
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
    } // Headers
  )
    .then(response => {
      var data=JSON.parse(response.data);

      let arrayTBLAM = [];

      // TB LAM - Laboratorio Geral - Nivel de Positividade
      let tbLAMLabGeralEncountersUuids = this.rastreioTBLAMLabGeral.map(item => item.encounter.uuid);
      this.rastreioTBLAMLabGeralPositividade=data.results.filter(item=>tbLAMLabGeralEncountersUuids.includes(item.encounter.uuid));
      for (let index = 0; index < this.rastreioTBLAMLabGeral.length; index++) {
        let element = this.rastreioTBLAMLabGeral[index];
        let npValue = this.rastreioTBLAMLabGeralPositividade.filter(item => item.encounter.uuid == element.encounter.uuid);
        
        if(npValue!=null && npValue != undefined && npValue.length > 0) {
          element.value.comment=npValue[0].value.display;
        }
        if (element != null) {
          arrayTBLAM.push(element);
        }
      }

      // TB LAM - Form e-Lab - Nivel de Positividade
      let tbLAMeLabEncountersUuids = this.rastreioTBLAMELab.map(item => item.encounter.uuid);
      this.rastreioTBLAMELabPositividade=data.results.filter(item=>tbLAMeLabEncountersUuids.includes(item.encounter.uuid));
      for (let index = 0; index < this.rastreioTBLAMELab.length; index++) {
        const element = this.rastreioTBLAMELab[index];
        if (element != null) { this.allTBLAM.push(element);}
        let npValue = this.rastreioTBLAMELabPositividade.filter(item => item.encounter.uuid == element.encounter.uuid);
        if(npValue!=null && npValue != undefined  && npValue.length > 0) {
          element.value.comment=npValue[0].value.display;
        }
        if (element != null) { arrayTBLAM.push(element); }
      }

      // TB LAM - Ficha Clinica - Nivel de Positividade
      let tbLAMFichaClinicaEncountersUuids = this.rastreioTBLAMFichaClinica.map(item => item.encounter.uuid);
      this.rastreioTBLAMFichaClinicaPositividade=data.results.filter(item=>tbLAMFichaClinicaEncountersUuids.includes(item.encounter.uuid));
      for (let index = 0; index < this.rastreioTBLAMFichaClinica.length; index++) {
        const element = this.rastreioTBLAMFichaClinica[index];
        if (element != null) { this.allTBLAM.push(element); }
        let npValue = this.rastreioTBLAMFichaClinicaPositividade.filter(item => item.encounter.uuid == element.encounter.uuid);
        if(npValue!=null  && npValue != undefined  && npValue.length > 0) {
          element.value.comment=npValue[0].value.display;
        }
        if (element != null) { arrayTBLAM.push(element);} 
      }

      this.allTBLAM=arrayTBLAM;
    

   //ART START Date

this.http.get(
  window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+this.patient.uuid+"&concept=e1d8f690-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1",             //URL
  {},         //Data
  {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + btoa(window.localStorage.getItem('username') + ":" + window.localStorage.getItem('password'))
  } // Headers
)
  .then(response => {

    var data=JSON.parse(response.data);
    this.ARTStartDate=data.results;
     var clinicalSummary:any={
        report:"Sumário Clínico",
        patient_uuid: this.patient.uuid,
        dateOpened: new Date(),
        username: this.user.user.username,
        us: this.patient.identifiers[0].location.name,
        status:"not_uploaded",
        terms:"ASSINADO",
        applicationVersion: this.appVersion
      };
      

      /*if(this.ClinicalSummaries.filter(item=>item.username.toUpperCase()===this.user.user.username.toUpperCase()).length<1){
        clinicalSummary.terms="ASSINADO";
      }else{
        clinicalSummary.terms="";
      }*/

      if(!this.ClinicalSummaries){
        this.ClinicalSummaries=clinicalSummary;
      }else{

        this.ClinicalSummaries=this.ClinicalSummaries.filter(item => new Date(item.dateOpened)>=new Date(new Date().setMonth(new Date().getMonth()-4)));
        this.ClinicalSummaries.push(clinicalSummary);
      }

      this.storage.set("epts-clinical-summaries",this.ClinicalSummaries);

      this.spinnerDialog.hide();

    })
    .catch(response => {

console.log(response);
      this.networkFailure();

    });   

 }).catch(response => {
console.log(response);
    this.networkFailure();

  });

})
.catch(response => {
console.log(response);
this.networkFailure();

});


      })
      .catch(response => {

        this.networkFailure();

      });


      })
      .catch(response => {
        this.networkFailure();
      });

    })
    .catch(response => {
      this.networkFailure();
    });



      })
      .catch(response => {
        this.networkFailure();
      });

             })
                            .catch(response => {
                              this.networkFailure();
                            });

                        })
                        .catch(response => {
                          this.networkFailure();
                        });


                    })
                    .catch(response => {
                      this.networkFailure();
                    });

                })
                .catch(response => {
                  this.networkFailure();
                });


            })
            .catch(response => {
              this.networkFailure();
            });


        })
        .catch(response => {
          this.networkFailure();
        });


    })
        .catch(response => {
          this.networkFailure();
        });


          })
          .catch(response => {
            this.networkFailure();
          });


      })
      .catch(response => {
        this.networkFailure();
      });


                  })
                  .catch(response => {
                    this.networkFailure();
                  });


              })
              .catch(response => {
                this.networkFailure();
              });


          })
          .catch(response => {
            this.networkFailure();
          });





      })
      .catch(response => {
        this.networkFailure();
      });


  }

  networkFailure(){
    this.spinnerDialog.hide();
    this.color="danger";
    this.dialogs.alert("Não foi possivel carregar todos dados. Verifique o estado da sua ligação com o servidor e se tem uma sessão valida!","Erro ao carregar");

  }

}


