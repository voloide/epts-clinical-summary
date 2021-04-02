/**
 * @author damasceno.lopes
 * @email damascenolopess@gmail.com
*/
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CsParameterModule } from './cs-parameter/cs-parameter.module';
import { CsReportModule } from './cs-report/cs-report.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { HTTP } from '@ionic-native/http/ngx';


@NgModule({
  imports: [
    IonicModule,
    CsParameterModule,
    CsReportModule,
    FormsModule, ReactiveFormsModule,CommonModule

  ],
  declarations: [
    

  ],
  exports: [
    

  ],
  providers: [
    SpinnerDialog,Dialogs,HTTP
  ],
  entryComponents: [
   
  ],
  schemas: []
})
export class ClinicalSummaryModule { }