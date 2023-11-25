import { Component, Inject, Injector, OnInit, Optional } from "@angular/core";
import {
  CollectorService,
  SearchConfig,
  SearchType,
} from "../../services/collector.service";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { URLParams, URLParamsService } from "../../services/urlparams.service";

@Component({
  selector: "app-collector",
  templateUrl: "./texts-panel.component.html",
  styleUrls: ["./texts-panel.component.css"],
})
export class TextsPanelComponent implements OnInit {
  constructor(
    private service: CollectorService,
    private urlParams: URLParamsService,
  ) {}

  public records: any;

  ngOnInit() {
    this.urlParams.current.subscribe((params: URLParams) => {
      let config: SearchConfig = {
        filter: params.filter || "",
        pageSize: params.pageSize || this.service.deviceDependsPageSize(),
        page: params.page || 1,
        type: params.type || SearchType.TEXT,
        versions: params.versions || [],
        voices: params.voices || [],
        npcs: params.npcs || [],
        guilds: params.guilds || [],
        scripts: params.scripts || [],
      };

      this.service.getFilteredRecords(config);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.results;
    });
  }
}
