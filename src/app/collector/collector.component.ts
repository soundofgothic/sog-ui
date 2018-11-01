import {Component, OnInit} from '@angular/core';
import {CollectorService, SearchType} from '../collector.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  styleUrls: ['./collector.component.css']
})
export class CollectorComponent implements OnInit {
  constructor(private service: CollectorService,
              private route: ActivatedRoute) {
  }

  public records: any;

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: any) => {
      let filter = params.params.filter;
      let pageSize = params.params.pageSize;
      let page = params.params.page;
      let type = params.params.type;

      filter = filter ? filter : '';
      page = page ? parseInt(page) : 0;
      type = type ? parseInt(type) : SearchType.TEXT;

      this.service.getFilteredRecords(filter, page, type, pageSize);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.records;
    });
  }

}
