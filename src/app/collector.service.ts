import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

export enum SearchType {TEXT, SOURCE}

@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  public observedRecords: Subject<any> = new BehaviorSubject<any>({});
  public observedMetadata: Subject<any> = new Subject();
  public defaultPageSize = 100;
  private lastSearchType: SearchType = SearchType.TEXT;
  private lastFilter: string;

  private recordCount: number;
  private totalRecordCount: number;
  private pageSize: number;
  private upToIndex: number;
  private pageNumber: number;
  private backOption: boolean = false;
  private forwardOption: boolean = false;


  constructor(private httpClient: HttpClient) {}

  getFilteredRecords(filter: string, page: number = 0): any {

    const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const pageSize = (width <= 600) ? 10 : 50;

    const options =  {
        params: new HttpParams()
          .set('filter', filter)
          .set('pageSize', pageSize + '')
          .set('page', page + '')
    };

    this.httpClient.get('/', options).subscribe((data:any) => {
      this.observedRecords.next(data);
      this.lastSearchType = SearchType.TEXT;
      this.lastFilter = filter;
      this.parseRecords(data);
      this.updateMetadata();
    });

  }

  parseRecords(data:any) {
    this.recordCount = (data.recordsOnPage > 0) ? data.pageNumber * data.defaultPageSize + 1 : 0;
    this.totalRecordCount = data.recordCountTotal;
    this.pageSize = data.defaultPageSize;
    this.upToIndex = Math.max(this.recordCount - 1 + data.recordsOnPage, 0);
    this.pageNumber = data.pageNumber;
    this.backOption = (this.recordCount > 1);
    this.forwardOption = (this.upToIndex < this.totalRecordCount);
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
    })
  }

  nextPage() {
    if(this.forwardOption) {
      if(this.lastSearchType === SearchType.SOURCE) this.getRecordsFromSource(this.lastFilter, this.pageNumber + 1);
      else if(this.lastSearchType === SearchType.TEXT) this.getFilteredRecords(this.lastFilter, this.pageNumber + 1)
    }
  }

  previousPage() {
    if(this.backOption) {
      if(this.lastSearchType === SearchType.SOURCE) this.getRecordsFromSource(this.lastFilter, this.pageNumber - 1);
      else if(this.lastSearchType === SearchType.TEXT) this.getFilteredRecords(this.lastFilter, this.pageNumber - 1)
    }
  }

  getRecordsFromSource(source: string, page: number = 0) {

    const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const pageSize = (width <= 600) ? 10 : 50;

    const options =  {
      params: new HttpParams()
        .set('source', source)
        .set('pageSize', pageSize + '')
        .set('page', page + '')
    };

    this.httpClient.get('/source', options).subscribe((data)=>{
      this.observedRecords.next(data);
      this.lastSearchType = SearchType.SOURCE;
      this.lastFilter = source;
      this.parseRecords(data);
      this.updateMetadata();
    });

  }
}
