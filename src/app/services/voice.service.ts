import { Injectable } from "@angular/core";
import { RecordingsResponse, Voice, VoicesResponse } from "./domain";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import { URLParamsService } from "./urlparams.service";

type VoiceMetadata = {
  loadOptions: VoiceLoadOptions;
};

type VoiceLoadOptions = {
  filter?: string;
  gameIDs?: number[];
  npcIDs?: number[];
  guildIDs?: number[];
  scriptIDs?: number[];
  ids?: number[];
};

@Injectable({
  providedIn: "root",
})
export class VoiceService {
  public loading: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public observedMetadata: BehaviorSubject<VoiceMetadata> =
    new BehaviorSubject<VoiceMetadata>(null);
  public observedVoices: Subject<Voice[]> = new BehaviorSubject<Voice[]>([]);

  constructor(
    private httpClient: HttpClient,
    private urlParams: URLParamsService
  ) {
    this.urlParams.current.subscribe((params) => {
      const opts: VoiceLoadOptions = {
        gameIDs: params.versions,
        npcIDs: params.npcs,
        guildIDs: params.guilds,
        scriptIDs: params.scripts,
        ids: params.voices,
      };
      this.getFilteredVoices(opts);
    });
  }

  public getFilteredVoices(opts: VoiceLoadOptions) {
    this.loading.next(true);

    const prev = this.observedMetadata.getValue();
    opts = {
      ...(prev && prev.loadOptions),
      ...opts,
    };

    const params = new HttpParams({
      fromObject: {
        ...(opts.gameIDs && { gameID: opts.gameIDs.join(",") }),
        ...(opts.npcIDs && { npcID: opts.npcIDs.join(",") }),
        ...(opts.guildIDs && { guildID: opts.guildIDs.join(",") }),
        ...(opts.scriptIDs && { scriptID: opts.scriptIDs.join(",") }),
      },
    });

    this.httpClient
      .get<VoicesResponse>("/voices", { params })
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        finalize(() => this.loading.next(false))
      )
      .subscribe((data) => {
        this.observedVoices.next(data);
        this.observedMetadata.next({loadOptions: opts});
      });
  }
}
