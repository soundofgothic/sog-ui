import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

declare function require(url: string);


@Injectable({
  providedIn: 'root'
})
export class CollectorService{

  public observedRecords: Subject<any> = new BehaviorSubject<any>({});
  public defaultPageSize: number = 100;

  constructor(private httpClient: HttpClient) {
    this.getFilteredRecords("Morderca");
  }

  getFilteredRecords(filter: string, page: number = 0): any {

    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let pageSize = (width <= 600) ? 10 : 50;

    let options =  {
        params: new HttpParams()
          .set('filter', filter)
          .set('pageSize', pageSize+"")
          .set('page', page+"")
    };

    this.httpClient.get('/', options).subscribe((res)=>{
      this.observedRecords.next(res);
    });

  }
}
