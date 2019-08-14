import {Component, Input, OnInit} from '@angular/core';
import {TextItemComponent} from '../text-item/text-item.component';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-text-item.component.html',
  styleUrls: ['./report-text-item.component.css']
})
export class ReportTextItemComponent extends TextItemComponent implements OnInit {
  @Input() qty: any;
  @Input() details: any;

  modifyText(text) {
    if (text) {
      this.reportService.modifyRecord(this.id, text).subscribe(() => {
        this.snackBar.open('Zmodyfikowano wpis: ' + this.text, ':)', {duration: 3000});
      });
    }
  }

  modifyFilename(filename) {
    if(filename) {
      this.reportService.modifyFilename(this.id, filename).subscribe(() => {
        this.snackBar.open('Zmodyfikowano wpis: ' + this.text, ':)', {duration: 3000});
      });
    }
  }

  cancelReports() {
    this.reportService.cancelReports(this.id).subscribe((status) => {
      this.snackBar.open('Anuluowano zgłoszenie dla wpisu: ' + this.text, ':)', {duration: 3000});
    });
  }

  deleteRecord() {
    this.reportService.deleteRecord(this.id).subscribe((status) => {
      this.snackBar.open('Usunięto wpis: ' + this.text, ':)', {duration: 3000});
    });
  }

}
