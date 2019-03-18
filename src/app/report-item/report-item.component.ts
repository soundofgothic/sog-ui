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
      this.collectorService.modifyRecord(this.id, text).subscribe((status) => {
        console.log(status);
      });
    }
  }

  cancelReports() {
    this.collectorService.cancelReports(this.id).subscribe((status) => console.log(status));
  }

  deleteRecord() {
    this.collectorService.deleteRecord(this.id).subscribe((status) => console.log(status));
  }

}
