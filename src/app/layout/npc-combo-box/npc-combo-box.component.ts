import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CollectorService } from 'src/app/services/collector.service';
import { NPC, VoicesResponse } from 'src/app/services/domain';
import { NPCService } from 'src/app/services/npc.service';
import { VoiceService } from 'src/app/services/voice.service';


type NPCSelection = NPC & {selected: boolean};
type Selections = Array<Number>;

@Component({
  selector: 'app-npc-combo-box',
  templateUrl: './npc-combo-box.component.html',
  styleUrls: ['./npc-combo-box.component.css']
})
export class NpcComboBoxComponent implements OnInit {
  @Output() onSelectAction = new EventEmitter<Selections>();
  protected npcs: Array<NPCSelection> = [];

  constructor(
    private npcsService: NPCService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      let paramVoices = params.getAll('voices').map(v => parseInt(v));
      this.npcsService.getFilteredNPCs({ voices: paramVoices });
    });

    this.npcsService.observedNPCs.subscribe((npcs: NPC[]) => {
      this.npcs = npcs.map(npc => { return { ...npc, selected: false } })
    });

    type npcTuple = [any, NPC[]];
    combineLatest([this.route.queryParamMap, this.npcsService.observedNPCs]).subscribe(([_1, voices]: npcTuple) => {
      const params = _1 as ParamMap;
      let paramVoices = params.getAll('npcs').map(v => parseInt(v));
      this.npcs = voices.map(voice => { return { ...voice, selected: paramVoices.includes(voice.id) } })
    });
  }

  onSelect(item: NPCSelection, event: any) {
    item.selected = event.target.checked;
    const selected = this.npcs.filter(npc => npc.selected).map(npc => npc.id);
    this.onSelectAction.emit(selected);
  }
}
