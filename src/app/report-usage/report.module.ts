/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { NgModule } from '@angular/core';
import { ReportUsageComponent } from './report.component';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';  
import { ReportUsageRoutingModule } from './report-routing.module';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    ReportUsageRoutingModule,
    FormsModule, ReactiveFormsModule,CommonModule
  ],
  declarations: [
    ReportUsageComponent
  ],
  exports: [
    ReportUsageComponent
  ],
  providers: [
File,
FileOpener,
DatePicker,
DatePipe
  ],
  entryComponents: [
    ReportUsageComponent
  ]
})
export class ReportUsageModule { }
