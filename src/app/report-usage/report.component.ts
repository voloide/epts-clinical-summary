import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'page-report-usage',
  templateUrl: './report.component.html'
})
export class ReportUsageComponent {

  user: any;

  isDisabled: boolean;

  public color;

  //current cars
  public startDate; endDate;

  public ClinicalSummaries: any[] = [];

  constructor(
    private storage: Storage,
    //private sqlite: SQLite
    private spinnerDialog: SpinnerDialog,
    private dialogs: Dialogs,
    public datePicker: DatePicker,
    public datepipe: DatePipe,
    private file: File,
    private fileOpener: FileOpener
  ) {


  }


  ngOnInit() {
    this.color = "primary";
    this.isDisabled = false;
    this.user = JSON.parse(window.localStorage.getItem('user'));
  }

  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      allowFutureDates: false,

    }).then(
      date => {
        let dia, diaF, mes, mesF, anoF;
        let data = new Date(date);
        dia = data.getDate().toString();
        diaF = (dia.length == 1) ? '0' + dia : dia;
        mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes;
        anoF = data.getFullYear();

        this.startDate = anoF + "-" + mesF + "-" + diaF;

      },
      err => console.log('Error occurred while getting date: ', err)
    );

  }

  showDatePicker2() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      allowFutureDates: false,
    }).then(
      date => {

        let dia, diaF, mes, mesF, anoF;
        let data = new Date(date);
        dia = data.getDate().toString();
        diaF = (dia.length == 1) ? '0' + dia : dia;
        mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes;
        anoF = data.getFullYear();

        this.endDate = anoF + "-" + mesF + "-" + diaF;

      },
      err => console.log('Error occurred while getting date: ', err)
    );

  }

  getReport() {
    this.color = "primary";
    this.isDisabled = true;
    this.spinnerDialog.show(null, "Carregando...", true);
    this.storage.get('epts-clinical-summaries').then((data) => {
      if (data) {
        this.ClinicalSummaries = data;
      }
    });
    setTimeout(() => {

      var endDat = new Date(this.endDate);
      endDat.setHours(23);
      endDat.setMinutes(59);
      endDat.setSeconds(59);

      var startDat = new Date(this.startDate);
      startDat.setHours(0);
      startDat.setMinutes(0);

      this.ClinicalSummaries = this.ClinicalSummaries.filter(item => new Date(item.dateOpened) >= startDat && new Date(item.dateOpened) <= endDat);

      if (this.ClinicalSummaries.length > 0) {

        this.spinnerDialog.hide();
        this.isDisabled = false;


      } else {
        this.spinnerDialog.hide();
        this.dialogs.alert("Nenhum dado encontrado, verifica os parâmetros de busca!", "Informação");
        this.color = "danger";
        this.isDisabled = false;

      }


    }, 3000);

  }

  printClinicalSummaries() {
    this.color = "primary";
    var doc = new jsPDF('portrait');

    var totalPagesExp = "{total_pages_count_string}";
    var columns = [
      { title: "Relatório", dataKey: "report" },
      { title: "Paciente", dataKey: "patient_uuid" },
      { title: "Data de Abertura", dataKey: "dateOpened" },
      { title: "Utilizador OpenMRS", dataKey: "username" },

    ];
    var listSize = this.ClinicalSummaries.length;
    var datenow = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm');

    // HEADER
    doc.setFontSize(18);
    doc.text('© EPTS Sumário Clínico - Relatório de Uso do aplicativo', 25, 65);
    doc.setFontSize(14);
    doc.text(listSize + ' relatórios carregados de ' + this.datepipe.transform(this.startDate, 'dd-MM-yyyy') + ' até ' + this.datepipe.transform(this.endDate, 'dd-MM-yyyy'), 14, 75);
    doc.setFontSize(11);
    doc.setTextColor(100);

    var img = new Image()
    img.src = 'assets/imgs/app-logo.png'
    doc.addImage(img, "png", 95, 45, 10, 10);

    autoTable(doc, {
      columns: columns,
      body: this.ClinicalSummaries,
      startY: 85,
      styles: { overflow: 'linebreak' },
      bodyStyles: { valign: 'top' },
      columnStyles: {},
      theme: 'grid',
      headStyles: { fillColor: [51, 112, 51], lineWidth: 0 },
      didDrawPage: data => {

      },
      didParseCell: dataO => {

        if (dataO.column.dataKey === 'dateOpened' && !isNaN(new Date(dataO.cell.raw.toString()).getDate())) {

          let dia, diaF, mes, mesF, anoF, hora, horaF, minuto, minutoF;
          let data = new Date(dataO.cell.raw.toString());
          dia = data.getDate().toString();
          diaF = (dia.length == 1) ? '0' + dia : dia;
          mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
          mesF = (mes.length == 1) ? '0' + mes : mes;
          anoF = data.getFullYear();
          hora = data.getHours().toString();
          horaF = (hora.length == 1) ? '0' + hora : hora;
          minuto = data.getMinutes().toString();
          minutoF = (minuto.length == 1) ? '0' + minuto : minuto;
          dataO.cell.text[0] = diaF + "-" + mesF + "-" + anoF + " " + horaF + ":" + minutoF;

        }

      }


    });

    //Native Save
    let pdfOutput = doc.output();

    let buffer = new ArrayBuffer(pdfOutput.length);

    let array = new Uint8Array(buffer);

    for (var i = 0; i < pdfOutput.length; i++) {
      array[i] = pdfOutput.charCodeAt(i);
    }

    const directory = this.file.externalApplicationStorageDirectory;

    const fileName = 'EPTS Sumário Clínico - Relatório de Uso do aplicativo_' + this.user.user.person.display + "_" + this.datepipe.transform(new Date(), 'yyyy') + '.pdf';

    this.file.writeFile(directory, fileName, buffer, { replace: true })
      .then((success) => {

        this.fileOpener.open(directory + '/' + fileName, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => {

            this.dialogs.alert("Nenhum leitor de PDF instalado!", "Informação");
            this.color = "danger";
          });

      })
      .catch((error) => {


      })

      ;
  }


}