import {Component, OnInit} from '@angular/core';
import {SfxPanelComponent} from '../sfx-panel/sfx-panel.component';
import {CollectorService, SearchType} from '../../collector.service';
import {ActivatedRoute} from '@angular/router';
import {SfxService} from '../../sfx.service';
import {UserService} from '../../access/user.service';

@Component({
  selector: 'app-sfx-panel-extended',
  templateUrl: './sfx-panel-extended.component.html',
  styleUrls: ['./sfx-panel-extended.component.css']
})
export class SfxPanelExtendedComponent extends SfxPanelComponent implements OnInit {

  constructor(service: CollectorService, route: ActivatedRoute, protected sfxService: SfxService, userService: UserService) {
    super(service, route, userService);
    this.sfxType = SearchType.SFX_E;
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
    this.sfxService.updateTagsList();
  }

}
