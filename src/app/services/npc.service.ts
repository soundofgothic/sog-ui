import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { NPC, NPCsResponse } from "./domain";
import { VoiceService } from "./voice.service";
import { CollectorService, Metadata } from "./collector.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { URLParamsService } from "./urlparams.service";

type NPCMetadata = {
  total: number;
  loadOptions: NPCLoadOptions;
};

type NPCLoadOptions = {
  page?: number;
  pageSize?: number;
  voices?: number[];
  filter?: string;
  gameIDs?: number[];
  guildIDs?: number[];
  scriptIDs?: number[];
  ids?: number[];
};

const defaultLoadOptions: NPCLoadOptions = {
  page: 1,
  pageSize: 20,
};

@Injectable({
  providedIn: "root",
})
export class NPCService {
  public loading = new BehaviorSubject<boolean>(false);

  public observedMetadata: BehaviorSubject<NPCMetadata> =
    new BehaviorSubject<NPCMetadata>(null);
  public observedNPCs: Subject<NPC[]> = new BehaviorSubject<NPC[]>([]);

  constructor(
    private httpClient: HttpClient,
    private urlParams: URLParamsService
  ) {
    this.urlParams.current.subscribe((params) => {
      const opts: NPCLoadOptions = {
        gameIDs: params.versions,
        voices: params.voices,
        guildIDs: params.guilds,
        scriptIDs: params.scripts,
        ids: params.npcs,
      };
      this.getFilteredNPCs(opts);
    });
  }

  public getFilteredNPCs(opts: NPCLoadOptions) {
    const prev = this.observedMetadata.getValue();
    opts = {
      ...defaultLoadOptions,
      ...(prev && prev.loadOptions),
      ...opts,
    };
    this.loading.next(true);
    const params = new HttpParams({
      fromObject: {
        page: opts.page.toString(),
        limit: opts.pageSize.toString(),
        ...(opts.filter && { filter: opts.filter }),
        ...(opts.voices && { voiceID: opts.voices.join(",") }),
        ...(opts.gameIDs && { gameID: opts.gameIDs.join(",") }),
        ...(opts.guildIDs && { guildID: opts.guildIDs.join(",") }),
        ...(opts.ids && { id: opts.ids.join(",") }),
        ...(opts.scriptIDs && { scriptID: opts.scriptIDs.join(",") }),
      },
    });
    this.httpClient.get<NPCsResponse>("/npcs", { params }).subscribe((data) => {
      this.observedNPCs.next(data.results);
      this.observedMetadata.next({
        loadOptions: opts,
        total: data.total,
      });
      this.loading.next(false);
    });
  }
}
