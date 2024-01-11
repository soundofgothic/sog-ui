import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SourceFile, SourceFileResponse } from "./domain";
import { HttpClient, HttpParams } from "@angular/common/http";
import { URLParamsService } from "./urlparams.service";

type ScriptMetadata = {
  total: number;
  loadOptions: ScriptLoadOptions;
};

type ScriptLoadOptions = {
  page?: number;
  pageSize?: number;
  gameIDs?: number[];
  voiceIDs?: number[];
  npcIDs?: number[];
  guildIDs?: number[];
  filter?: string;
  ids?: number[];
};

const defaultLoadOptions: ScriptLoadOptions = {
  page: 1,
  pageSize: 20,
};

@Injectable({
  providedIn: "root",
})
export class ScriptsService {
  public loading = new BehaviorSubject<boolean>(false);

  public observedMetadata: BehaviorSubject<ScriptMetadata> =
    new BehaviorSubject<ScriptMetadata>(null);

  public observedScripts: BehaviorSubject<SourceFile[]> = new BehaviorSubject<
    SourceFile[]
  >([]);

  constructor(
    private httpClient: HttpClient,
    private urlParams: URLParamsService
  ) {
    this.urlParams.current.subscribe((params) => {
      const opts: ScriptLoadOptions = {
        gameIDs: params.versions,
        voiceIDs: params.voices,
        npcIDs: params.npcs,
        guildIDs: params.guilds,
        ids: params.scripts,
      };
      this.getFiltered(opts);
    });
  }

  public getFiltered(opts: ScriptLoadOptions) {
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
        ...(opts.gameIDs && { gameID: opts.gameIDs.join(",") }),
        ...(opts.voiceIDs && { voiceID: opts.voiceIDs.join(",") }),
        ...(opts.npcIDs && { npcID: opts.npcIDs.join(",") }),
        ...(opts.guildIDs && { guildID: opts.guildIDs.join(",") }),
        ...(opts.ids && { id: opts.ids.join(",") }),
      },
    });

    this.httpClient
      .get<SourceFileResponse>("/source_files", { params })
      .subscribe((response) => {
        this.observedScripts.next(response.results);
        this.observedMetadata.next({
          total: response.total,
          loadOptions: opts,
        });
        this.loading.next(false);
      });
  }
}
