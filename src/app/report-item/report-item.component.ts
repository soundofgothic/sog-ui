import {Component, Input, OnInit} from '@angular/core';
import {ItemComponent} from '../item/item.component';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.css']
})
export class ReportItemComponent extends ItemComponent implements OnInit {
  @Input() qty: any;
  @Input() details: any;

  modifyText(text) {
    if (text) {
      this.collectorService.modifyRecord(this.id, text).subscribe(() => {
      });
    }
  }

  cancelReports() {
    this.collectorService.cancelReports(this.id).subscribe((status) => {
      this.snackBar.open('Anuluowano zgłoszenie dla wpisu: ' + this.text, ':)', {duration: 3000});
    });
  }

  deleteRecord() {
    this.collectorService.deleteRecord(this.id).subscribe((status) => {
      this.snackBar.open('Usunięto wpis: ' + this.text, ':)', {duration: 3000});
    });
  }

}
