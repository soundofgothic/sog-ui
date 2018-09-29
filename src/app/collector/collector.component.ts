import { Component, OnInit } from '@angular/core';
import { CollectorService } from '../collector.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  styleUrls: ['./collector.component.css']
})
export class CollectorComponent implements OnInit {
  constructor(private service: CollectorService,
              private route: ActivatedRoute) { }

  public records: any;
  public filesource: any;

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      console.log(params);
      this.filesource = params.params.source ? params.params.source : false;
      if (this.filesource) {
        this.service.getRecordsFromSource(this.filesource);
      } else {
        this.service.getFilteredRecords("");
      }
    });
    this.service.observedRecords.subscribe((data) => {
      this.records = data.records;
    });
  }

}
