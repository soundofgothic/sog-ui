import {WINDOW, LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscribable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {catchError, tap} from 'rxjs/operators';
import { RecordingsResponse } from './domain';

declare var Pizzicato: any;

export enum SearchType {
  TEXT,
  SOURCE,
  REPORT,
  SFX,
  SFX_E
}

const typeResolver = ['/recordings', '/recordings', '/reports', '/sfx', '/sfx'];
export const componentTypeResolver = ['text', 'text', 'reports', 'sfx', 'reports/sfx'];

export interface SearchConfig {
  filter: string,
  page?: number,
  type?: SearchType,
  pageSize?: number,
  tags?: string[],
  versions?: number[],
  voices?: number[],
  sourceFileIDs?: number[]
}

export interface Metadata {
  recordCount: number,
  totalRecordCount: number,
  pageSize: number,
  upToIndex: number,
  pageNumber: number,
  backOption: boolean,
  forwardOption: boolean,
  filter: string,
  lastSearchType: SearchType,
  lastTags: string[],
  lastVersions: string[],
  voices: number[],
}



@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  public record: Subject<any> = new Subject<any>();
  public recordSnapshot: any;
  public gSnapshot: any;

  public observedRecords: Subject<RecordingsResponse> = new BehaviorSubject<any>({});
  public observedMetadata: BehaviorSubject<Metadata> = new BehaviorSubject<Metadata>(null);
  public loading: Subject<boolean> = new BehaviorSubject<any>(false);
  public recordLoading = new BehaviorSubject<boolean>(false);

  public lastSearchType: SearchType = SearchType.TEXT;
  public lastFilter = '';
  private lastTags = [];
  private lastVersions = [];
  private lastVoices = [];

  private recordCount: number;
  private totalRecordCount: number;
  private pageSize: number;
  private upToIndex: number;
  private pageNumber: number;
  private backOption = false;
  private forwardOption = false;
  private recordMode = false;

  constructor(@Inject(WINDOW) private window: Window,
              @Inject(LOCAL_STORAGE) private local_storage: any,
              @Inject(PLATFORM_ID) private platformId: Object,
              private httpClient: HttpClient, private router: Router) {

  }

  getFilteredRecords(config: SearchConfig): any {
    let queryParams = new HttpParams({
      fromObject: {
        pageSize: config.pageSize + '',
        page: config.page + '',
        ...(config.filter && {filter: config.filter}),
        ...(config.tags && {tags: config.tags}),
        ...(config.versions && {gameID: config.versions.map(v => v + '')}),
        ...(config.voices && {voiceID: config.voices.map(v => v + '')}),
        ...(config.type === SearchType.SFX_E && {sortField: 'reported'})
      }
    })
    const options = {
      params: queryParams
    };
    const url = typeResolver[config.type];
    this.loading.next(true);
    this.httpClient.get<RecordingsResponse>(url, options).pipe(catchError(err => {
      return throwError(err);
    })).subscribe((data) => {
      this.observedRecords.next(data);
      this.lastSearchType = config.type;
      this.lastFilter = config.filter;
      this.lastTags = config.tags || [];
      this.lastVersions = config.versions || null;
      this.lastVoices = config.voices || null;
      this.parseRecords(data);
      this.updateMetadata();
      this.loading.next(false);
    });
  }

  getGNameRecord(version: number, filename: string) {
    const url = `/recordings/${version}/${filename}`;
    this.recordLoading.next(true);
    this.httpClient.get(url).pipe(catchError(err => throwError(err))).subscribe(data => {
      this.recordSnapshot = data;
      this.gSnapshot = version;
      this.record.next(data);
      this.recordLoading.next(false);
    });
  }


  parseRecords(data: RecordingsResponse) {
    this.recordCount = (data.results.length > 0) ? (data.page - 1) * data.pageSize + 1 : 0;
    this.totalRecordCount = data.total;
    this.pageSize = data.pageSize;
    this.upToIndex = Math.max(this.recordCount - 1 + data.results.length, 0);
    this.pageNumber = data.page;
    this.backOption = (this.recordCount > 1);
    this.forwardOption = (this.upToIndex < this.totalRecordCount);
  }

  deviceDependsPageSize(): number {
    let width;

    if (isPlatformBrowser(this.platformId)) {
      width = this.window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    }

    return (width <= 600) ? 10 : 50;
  }

  searchBySource(filesource) {
    this.router.navigate(['text'], {
      queryParams: {
        filter: filesource,
        page: 0,
        pageSize: this.pageSize,
        type: SearchType.SOURCE
      }
    });
  }

  updatePageSize(pageSize) {
    console.log(this.lastVersions)

    const newPageNumber = 1 + Math.floor((this.pageNumber - 1) * this.pageSize / pageSize);
    if (this.recordMode) {
      this.getFilteredRecords({
        filter: this.recordSnapshot.source,
        type: SearchType.SOURCE,
        page: newPageNumber,
        pageSize: pageSize,
        versions: this.lastVersions,
        voices: this.lastVoices
      });
    } else {
      const queryParams: any = {
        filter: this.lastFilter,
        page: newPageNumber,
        type: this.lastSearchType,
        pageSize: pageSize,
        tags: this.lastTags,
        versions: this.lastVersions,
        voices: this.lastVoices,
      };
      this.router.navigate([componentTypeResolver[this.lastSearchType]], {
        queryParams: queryParams
      });
    }


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
      filter: this.lastFilter,
      lastSearchType: this.lastSearchType,
      lastTags: this.lastTags,
      lastVersions: this.lastVersions,
      voices: this.lastVoices,
    });
  }

  nextPage() {
    if (this.forwardOption) {
      if (this.recordMode) {
        this.getFilteredRecords({
          filter: this.recordSnapshot.source,
          type: SearchType.SOURCE,
          page: this.pageNumber + 1,
          pageSize: this.pageSize,
          versions: [this.gSnapshot],
          voices: this.lastVoices
        });
      } else {
        const queryParams: any = {
          filter: this.lastFilter,
          page: this.pageNumber + 1,
          pageSize: this.pageSize,
          type: this.lastSearchType,
          tags: this.lastTags,
          versions: this.lastVersions,
          voices: this.lastVoices,
        };

        this.router.navigate([componentTypeResolver[this.lastSearchType]], {
          queryParams: queryParams
        });
      }
    }

  }

  previousPage() {
    if (this.backOption) {

      if (this.recordMode) {
        this.getFilteredRecords({
          filter: this.recordSnapshot.source,
          type: SearchType.SOURCE,
          page: this.pageNumber - 1,
          pageSize: this.pageSize,
          versions: [this.gSnapshot],
          voices: this.lastVoices
        });
      } else {
        const queryParams: any = {
          filter: this.lastFilter,
          page: this.pageNumber - 1,
          pageSize: this.pageSize,
          type: this.lastSearchType,
          tags: this.lastTags,
          versions: this.lastVersions,
          voices: this.lastVoices,
        };

        this.router.navigate([componentTypeResolver[this.lastSearchType]], {
          queryParams: queryParams
        });
      }


    }
  }

  filterText(filter) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: filter,
        page: 1,
        pageSize: this.pageSize,
        type: this.lastSearchType === SearchType.SOURCE ? SearchType.TEXT : this.lastSearchType,
        tags: this.lastTags,
        versions: this.lastVersions,
        voices: this.lastVoices,
      }
    });
  }

  filterTags(tags) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: '',
        page: 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: tags,
        versions: this.lastVersions,
        voices: this.lastVoices,
      }
    });
  }

  filterVersions(versions) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: this.lastFilter,
        page: 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: versions,
        voices: this.lastVoices,
      }
    });
  }

  filterVoices(voices) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: this.lastFilter,
        page: 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: this.lastVersions,
        voices: voices,
      }
    });
  }

  selectTag(tagName) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: '',
        page: 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: [tagName],
        versions: this.lastVersions,
        voices: this.lastVoices,
      }
    });
  }

  selectVoices(voices) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: '',
        page: 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: this.lastVersions,
        voices: voices
      }
    });
  }

  setRecordMode(value: boolean) {
    this.recordMode = value;
  }

  reloadPage() {
    let config: SearchConfig = {
      filter: this.lastFilter,
      page: this.pageNumber,
      type: this.lastSearchType,
      pageSize: this.pageSize,
      tags: this.lastTags,
      versions: this.lastVersions,
      voices: this.lastVoices,
    };
    this.getFilteredRecords(config);
  }


}
