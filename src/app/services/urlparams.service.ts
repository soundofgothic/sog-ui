import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export type URLParams = {
  filter?: string;
  page?: number;
  pageSize?: number;
  versions?: number[];
  type?: number;

  voices?: number[];
  npcs?: number[];
  guilds?: number[];
  scripts?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class URLParamsService {

  public current: BehaviorSubject<URLParams> = new BehaviorSubject<URLParams>({});

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      let page = params.get('page');
      let pageSize = params.get('pageSize');
      let versions = params.getAll('versions');
      let voices = params.getAll('voices');
      let npcs = params.getAll('npcs');
      let guilds = params.getAll('guilds');
      let scripts = params.getAll('scripts');

      let type = params.get('type');
      let filter = params.get('filter');

      let config: URLParams = {
        ...(page && { page: parseInt(page) }),
        ...(pageSize && { pageSize: parseInt(pageSize) }),
        ...(versions && { versions: versions.map(v => parseInt(v)) }),
        ...(voices && { voices: voices.map(v => parseInt(v)) }),
        ...(type && { type: parseInt(type) }),
        ...(filter && { filter: filter }),
        ...(npcs && { npcs: npcs.map(n => parseInt(n)) }),
        ...(guilds && { guilds: guilds.map(g => parseInt(g)) }),
        ...(scripts && { scripts: scripts.map(s => parseInt(s)) }),
      };

      this.current.next(config);
    })
  }
}
