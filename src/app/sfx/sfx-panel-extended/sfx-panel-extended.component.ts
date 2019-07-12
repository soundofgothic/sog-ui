import {Component, OnInit} from '@angular/core';
import {SfxPanelComponent} from '../sfx-panel/sfx-panel.component';
import {CollectorService, SearchType} from '../../collector.service';
import {ActivatedRoute} from '@angular/router';
import {SfxService} from '../../sfx.service';

@Component({
  selector: 'app-sfx-panel-extended',
  templateUrl: './sfx-panel-extended.component.html',
  styleUrls: ['./sfx-panel-extended.component.css']
})
export class SfxPanelExtendedComponent extends SfxPanelComponent implements OnInit {

  constructor(service: CollectorService, route: ActivatedRoute, private sfxService: SfxService) {
    super(service, route);
    this.sfxType = SearchType.SFX_E;
  }

  ngOnInit() {
    super.ngOnInit();
    this.sfxService.updateTagsList();
  }

}
