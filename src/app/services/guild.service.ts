import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Guild, GuildsResponse, isNonEmpty } from "./domain";
import { URLParamsService } from "./urlparams.service";

type GuildMetadata = {
  total: number;
  loadOptions: GuildLoadOptions;
};

type GuildLoadOptions = {
  page?: number;
  pageSize?: number;
  gameIDs?: number[];
  voiceIDs?: number[];
  scriptIDs?: number[];
  npcIDs?: number[];
  filter?: string;
  ids?: number[];
};

const defaultLoadOptions: GuildLoadOptions = {
  page: 1,
  pageSize: 20,
};

@Injectable({
  providedIn: "root",
})
export class GuildService {
  public loading = new BehaviorSubject<boolean>(false);

  public observedMetadata: BehaviorSubject<GuildMetadata> =
    new BehaviorSubject<GuildMetadata>(null);
  public observedGuilds: Subject<Guild[]> = new BehaviorSubject<Guild[]>([]);

  constructor(
    private httpClient: HttpClient,
    private urlParams: URLParamsService
  ) {
    this.urlParams.currentDistinctNonPage.subscribe((params) => {
      console.log(params);
      const opts: GuildLoadOptions = {
        gameIDs: params.versions,
        scriptIDs: params.scripts,
        voiceIDs: params.voices,
        npcIDs: params.npcs,
        ids: params.guilds,
      };
      this.getFiltered(opts);
    });
  }

  public getFiltered(opts: GuildLoadOptions) {
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
        ...(isNonEmpty(opts.filter) && { filter: opts.filter }),
        ...(isNonEmpty(opts.gameIDs) && { gameID: opts.gameIDs.join(",") }),
        ...(isNonEmpty(opts.voiceIDs) && { voiceID: opts.voiceIDs.join(",") }),
        ...(isNonEmpty(opts.scriptIDs) && {
          scriptID: opts.scriptIDs.join(","),
        }),
        ...(isNonEmpty(opts.npcIDs) && { npcID: opts.npcIDs.join(",") }),
        ...(isNonEmpty(opts.ids) && { id: opts.ids.join(",") }),
      },
    });
    this.httpClient
      .get<GuildsResponse>("/guilds", { params })
      .subscribe((data) => {
        this.observedGuilds.next(data.results);
        this.observedMetadata.next({
          loadOptions: opts,
          total: data.total,
        });
        this.loading.next(false);
      });
  }
}