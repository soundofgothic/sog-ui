import { Component, OnInit } from "@angular/core";
import { Guild, NPC, SourceFile, Voice } from "@app/services/domain";
import { GuildService } from "@app/services/guild.service";
import { NPCService } from "@app/services/npc.service";
import { ScriptsService } from "@app/services/scripts.service";
import { URLParamsService } from "@app/services/urlparams.service";
import { VoiceService } from "@app/services/voice.service";
import { Subscription, combineLatest } from "rxjs";

@Component({
  selector: "app-filter-descriptor",
  templateUrl: "./filter-descriptor.component.html",
  styleUrls: ["./filter-descriptor.component.css"],
})
export class FilterDescriptorComponent implements OnInit {
  private subs: Subscription[] = [];

  public npcs: NPC[] = [];
  public guilds: Guild[] = [];
  public voices: Voice[] = [];
  public scripts: SourceFile[] = [];

  constructor(
    private urlParamsService: URLParamsService,
    private npcService: NPCService,
    private guildService: GuildService,
    private voiceService: VoiceService,
    private scriptService: ScriptsService
  ) {}

  ngOnInit() {
    const sub = combineLatest(
      this.urlParamsService.current,
      this.npcService.observedNPCs,
      this.guildService.observedGuilds,
      this.voiceService.observedVoices,
      this.scriptService.observedScripts
    ).subscribe(([params, npcs, guilds, voices, scripts]) => {
      this.npcs = npcs.filter(
        (npc) => params.npcs && params.npcs.includes(npc.id)
      );
      this.guilds = guilds.filter(
        (guild) => params.guilds && params.guilds.includes(guild.id)
      );
      this.voices = voices.filter(
        (voice) => params.voices && params.voices.includes(voice.id)
      );
      this.scripts = scripts.filter(
        (script) => params.scripts && params.scripts.includes(script.id)
      );
    });

    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  separateByComma(str: string, separate: boolean): string {
    if (!separate) {
      return str.trim();
    }
    return str.trim() + ", ";
  }

  show() {
    return (
      this.npcs.length > 0 ||
      this.guilds.length > 0 ||
      this.voices.length > 0 ||
      this.scripts.length > 0
    );
  }

  clearFilters() {}
}
