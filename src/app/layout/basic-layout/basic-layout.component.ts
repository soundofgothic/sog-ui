import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectorService, SearchType} from '../../collector.service';


@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.css']
})
export class BasicLayoutComponent implements OnInit, AfterViewChecked {

  constructor(private collectionService: CollectorService,
              private route: ActivatedRoute,
              private router: Router,
              private cdRef: ChangeDetectorRef) {
  }

  public recordCount: number;
  public totalRecordCount: number;
  public pageSize: number;
  public upTo: number;
  public pageNumber: number;

  public backDisplay: boolean = false;
  public forwardDisplay: boolean = false;
  public value: string;
  public loading: boolean = false;

  ngOnInit() {
    this.collectionService.observedMetadata.subscribe((data) => {
      this.recordCount = data.recordCount;
      this.totalRecordCount = data.totalRecordCount;
      this.pageSize = data.pageSize;
      this.upTo = data.upToIndex;
      this.pageNumber = data.pageNumber;
      this.backDisplay = data.backOption;
      this.forwardDisplay = data.forwardOption;
    });
  }
  search() {
    this.router.navigate(['text'], {
      queryParams: {
        filter: this.value,
        page: 0,
        type: SearchType.TEXT
      }
    });
  }

  ngAfterViewChecked(): void {
    this.collectionService.loading.subscribe(status => this.loading = status);
    this.cdRef.detectChanges();

  }

  back() {
    this.collectionService.previousPage();
    window.scrollTo(0, 0);
  }

  forward() {
    this.collectionService.nextPage();
    window.scrollTo(0, 0);
  }
}
