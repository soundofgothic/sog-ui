import {Component, Inject, Injector, OnInit, Optional} from '@angular/core';
import {CollectorService, SearchConfig, SearchType} from '../../services/collector.service';
import {ActivatedRoute, UrlSegment} from '@angular/router';

@Component({
  selector: 'app-collector',
  templateUrl: './texts-panel.component.html',
  styleUrls: ['./texts-panel.component.css']
})
export class TextsPanelComponent implements OnInit {
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
      let versions = params.params.versions;
      let voices = params.params.voices;

      let config: SearchConfig = {
        filter: filter ? filter : '',
        pageSize: pageSize ? pageSize : this.service.deviceDependsPageSize(),
        page: page ? parseInt(page) : 1,
        type: type ? parseInt(type) : SearchType.TEXT,
        versions: Array.isArray(versions) ? versions : versions ? [versions] : [],
        voices: Array.isArray(voices) ? voices : voices ? [voices] : []
      };

      this.service.getFilteredRecords(config);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.results;
    });
  }

}
