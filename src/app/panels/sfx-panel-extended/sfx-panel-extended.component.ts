import {Component, OnInit} from '@angular/core';
import {SfxPanelComponent} from '../sfx-panel/sfx-panel.component';
import {CollectorService, SearchType} from '../../services/collector.service';
import {ActivatedRoute} from '@angular/router';
import {SfxService} from '../../services/sfx.service';
import {UserService} from '../../access/user.service';

@Component({
  selector: 'app-sfx-panel-extended',
  templateUrl: './sfx-panel-extended.component.html',
  styleUrls: ['./sfx-panel-extended.component.css']
})
export class SfxPanelExtendedComponent extends SfxPanelComponent implements OnInit {

  constructor(service: CollectorService, route: ActivatedRoute, protected sfxService: SfxService, userService: UserService) {
    super(service, route, userService, sfxService);
    this.sfxType = SearchType.SFX_E;
  }
}
