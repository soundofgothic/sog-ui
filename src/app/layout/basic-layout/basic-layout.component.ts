import {WINDOW} from '@ng-toolkit/universal';
import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectorService, SearchType, componentTypeResolver} from '../../collector.service';
import {UserService} from '../../access/user.service';


@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.css']
})
export class BasicLayoutComponent implements OnInit, AfterViewChecked {

  constructor(@Inject(WINDOW) private window: Window, private collectionService: CollectorService,
              private route: ActivatedRoute,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private userService: UserService) {
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
  public filter: string;
  public lastSearchType: string;

  public pageSizeOptions: number[] = [10, 50, 100];
  public pageSizeSelected: number;

  ngOnInit() {
    this.collectionService.observedMetadata.subscribe((data) => {
      this.recordCount = data.recordCount;
      this.totalRecordCount = data.totalRecordCount;
      this.pageSize = data.pageSize;
      this.upTo = data.upToIndex;
      this.pageNumber = data.pageNumber;
      this.backDisplay = data.backOption;
      this.forwardDisplay = data.forwardOption;
      this.pageSizeSelected = data.pageSize;
      this.filter = data.filter;
      this.lastSearchType = data.lastSearchType;
    });
  }

  search() {
    let activeUrl = this.router.url.split(/[/,\?]+/)[1];
    let type = activeUrl == 'text' || activeUrl === '' ? SearchType.TEXT : SearchType.REPORT;
    let queryParams: any = {
      filter: this.value,
      page: 0,
      type: type
    };

    if (this.pageSizeSelected) {
      queryParams.pageSize = this.pageSizeSelected;
    }

    this.router.navigate([componentTypeResolver[type]], {
      queryParams: queryParams
    });
  }

  ngAfterViewChecked(): void {
    this.collectionService.loading.subscribe(status => this.loading = status);
    this.cdRef.detectChanges();
  }

  back() {
    this.collectionService.previousPage();
    this.window.scrollTo(0, 0);
  }

  forward() {
    this.collectionService.nextPage();
    this.window.scrollTo(0, 0);
  }

  onPageSizeChange($event) {
    this.collectionService.updatePageSize($event);
  }
}
