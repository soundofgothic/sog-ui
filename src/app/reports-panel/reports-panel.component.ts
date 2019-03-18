import {Component, OnInit} from '@angular/core';
import {CollectorService, SearchType} from '../collector.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-reports-panel',
  templateUrl: './reports-panel.component.html',
  styleUrls: ['./reports-panel.component.css']
})
export class ReportsPanelComponent implements OnInit {

  constructor(private service: CollectorService,
              private route: ActivatedRoute) {
  }

  public records: any;

  ngOnInit() {
    this.service.observedRecords.next([]);
    this.route.queryParamMap.subscribe((params: any) => {

      let filter = params.params.filter;
      let pageSize = params.params.pageSize;
      let page = params.params.page;
      let type = params.params.type;

      filter = filter ? filter : '';
      pageSize = pageSize ? pageSize : this.service.deviceDependsPageSize();
      page = page ? parseInt(page) : 0;
      type = SearchType.REPORT;

      this.service.getFilteredRecords(filter, page, type, pageSize);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.records;
    });
  }

}
