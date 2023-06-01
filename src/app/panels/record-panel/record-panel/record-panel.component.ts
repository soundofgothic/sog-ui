import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Subscription} from 'rxjs';
import {CollectorService, componentTypeResolver, SearchType} from '../../../services/collector.service';
import {environment} from '../../../../environments/environment';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';
import { Recording } from 'src/app/services/domain';


@Component({
  selector: 'app-record-panel',
  templateUrl: './record-panel.component.html',
  styleUrls: ['./record-panel.component.css']
})
export class RecordPanelComponent implements OnInit, OnDestroy {

  private subs: Array<Subscription> = [];
  public name: string;
  public g: number;
  public record: Recording;
  public recordLoading: boolean;

  public records: any;
  public loading: boolean;

  public page = 0;
  public backDisplay = false;
  public forwardDisplay = false;
  public recordCount: number;
  public totalRecordCount: number;
  public upTo: number;
  public pageSizeSelected: number;
  public pageSizeOptions: number[] = [10, 50, 100];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private collectorService: CollectorService,
              private meta: Meta,
              private title: Title
  ) {
  }

  ngOnInit() {
    this.collectorService.recordLoading.subscribe(v => this.recordLoading = v);
    this.collectorService.observedRecords.subscribe((data) => {
      this.records = data.results;
    });
    this.collectorService.loading.pipe(first()).subscribe(v => this.loading = v);
    this.subs.push(combineLatest(this.route.params, this.route.queryParamMap).subscribe(([params, queryParams]) => {
      this.name = params['name'];
      this.g = +params['g'];
      this.subs.push(
        this.collectorService.record.pipe(first()).subscribe(v => {
          this.record = v;
          if (v) {

            this.meta.updateTag({
              name: 'description', content: this.record.transcript
            });

            this.meta.addTag({
              property: 'og:description', content: this.record.transcript
            });

            this.meta.addTag({
              property: 'og:title', content: this.record.transcript
            });

            this.title.setTitle(this.record.transcript);
          }
          // tslint:disable-next-line:no-unused-expression
          const metadata = this.collectorService.observedMetadata.getValue();

          if (this.g < 3 && this.record && (!metadata || (metadata.lastSearchType !== SearchType.SOURCE || metadata.filter !== this.record.sourceFile.name || metadata.pageNumber !== this.page || metadata.pageSize !== 10))) {
            this.page = 0;
            this.collectorService.getFilteredRecords({
              filter: this.record.sourceFile.name,
              type: SearchType.SOURCE,
              page: this.page,
              pageSize: 10,
            });
          }
        }),
      );
      this.collectorService.getGNameRecord(this.g, this.name);
    }));

    this.collectorService.observedMetadata.subscribe(data => {
      if (data) {
        this.recordCount = data.recordCount;
        this.totalRecordCount = data.totalRecordCount;
        this.upTo = data.upToIndex;
        this.page = data.pageNumber;
        this.backDisplay = data.backOption;
        this.forwardDisplay = data.forwardOption;
        this.pageSizeSelected = data.pageSize;
      }
    });

    this.collectorService.setRecordMode(true);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.collectorService.setRecordMode(false);
  }

  back() {
    this.collectorService.previousPage();
  }

  forward() {
    this.collectorService.nextPage();
  }

  onPageSizeChange(pageSize) {
    this.page = Math.floor(this.page * this.pageSizeSelected / pageSize);
    this.pageSizeSelected = pageSize;
    this.collectorService.getFilteredRecords({
      filter: this.record.sourceFile.name,
      type: SearchType.SOURCE,
      page: this.page,
      pageSize: pageSize,
    });
  }

  filename(): String {
    if (this.record.gameID) {
      let filename = this.record.sourceFile.name;
      if (+this.record.gameID < 3) {
        filename = filename.toUpperCase() + '.WAV';
        return environment.soundsAssetsUrl + '/assets/gsounds/' + filename;
      } else {
        return environment.soundsAssetsUrl + '/assets/g3sounds/' + filename;
      }
    }
  }

  share() {
    window.prompt("Skopiuj do schowka: Ctrl+C, Enter", window.location.href);
  }

}
