import { Component, OnInit } from '@angular/core';
import { CollectorService } from '../collector.service';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  styleUrls: ['./collector.component.css']
})
export class CollectorComponent implements OnInit {

  constructor(private service: CollectorService) { }

  public records: any;

  ngOnInit() {
    this.service.observedRecords.subscribe((data)=>{
      this.records = data.records;
    });
  }

}
