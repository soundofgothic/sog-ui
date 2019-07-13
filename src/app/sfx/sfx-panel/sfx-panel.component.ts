import {Component, OnInit} from '@angular/core';
import {CollectorService, SearchType} from '../../collector.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../access/user.service';

@Component({
  selector: 'app-sfx-panel',
  templateUrl: './sfx-panel.component.html',
  styleUrls: ['./sfx-panel.component.css']
})
export class SfxPanelComponent implements OnInit {

  public records: any[];
  protected sfxType: SearchType;
  public extendOption: boolean;

  constructor(protected service: CollectorService, protected route: ActivatedRoute, protected userService: UserService) {
    this.sfxType = SearchType.SFX;
  }

  ngOnInit() {
    this.userService.logged().then((status) => this.extendOption = status);
    this.service.observedRecords.next([]);
    this.route.queryParamMap.subscribe((params: any) => {

      let filter = params.params.filter;
      let pageSize = params.params.pageSize;
      let page = params.params.page;
      let tags = params.params.tags;
      tags = Array.isArray(tags) ? tags : tags ? [tags] : [];


      filter = filter ? filter : '';
      pageSize = pageSize ? pageSize : this.service.deviceDependsPageSize();
      page = page ? parseInt(page) : 0;
      let type = this.sfxType;

      this.service.getFilteredRecords(filter, page, type, pageSize, tags);
    });

    this.service.observedRecords.subscribe((data) => {
      this.records = data.records;
    });
  }

}
