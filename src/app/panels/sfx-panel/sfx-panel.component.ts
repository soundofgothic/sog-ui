import { Component, OnInit } from "@angular/core";
import {
  CollectorService,
  SearchConfig,
  SearchType,
} from "../../services/collector.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../access/user.service";
import { SfxService } from "../../services/sfx.service";
import { RecordingsResponse } from "src/app/services/domain";

@Component({
  selector: "app-sfx-panel",
  templateUrl: "./sfx-panel.component.html",
  styleUrls: ["./sfx-panel.component.css"],
})
export class SfxPanelComponent implements OnInit {
  public records: any[];
  protected sfxType: SearchType;
  public extendOption: boolean;

  constructor(
    protected service: CollectorService,
    protected route: ActivatedRoute,
    protected userService: UserService,
    protected sfxService: SfxService
  ) {
    this.sfxType = SearchType.SFX;
  }

  ngOnInit() {
    this.userService.logged().then((status) => (this.extendOption = status));
    this.service.observedRecords.next(<RecordingsResponse>{ results: [] });
    this.route.queryParamMap.subscribe((params: any) => {
      let filter = params.params.filter;
      let pageSize = params.params.pageSize;
      let page = params.params.page;
      let tags = params.params.tags;
      let versions = params.params.versions;

      let config: SearchConfig = {
        filter: filter ? filter : "",
        pageSize: pageSize ? pageSize : this.service.deviceDependsPageSize(),
        page: page ? parseInt(page) : 1,
        type: this.sfxType,
        tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
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

    this.sfxService.updateTagsList();
  }
}
