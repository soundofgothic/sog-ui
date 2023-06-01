import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { NPC, NPCsResponse } from "./domain";
import { VoiceService } from "./voice.service";
import { CollectorService, Metadata } from "./collector.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

type NPCMetadata = {
  lastPage: number;
  total: number;
  perPage: number;
};

type NPCLoadOptions = {
  page?: number;
  pageSize?: number;
  voices?: number[];
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

  public observedMetadata: Subject<NPCMetadata> =
    new BehaviorSubject<NPCMetadata>(null);
  public observedNPCs: Subject<NPC[]> = new BehaviorSubject<NPC[]>([]);

  constructor(private httpClient: HttpClient) {}

  public getFilteredNPCs(opts: NPCLoadOptions) {
    opts = { ...defaultLoadOptions, ...opts };
    this.loading.next(true);
    const params = new HttpParams({
      fromObject: {
        page: opts.page.toString(),
        limit: opts.pageSize.toString(),
        ...(opts.voices && { voices: opts.voices.join(",") }),
      },
    });
    this.httpClient.get<NPCsResponse>("/npcs", { params }).subscribe((data) => {
      this.observedNPCs.next(data.results);
      this.observedMetadata.next({
        lastPage: opts.page,
        total: data.total,
        perPage: opts.pageSize,
      });
      this.loading.next(false);
    });
  }
}
