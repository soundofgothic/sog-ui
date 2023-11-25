import { Component, OnInit } from "@angular/core";
import {
  CollectorService,
  SearchType,
  SearchConfig,
} from "../../services/collector.service";
import { ActivatedRoute } from "@angular/router";
import { RecordingsResponse } from "../../services/domain";

@Component({
  selector: "app-reports-panel",
  templateUrl: "./reports-panel.component.html",
  styleUrls: ["./reports-panel.component.css"],
})
export class ReportsPanelComponent implements OnInit {
  constructor(
    private service: CollectorService,
    private route: ActivatedRoute
  ) {}

  public records: any;

  ngOnInit() {
    this.service.observedRecords.next(<RecordingsResponse>{ results: [] });
    this.route.queryParamMap.subscribe((params: any) => {
      let filter = params.params.filter;
      let pageSize = params.params.pageSize;
      let page = params.params.page;
      let versions = params.params.versions;

      let config: SearchConfig = {
        filter: filter ? filter : "",
        pageSize: pageSize ? pageSize : this.service.deviceDependsPageSize(),
        page: page ? parseInt(page) : 1,
        type: SearchType.REPORT,
        versions: Array.isArray(versions)
          ? versions
          : versions
          ? [versions]
          : [],
      };

      this.service.getFilteredRecords(config);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.results;
    });
  }
}
