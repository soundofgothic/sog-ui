import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest } from "rxjs";

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

  recordingName?: string;
  recordingGame?: number;
};

@Injectable({
  providedIn: "root",
})
export class URLParamsService {
  public current: BehaviorSubject<URLParams> = new BehaviorSubject<URLParams>(
    {}
  );

  constructor(private route: ActivatedRoute) {
    combineLatest(this.route.params, this.route.queryParamMap).subscribe(
      ([params, queryParams]) => {
        let page = queryParams.get("page");
        let pageSize = queryParams.get("pageSize");
        let versions = queryParams.getAll("versions");
        let voices = queryParams.getAll("voices");
        let npcs = queryParams.getAll("npcs");
        let guilds = queryParams.getAll("guilds");
        let scripts = queryParams.getAll("scripts");

        let type = queryParams.get("type");
        let filter = queryParams.get("filter");

        let recordingName = params["name"];
        let recordingGame = params["g"];

        let config: URLParams = {
          ...(page && { page: parseInt(page) }),
          ...(pageSize && { pageSize: parseInt(pageSize) }),
          ...(versions && { versions: versions.map((v) => parseInt(v)) }),
          ...(voices && { voices: voices.map((v) => parseInt(v)) }),
          ...(type && { type: parseInt(type) }),
          ...(filter && { filter: filter }),
          ...(npcs && { npcs: npcs.map((n) => parseInt(n)) }),
          ...(guilds && { guilds: guilds.map((g) => parseInt(g)) }),
          ...(scripts && { scripts: scripts.map((s) => parseInt(s)) }),
          ...(recordingName && { recordingName: recordingName }),
          ...(recordingGame && { recordingGame: parseInt(recordingGame) }),
        };

        this.current.next(config);
      }
    );
  }
}