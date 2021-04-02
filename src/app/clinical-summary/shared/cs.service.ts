
/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/

/*
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class CsService {
   
  constructor(public http: Http) {

  }

  findPatientsByName(name,index) {
    var headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
     return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/patient?q="+name+"&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead))&limit=50&startIndex="+index, { headers: headers })
      .map(res => res.json());
  }

  findPatientsByIdentifier(id) {
    var headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
     return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/patient?identifier="+id+"&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead))", { headers: headers })
      .map(res => res.json());
  }

  /**CARGA VIRAL,CD4 
 //CD4 Absoluto
 findCD4Abs(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1e68f26-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

//CD4 Percentual
findCD4Coverage(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d48fba-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

//CARGA VIRAL
findVLCopias(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d6247e-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

findVLCopiasV2(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1da2704-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

//ARV Pickup
findLastARTPickupRegime(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d83e4e-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1", { headers: headers })
    .map(res => res.json());
}

findLastARTPickupNextDate(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1e2efd8-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1", { headers: headers })
    .map(res => res.json());
}

findLastARTPickupMasterCard(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=74f6c17f-9819-41da-ba34-5910f67d24d0&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1", { headers: headers })
    .map(res => res.json());
}

//LABORATORIO - OUTROS
//GeneXpert
findGeneXpert(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=b08eb89b-c609-4d15-ab81-53ad7c745332&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

//Baciloscopia
findBaciloscopia(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d1564c-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

//HGB
findHGB(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1cdbe88-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}


findAST(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d43a74-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

findALT(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d43c36-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

findAMI(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1da20e2-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}

findGLC(patient){
  var headers: any = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
   return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=e1d64968-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
    .map(res => res.json());
}


  /*INH-TPI*/
  /**Ficha Clinica 
  findIPTProfilaxyFichaClinica(patient){
    var headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
     return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=be4a76ca-662a-4c39-903b-71983f5f67c9&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
      .map(res => res.json());
  }

  /**Ficha Resumo 
  findIPTProfilaxyStartFichaResumo(patient){
    var headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
     return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=6fa92ac9-0a96-4372-9e10-dd9683c19135&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
      .map(res => res.json());
  }

  findIPTProfilaxyEndFichaResumo(patient){
    var headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
     return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=9e555978-3a02-4da4-855e-7b1bfc807347&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12", { headers: headers })
      .map(res => res.json());
  }

  /**FILT 
  findIPTProfilaxyLastFichaFILT(patient){
    var headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(window.localStorage.getItem('username')+":"+window.localStorage.getItem('password')));
     return this.http.get(window.localStorage.getItem('url') + "/ws/rest/v1/obs?patient="+patient+"&concept=d5c15047-58f3-4eb2-9f98-af82e3531cb5&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=1", { headers: headers })
      .map(res => res.json());
  }
  
  

}

*/