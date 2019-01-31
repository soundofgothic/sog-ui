import { WINDOW } from '@ng-toolkit/universal';
import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

export enum SearchType {TEXT, SOURCE}

@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  public observedRecords: Subject<any> = new BehaviorSubject<any>({});
  public observedMetadata: Subject<any> = new Subject();
  public loading: Subject<boolean> = new BehaviorSubject<any>(false);


  private lastSearchType: SearchType = SearchType.TEXT;
  private lastFilter: string = '';

  private recordCount: number;
  private totalRecordCount: number;
  private pageSize: number;
  private upToIndex: number;
  private pageNumber: number;
  private backOption: boolean = false;
  private forwardOption: boolean = false;

  constructor(@Inject(WINDOW) private window: Window, private httpClient: HttpClient, private router: Router) {

  }

  getFilteredRecords(filter: string, page: number = 0, type: SearchType = SearchType.TEXT, pageSize?): any {


    let queryParams = new HttpParams()
      .set('pageSize', pageSize + '')
      .set('page', page + '');

    queryParams = type === SearchType.TEXT ? queryParams.set('filter', filter) : queryParams.set('source', filter);

    const options = {
      params: queryParams
    };

    const url = type === SearchType.TEXT ? '/' : '/source';

    this.loading.next(true);

    this.httpClient.get(url, options).subscribe((data: any) => {
      this.observedRecords.next(data);
      this.lastSearchType = type;
      this.lastFilter = filter ? filter : this.lastFilter;
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
    const width = this.window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    return (width <= 600) ? 10 : 50;
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
      lastSearchType: this.lastSearchType
    });
  }

  nextPage() {
    if (this.forwardOption)
      this.router.navigate(['text'], {
        queryParams: {
          filter: this.lastFilter,
          page: this.pageNumber + 1,
          pageSize: this.pageSize,
          type: this.lastSearchType
        }
      });
  }

  previousPage() {
    if (this.backOption)
      this.router.navigate(['text'], {
        queryParams: {
          filter: this.lastFilter,
          page: this.pageNumber - 1,
          pageSize: this.pageSize,
          type: this.lastSearchType
        }
      });
  }
}
