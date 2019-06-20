import {Component, OnInit} from '@angular/core';
import {CollectorService, SearchType} from '../collector.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sfx-panel',
  templateUrl: './sfx-panel.component.html',
  styleUrls: ['./sfx-panel.component.css']
})
export class SfxPanelComponent implements OnInit {

  public records: any[];

  constructor(private service: CollectorService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.service.observedRecords.next([]);
    this.route.queryParamMap.subscribe((params: any) => {

      let filter = params.params.filter;
      let pageSize = params.params.pageSize;
      let page = params.params.page;
      let tags = params.params.tags;

      console.log(tags);

      filter = filter ? filter : '';
      pageSize = pageSize ? pageSize : this.service.deviceDependsPageSize();
      page = page ? parseInt(page) : 0;
      let type = SearchType.SFX;

      this.service.getFilteredRecords(filter, page, type, pageSize, tags);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.records;
    });
  }

}
