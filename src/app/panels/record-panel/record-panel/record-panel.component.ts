import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Subscription} from 'rxjs';
import {CollectorService, componentTypeResolver, SearchType} from '../../../services/collector.service';
import {environment} from '../../../../environments/environment';
import {first} from 'rxjs/operators';
import {Meta, Title} from '@angular/platform-browser';


@Component({
  selector: 'app-record-panel',
  templateUrl: './record-panel.component.html',
  styleUrls: ['./record-panel.component.css']
})
export class RecordPanelComponent implements OnInit, OnDestroy {

  private subs: Array<Subscription> = [];
  public name: string;
  public g: number;
  public record: any;
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
              private collectorService: CollectorService,
              private meta: Meta,
              private title: Title
  ) {
  }

  ngOnInit() {
    this.collectorService.recordLoading.subscribe(v => this.recordLoading = v);
    this.collectorService.observedRecords.subscribe((data) => {
      this.records = data.records;
    });
    this.collectorService.loading.pipe(first()).subscribe(v => this.loading = v);
    this.subs.push(combineLatest(this.route.params, this.route.queryParamMap).subscribe(([params, queryParams]) => {
      this.name = params['name'];
      this.g = +params['g'];
      this.subs.push(
        this.collectorService.record.pipe(first()).subscribe(v => {
          this.record = v;
          if (v) {
            this.meta.addTag({
              name: 'description', content: this.record.text
            });
            this.title.setTitle(this.record.text);
          }
          // tslint:disable-next-line:no-unused-expression
          const metadata = this.collectorService.observedMetadata.getValue();

          if (this.g < 3 && this.record && (!metadata || (metadata.lastSearchType !== SearchType.SOURCE || metadata.filter !== this.record.source || metadata.pageNumber !== this.page || metadata.pageSize !== 10))) {
            this.page = 0;
            this.collectorService.getFilteredRecords({
              filter: this.record.source,
              type: SearchType.SOURCE,
              page: this.page,
              pageSize: 10,
              versions: [this.g],
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
      filter: this.record.source,
      type: SearchType.SOURCE,
      page: this.page,
      pageSize: pageSize,
      versions: [this.g]
    });
  }

  filename(): String {
    if (this.record.g) {
      let filename = this.record.filename;
      if (+this.record.g < 3) {
        filename = filename.toUpperCase() + '.WAV';
        return environment.soundsAssetsUrl + '/assets/gsounds/' + filename;
      } else {
        return environment.soundsAssetsUrl + '/assets/g3sounds/' + filename;
      }
    }
  }

}
