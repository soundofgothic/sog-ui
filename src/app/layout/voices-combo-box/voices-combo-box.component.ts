import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Voice, VoicesResponse } from 'src/app/services/domain';
import { VoiceService } from 'src/app/services/voice.service';


type VoiceSelection = Voice & {selected: boolean};
type Selections = Array<Number>;

@Component({
  selector: 'app-voices-combo-box',
  templateUrl: './voices-combo-box.component.html',
  styleUrls: ['./voices-combo-box.component.css']
})
export class VoicesComboBoxComponent implements OnInit {

  @Input('selections') selections;
  @Output() onSelectAction = new EventEmitter<Selections>();
  protected voices: Array<VoiceSelection> = [];

  constructor(
    private voicesService: VoiceService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.voicesService.Load();
    type voicesTuple = [any, VoicesResponse];
    combineLatest([this.route.queryParamMap, this.voicesService.observedVoices]).subscribe(([_1, voices]: voicesTuple) => {
      const params = _1 as ParamMap;
      let paramVoices = params.getAll('voices').map(v => parseInt(v));
      this.voices = voices.map(voice => { return { ...voice, selected: paramVoices.includes(voice.id) } })
    });
  }

  onSelect(item: VoiceSelection, event: any) {
    item.selected = event.target.checked;
    const selected = this.voices.filter(voice => voice.selected).map(voice => voice.id);
    this.onSelectAction.emit(selected);
  }
}
