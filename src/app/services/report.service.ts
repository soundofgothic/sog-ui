import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {CollectorService} from './collector.service';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(@Inject(LOCAL_STORAGE) private local_storage: any,
              private httpClient: HttpClient,
              private collectorService: CollectorService) {
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
      this.collectorService.reloadPage();
    }));
  }

  modifyFilename(id, filename): Observable<any> {
    const url = '/reports/filename';
    return this.httpClient.post(url, {id: id, filename: filename}).pipe(tap(status => {
      this.collectorService.reloadPage();
    }));
  }

  cancelReports(id): Observable<any> {
    const url = '/reports/cancel';
    return this.httpClient.post(url, {id: id}).pipe(tap((status) => {
      this.collectorService.reloadPage();
    }));
  }

  deleteRecord(id): Observable<any> {
    const url = '/reports/delete';
    return this.httpClient.post(url, {id: id}).pipe(tap((status) => {
      this.collectorService.reloadPage();
    }));
  }
}
