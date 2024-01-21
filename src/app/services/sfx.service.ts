import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SfxService {

  public tagsList: Subject<any> = new BehaviorSubject<any>([]);

  constructor(@Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private local_storage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private httpClient: HttpClient, private router: Router) {

  }

  updateTagsList() {
    // TODO: add tags fetching
  }

  resolve(id, description, tags) {
    const url = '/sfx/resolve';
    return this.httpClient.post(url, { id: id, tags: tags, description: description }).pipe(tap(() => this.updateTagsList()));
  }

  report(id, description, tags) {
    const url = '/sfx/report';
    return this.httpClient.post(url, { id: id, tags: tags, description: description }).pipe(tap(() => this.updateTagsList()));
  }


}
