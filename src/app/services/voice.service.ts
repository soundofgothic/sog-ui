import { Injectable } from "@angular/core";
import { RecordingsResponse, VoicesResponse } from "./domain";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class VoiceService {
  public observedVoices: Subject<VoicesResponse> = new BehaviorSubject<any>(
    []
  );

  public loading: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  public Load() {
    this.loading.next(true);
    this.httpClient
      .get<VoicesResponse>("/voices")
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        finalize(() => this.loading.next(false))
      )
      .subscribe((data) => {
        this.observedVoices.next(data);
      });
  }
}
