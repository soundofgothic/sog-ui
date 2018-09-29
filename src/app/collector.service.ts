import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

declare function require(url: string);


@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  public observedRecords: Subject<any> = new BehaviorSubject<any>({});
  public defaultPageSize = 100;
  private sourceSearch: boolean = false;
  private lastSourceSearch: string;

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

    this.httpClient.get('/', options).subscribe((res) => {
      this.observedRecords.next(res);
      this.sourceSearch = false;
    });

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

    this.httpClient.get('/source', options).subscribe((res)=>{
      this.observedRecords.next(res);
      this.sourceSearch = true;
      this.lastSourceSearch = source;
    });

  }

  isSourceFiltered(): boolean {
    return !!this.sourceSearch;
  }

  getLastSourceSearch(): string {
    return this.lastSourceSearch.slice();
  }

}
