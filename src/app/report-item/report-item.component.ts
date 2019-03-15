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
    console.log([this.id, text]);
  }

}
