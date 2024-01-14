import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Recording, RecordingsResponse } from "./domain";

export enum SearchType {
  TEXT,
  SOURCE,
  REPORT,
  SFX,
  SFX_E,
}

const typeResolver = ["/recordings", "/recordings", "/reports", "/sfx", "/sfx"];
export const componentTypeResolver = [
  "text",
  "text",
  "reports",
  "sfx",
  "reports/sfx",
];

export interface SearchConfig {
  filter: string;
  page?: number;
  type: SearchType;
  pageSize?: number;
  tags?: string[];
  versions?: number[];
  voices?: number[];
  npcs?: number[];
  guilds?: number[];
  scripts?: number[];
}

export interface Metadata {
  recordCount: number;
  totalRecordCount: number;
  pageSize: number;
  upToIndex: number;
  pageNumber: number;
  backOption: boolean;
  forwardOption: boolean;
  filter: string;
  lastSearchType: SearchType;
  lastTags: string[];
  lastVersions: number[];
  voices: number[];
}

export type SearchConfigOpts = (a: SearchConfig) => SearchConfig;

@Injectable({
  providedIn: "root",
})
export class CollectorService {
  public record: Subject<any> = new Subject<any>();
  public recordSnapshot: any;
  public gSnapshot: any;

  public observedRecords: Subject<RecordingsResponse> =
    new BehaviorSubject<any>({});
  public observedMetadata: BehaviorSubject<Metadata> =
    new BehaviorSubject<Metadata>(null);
  public loading: Subject<boolean> = new BehaviorSubject<any>(false);
  public recordLoading = new BehaviorSubject<boolean>(false);
  public recordMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public lastSearchConfig: BehaviorSubject<SearchConfig> =
    new BehaviorSubject<SearchConfig>({
      filter: "",
      type: SearchType.TEXT,
    });

  private recordCount: number;
  private totalRecordCount: number;
  private pageSize: number;
  private upToIndex: number;
  private pageNumber: number;
  private backOption = false;
  private forwardOption = false;

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private local_storage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  getFilteredRecords(config: SearchConfig): any {
    let queryParams = new HttpParams({
      fromObject: {
        pageSize: config.pageSize + "",
        page: config.page + "",
        ...(config.filter && { filter: config.filter }),
        ...(config.tags && { tags: config.tags }),
        ...(config.versions && { gameID: config.versions.map((v) => v + "") }),
        ...(config.voices && { voiceID: config.voices.map((v) => v + "") }),
        ...(config.type === SearchType.SFX_E && { sortField: "reported" }),
        ...(config.npcs && { npcID: config.npcs.map((n) => n + "") }),
        ...(config.guilds && { guildID: config.guilds.map((g) => g + "") }),
        ...(config.scripts && {
          sourceFileID: config.scripts.map((s) => s + ""),
        }),
      },
    });

    const options = {
      params: queryParams,
    };
    const url = typeResolver[config.type];
    this.loading.next(true);
    this.httpClient
      .get<RecordingsResponse>(url, options)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe((data) => {
        this.observedRecords.next(data);
        this.lastSearchConfig.next(config);
        this.parseRecords(data);
        this.updateMetadata();
        this.loading.next(false);
      });
  }

  getGNameRecord(version: number, filename: string) {
    const url = `/recordings/${version}/${filename}`;
    this.recordLoading.next(true);
    this.httpClient
      .get(url)
      .pipe(catchError((err) => throwError(err)))
      .subscribe((data) => {
        this.recordSnapshot = data;
        this.gSnapshot = version;
        this.record.next(data);
        this.recordLoading.next(false);
      });
  }

  parseRecords(data: RecordingsResponse) {
    this.recordCount =
      data.results.length > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
    this.totalRecordCount = data.total;
    this.pageSize = data.pageSize;
    this.upToIndex = Math.max(this.recordCount - 1 + data.results.length, 0);
    this.pageNumber = data.page;
    this.backOption = this.recordCount > 1;
    this.forwardOption = this.upToIndex < this.totalRecordCount;
  }

  withLatestConfig(): SearchConfigOpts {
    return (a: SearchConfig) => {
      return {
        filter: this.lastSearchConfig.value.filter,
        page: this.lastSearchConfig.value.page,
        type: this.lastSearchConfig.value.type,
        pageSize: this.lastSearchConfig.value.pageSize,
        tags: this.lastSearchConfig.value.tags,
        versions: this.lastSearchConfig.value.versions,
        voices: this.lastSearchConfig.value.voices,
        npcs: this.lastSearchConfig.value.npcs,
        guilds: this.lastSearchConfig.value.guilds,
        scripts: this.lastSearchConfig.value.scripts,
      };
    };
  }

  search(config: SearchConfigOpts[], forceMode?: "stay" | "redirect") {
    let newConfig: SearchConfig = {
      filter: "",
      type: SearchType.TEXT,
    };
    config.forEach((c) => {
      newConfig = c(newConfig);
    });

    let clearNewConfig = Object.keys(newConfig)
      .filter((key) => {
        if (Array.isArray(newConfig[key])) {
          return newConfig[key].length > 0;
        }
        return newConfig[key];
      })
      .reduce((res, key) => ((res[key] = newConfig[key]), res), {});

    switch (forceMode) {
      case "stay":
        this.getFilteredRecords(newConfig);
        return;
      case "redirect":
        this.router.navigate(
          [componentTypeResolver[this.lastSearchConfig.value.type]],
          {
            queryParams: clearNewConfig,
          }
        );
        return;
      default:
        if (this.recordMode.value) {
          this.router.navigate(
            [componentTypeResolver[this.lastSearchConfig.value.type]],
            {
              queryParams: clearNewConfig,
            }
          );
          return;
        }
        this.getFilteredRecords(newConfig);
    }
  }

  deviceDependsPageSize(): number {
    let width;

    if (isPlatformBrowser(this.platformId)) {
      width =
        this.window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    }

    return width <= 600 ? 10 : 50;
  }

  searchBySource(filesource) {
    this.router.navigate(["text"], {
      queryParams: {
        filter: filesource,
        page: 0,
        pageSize: this.pageSize,
        type: SearchType.SOURCE,
      },
    });
  }

  updatePageSize(pageSize: number) {
    const newPageNumber =
      1 + Math.floor(((this.pageNumber - 1) * this.pageSize) / pageSize);
    this.search(
      [
        this.withLatestConfig(),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          page: newPageNumber,
          pageSize: pageSize,
        }),
      ],
      this.recordMode.value ? "stay" : "redirect"
    );
  }

  updateMetadata() {
    this.observedMetadata.next({
      recordCount: this.recordCount,
      totalRecordCount: this.totalRecordCount,
      pageSize: this.pageSize,
      upToIndex: this.upToIndex,
      pageNumber: this.pageNumber,
      backOption: this.backOption,
      forwardOption: this.forwardOption,
      filter: this.lastSearchConfig.value.filter,
      lastSearchType: this.lastSearchConfig.value.type,
      lastTags: this.lastSearchConfig.value.tags,
      lastVersions: this.lastSearchConfig.value.versions,
      voices: this.lastSearchConfig.value.voices,
    });
  }

  nextPage() {
    if (this.forwardOption) {
      this.search(
        [
          this.withLatestConfig(),
          (a: SearchConfig): SearchConfig => ({
            ...a,
            page: this.pageNumber + 1,
          }),
        ],
        this.recordMode.value ? "stay" : "redirect"
      );
    }
  }

  previousPage() {
    if (this.backOption) {
      this.search(
        [
          this.withLatestConfig(),
          (a: SearchConfig): SearchConfig => ({
            ...a,
            page: this.pageNumber - 1,
          }),
        ],
        this.recordMode.value ? "stay" : "redirect"
      );
    }
  }

  filterText(filter: string) {
    this.search(
      [
        this.withLatestConfig(),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          filter: filter,
          type: a.type === SearchType.SOURCE ? SearchType.TEXT : a.type,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  filterTags(tags: string[]) {
    this.search(
      [
        this.withLatestConfig(),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          tags: tags,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  filterVersions(versions: number[]) {
    this.search(
      [
        this.withLatestConfig(),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          versions: versions,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  filterVoices(voices: number[], withLatestConfig?: boolean) {
    withLatestConfig = withLatestConfig === undefined ? true : withLatestConfig;

    this.search(
      [
        ...(withLatestConfig ? [this.withLatestConfig()] : []),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          voices: voices,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  filterNPCs(npcs: number[], withLatestConfig?: boolean) {
    withLatestConfig = withLatestConfig === undefined ? true : withLatestConfig;

    this.search(
      [
        ...(withLatestConfig ? [this.withLatestConfig()] : []),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          npcs: npcs,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  filterGuilds(guilds: number[], withLatestConfig?: boolean) {
    withLatestConfig = withLatestConfig === undefined ? true : withLatestConfig;

    this.search(
      [
        ...(withLatestConfig ? [this.withLatestConfig()] : []),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          guilds: guilds,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  filterScripts(scripts: number[], withLatestConfig?: boolean) {
    withLatestConfig = withLatestConfig === undefined ? true : withLatestConfig;

    this.search(
      [
        ...(withLatestConfig ? [this.withLatestConfig()] : []),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          scripts: scripts,
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  selectTag(tagName: string) {
    this.search(
      [
        this.withLatestConfig(),
        (a: SearchConfig): SearchConfig => ({
          ...a,
          tags: [tagName],
          filter: "",
          page: 1,
        }),
      ],
      "redirect"
    );
  }

  loadFamiliarRecordings(recording: Recording) {
    this.search(
      [
        (a: SearchConfig): SearchConfig => ({
          filter: "",
          type: SearchType.TEXT,
          page: 1,
          pageSize: this.deviceDependsPageSize(),
          scripts: [recording.sourceFileID],
        }),
      ],
      "stay"
    );
  }

  setRecordMode(value: boolean) {
    this.recordMode.next(value);
  }

  reloadPage() {
    this.search([this.withLatestConfig()], "stay");
  }
}
