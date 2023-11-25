import { WINDOW } from "@ng-toolkit/universal";
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  ParamMap,
  Router,
} from "@angular/router";
import { CollectorService, SearchType } from "../../services/collector.service";
import { UserService } from "../../access/user.service";
import { MatSnackBar } from "@angular/material";
import { SfxService } from "../../services/sfx.service";
import { combineLatest } from "rxjs";
import { VoiceService } from "../../services/voice.service";
import { Guild, NPC, NPCsResponse, SourceFile, Voice, VoicesResponse } from "../../services/domain";
import { NPCService } from "../../services/npc.service";
import { URLParams, URLParamsService } from "../../services/urlparams.service";
import { GuildService } from "../../services/guild.service";
import { ScriptsService } from "../../services/scripts.service";

@Component({
  selector: "app-basic-layout",
  templateUrl: "./basic-layout.component.html",
  styleUrls: ["./basic-layout.component.css"],
})
export class BasicLayoutComponent implements OnInit, AfterViewChecked {
  constructor(
    @Inject(WINDOW) private window: Window,
    private collectionService: CollectorService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private sfxService: SfxService,
    private voicesService: VoiceService,
    private guildService: GuildService,
    private npcsService: NPCService,
    private urlParams: URLParamsService,
    private scriptsService: ScriptsService,
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.display_navigation = !e.url.startsWith("/record");
      }
    });
  }

  public recordCount: number;
  public totalRecordCount: number;
  public pageSize: number;
  public upTo: number;
  public pageNumber: number;

  public backDisplay: boolean = false;
  public forwardDisplay: boolean = false;
  public value: string;
  public loading: boolean = false;
  public filter: string;
  public lastSearchType: SearchType;

  public pageSizeOptions: number[] = [10, 50, 100];
  public pageSizeSelected: number;

  public reportLink = false;

  public tags: any[];
  public tagsSelections: any[];

  public tagsSelectionModel: any = {};
  public displayTags: boolean;

  public sidenavToggled = false;
  public versionSelections = [];

  public display_navigation = false;
  public pageTypeList = true;

  public voiceFilters: (Voice & { selected: boolean, displayName: string })[];
  public npcFilters: (NPC & { selected: boolean, displayName: string })[];
  public guildFilters: (Guild & { selected: boolean, displayName: string })[];
  public scriptFilters: (SourceFile & { selected: boolean, displayName: string })[];

  ngOnInit() {
    this.userService.logged().then((status) => (this.reportLink = status));

    // -- voice filters
    type voiceTuple = [any, Voice[]];
    combineLatest([this.urlParams.current, this.voicesService.observedVoices]).subscribe(([_1, _2]: voiceTuple) => {
      const params = _1 as URLParams;
      const voices = _2 as Voice[];
      this.voiceFilters = voices.map(voice => { return { ...voice, selected: params.voices.includes(voice.id), displayName: `${voice.name} (${voice.count})` } })
    });
    // -- npc filters
    type npcTuple = [any, NPC[]];
    combineLatest([this.urlParams.current, this.npcsService.observedNPCs]).subscribe(([_1, _2]: npcTuple) => {
      const params = _1 as URLParams;
      const npcs = _2 as NPC[];
      this.npcFilters = npcs.map(npc => { return { ...npc, selected: params.npcs.includes(npc.id), displayName: `G${npc.gameID} ${npc.name} (${npc.count})` } })
    });
    // -- guild filters
    type guildTuple = [any, Guild[]];
    combineLatest([this.urlParams.current, this.guildService.observedGuilds]).subscribe(([_1, _2]: guildTuple) => {
      const params = _1 as URLParams;
      const guilds = _2 as Guild[];
      this.guildFilters = guilds.map(guild => { return { ...guild, selected: params.guilds.includes(guild.id), displayName: `G${guild.gameID} ${guild.name} (${guild.count})` } })
    });

    type scriptTuple = [any, SourceFile[]];
    combineLatest([this.urlParams.current, this.scriptsService.observedScripts]).subscribe(([_1, _2]: scriptTuple) => {
      const params = _1 as URLParams;
      const guilds = _2 as SourceFile[];
      this.scriptFilters = guilds.map(script => { return { ...script, selected: params.scripts.includes(script.id), displayName: `G${script.gameID} ${script.name} (${script.count})` } })
    });

    combineLatest(
      this.collectionService.observedMetadata,
      this.sfxService.tagsList
    ).subscribe(([data, tagList]) => {
      if (data) {
        this.recordCount = data.recordCount;
        this.totalRecordCount = data.totalRecordCount;
        this.pageSize = data.pageSize;
        this.upTo = data.upToIndex;
        this.pageNumber = data.pageNumber;
        this.backDisplay = data.backOption;
        this.forwardDisplay = data.forwardOption;
        this.pageSizeSelected = data.pageSize;
        this.filter = data.filter;
        this.lastSearchType = data.lastSearchType;
        this.displayTags = [SearchType.SFX_E, SearchType.SFX].includes(
          data.lastSearchType
        );
        this.versionSelections = data.lastVersions;
        this.value =
          data.lastSearchType === SearchType.SOURCE ? "" : data.filter;
        if (this.displayTags) {
          this.tags = tagList;
          this.tagsSelections = data.lastTags;
        }
      }
    });
    
    this.sfxService.updateTagsList();
  }

  search() {
    this.collectionService.filterText(this.value);
  }

  ngAfterViewChecked(): void {
    this.collectionService.loading.subscribe(
      (status) => (this.loading = status)
    );
    this.cdRef.detectChanges();
  }

  back() {
    this.collectionService.previousPage();
    this.window.scrollTo(0, 0);
  }

  forward() {
    this.collectionService.nextPage();
    this.window.scrollTo(0, 0);
  }

  filterTags(tags) {
    this.collectionService.filterTags(tags.selections);
  }

  filterVersions(versions) {
    this.collectionService.filterVersions(versions.selections);
  }

  filterVoices(voices) {
    this.collectionService.filterVoices(voices);
  }

  filterNPCs(npcs: number[]) {
    this.collectionService.filterNPCs(npcs);
  }

  filterGuilds(guilds: number[]) {
    this.collectionService.filterGuilds(guilds);
  }

  filterScripts(scripts: number[]) {
    this.collectionService.filterScripts(scripts);
  }

  searchNPCs(npc: string) {
    this.npcsService.getFilteredNPCs({ filter: npc });
  }

  searchGuilds(guild: string) {
    this.guildService.getFiltered({ filter: guild });
  }

  searchScripts(script: string) {
    this.scriptsService.getFiltered({ filter: script })
  }

  onPageSizeChange($event) {
    this.collectionService.updatePageSize($event);
  }

  toggleSidePanel() {
    this.sidenavToggled = !this.sidenavToggled;
  }
}
