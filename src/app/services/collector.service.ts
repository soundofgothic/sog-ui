import {WINDOW, LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {catchError, tap} from 'rxjs/operators';

declare var Pizzicato: any;

export enum SearchType {
  TEXT,
  SOURCE,
  REPORT,
  SFX,
  SFX_E
}

const typeResolver = ['/', '/source', '/reports', '/sfx', '/sfx'];
export const componentTypeResolver = ['text', 'text', 'reports', 'sfx', 'sfx/extended'];

export interface SearchConfig {
  filter: string,
  page?: number,
  type?: SearchType,
  pageSize?: number,
  tags?: string[],
  versions?: number[]
}

@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  public observedRecords: Subject<any> = new BehaviorSubject<any>({});
  public observedMetadata: Subject<any> = new Subject();
  public loading: Subject<boolean> = new BehaviorSubject<any>(false);

  public lastSearchType: SearchType = SearchType.TEXT;
  public lastFilter = '';
  private lastTags = [];
  private lastVersions = [];

  private recordCount: number;
  private totalRecordCount: number;
  private pageSize: number;
  private upToIndex: number;
  private pageNumber: number;
  private backOption = false;
  private forwardOption = false;

  constructor(@Inject(WINDOW) private window: Window,
              @Inject(LOCAL_STORAGE) private local_storage: any,
              @Inject(PLATFORM_ID) private platformId: Object,
              private route: ActivatedRoute,
              private httpClient: HttpClient, private router: Router) {

  }

  getFilteredRecords(config: SearchConfig): any {
    let queryParams = new HttpParams()
      .set('pageSize', config.pageSize + '')
      .set('page', config.page + '')
      .set('filter', config.filter);


    if (config.type === SearchType.SFX_E) {
      queryParams = queryParams.set('sortField', 'reported');
    }

    if (config.tags) {
      queryParams = queryParams.append('tags', config.tags.join(', '));
    }

    if (config.versions) {
      queryParams = queryParams.append('g', config.versions.join(', '));
    }


    const options = {
      params: queryParams
    };

    const url = typeResolver[config.type];

    this.loading.next(true);

    this.httpClient.get(url, options).pipe(catchError(err => {
      // sometimes error doesnt mean wish to login
      // this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
      return throwError(err);
    })).subscribe((data: any) => {
      this.observedRecords.next(data);
      this.lastSearchType = config.type;
      this.lastFilter = config.filter;
      this.lastTags = config.tags ? config.tags : [];
      this.lastVersions = config.versions ? config.versions : null;
      this.parseRecords(data);
      this.updateMetadata();
      this.loading.next(false);
    });
  }


  parseRecords(data: any) {
    this.recordCount = (data.recordsOnPage > 0) ? data.pageNumber * data.defaultPageSize + 1 : 0;
    this.totalRecordCount = data.recordCountTotal;
    this.pageSize = data.defaultPageSize;
    this.upToIndex = Math.max(this.recordCount - 1 + data.recordsOnPage, 0);
    this.pageNumber = data.pageNumber;
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
    let newPageNumber = Math.floor(this.pageNumber * this.pageSize / pageSize);
    let queryParams: any = {
      filter: this.lastFilter,
      page: newPageNumber,
      type: this.lastSearchType,
      pageSize: pageSize,
      tags: this.lastTags,
      versions: this.lastVersions
    };
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: queryParams
    });
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
      lastVersions: this.lastVersions
    });
  }

  nextPage() {
    if (this.forwardOption) {
      let queryParams: any = {
        filter: this.lastFilter,
        page: this.pageNumber + 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: this.lastVersions
      };

      this.router.navigate([componentTypeResolver[this.lastSearchType]], {
        queryParams: queryParams
      });
    }

    // let acousticGuitar = new Pizzicato.Sound('https://sounds.soundofgothic.pl/assets/gsounds/INFO_SLD_8_WICHTIGEPERSONEN_15_00.WAV', function() {
    //   // Sound loaded!
    //   acousticGuitar.play();
    // });

  }

  previousPage() {
    if (this.backOption) {
      let queryParams: any = {
        filter: this.lastFilter,
        page: this.pageNumber - 1,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: this.lastVersions
      };

      this.router.navigate([componentTypeResolver[this.lastSearchType]], {
        queryParams: queryParams
      });
    }
  }

  filterText(filter) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: filter,
        page: 0,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: this.lastVersions
      }
    });
  }

  filterTags(tags) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: '',
        page: 0,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: tags,
        versions: this.lastVersions
      }
    });
  }

  filterVersions(versions) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: this.lastFilter,
        page: 0,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: this.lastTags,
        versions: versions
      }
    });
  }

  selectTag(tagName) {
    this.router.navigate([componentTypeResolver[this.lastSearchType]], {
      queryParams: {
        filter: '',
        page: 0,
        pageSize: this.pageSize,
        type: this.lastSearchType,
        tags: [tagName],
        versions: this.lastVersions
      }
    });
  }

  reloadPage() {
    let config: SearchConfig = {
      filter: this.lastFilter,
      page: this.pageNumber,
      type: this.lastSearchType,
      pageSize: this.pageSize,
      tags: this.lastTags,
      versions: this.lastVersions
    };
    this.getFilteredRecords(config);
  }

  reportRecord(id, details): Observable<any> {
    const url = '/report/' + id;
    return this.httpClient.post(url, {details: details}).pipe(tap((status) => {
      this.local_storage[id] = 'reported';
    }));
  }

  modifyRecord(id, text): Observable<any> {
    const url = '/reports/resolve';
    return this.httpClient.post(url, {id: id, text: text}).pipe(tap((status) => {
      this.reloadPage();
    }));
  }

  cancelReports(id): Observable<any> {
    const url = '/reports/cancel';
    return this.httpClient.post(url, {id: id}).pipe(tap((status) => {
      this.reloadPage();
    }));
  }

  deleteRecord(id): Observable<any> {
    const url = '/reports/delete';
    return this.httpClient.post(url, {id: id}).pipe(tap((status) => {
      this.reloadPage();
    }));
  }
}
