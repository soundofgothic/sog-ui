import {WINDOW} from '@ng-toolkit/universal';
import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CollectorService, SearchType} from '../../services/collector.service';
import {UserService} from '../../access/user.service';
import {MatSnackBar} from '@angular/material';
import {SfxService} from '../../services/sfx.service';
import {combineLatest} from 'rxjs';


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
              private userService: UserService,
              private sfxService: SfxService,
              private snackbar: MatSnackBar) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.display_navigation = !e.url.startsWith('/record');
      }
    });
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

  public reportLink = false;

  public tags: any[];
  public tagsSelections: any[];

  public tagsSelectionModel: any = {};
  public displayTags: boolean;

  public sidenavToggled = false;
  public versionSelections = [];

  public display_navigation = false;
  public pageTypeList = true;

  ngOnInit() {
    this.userService.logged().then((status) => this.reportLink = status);

    combineLatest(this.collectionService.observedMetadata, this.sfxService.tagsList).subscribe(([data, tagList]) => {
      if (data) {
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
        this.displayTags = [SearchType.SFX_E, SearchType.SFX].includes(data.lastSearchType);
        this.versionSelections = data.lastVersions;
        this.value = data.lastSearchType === SearchType.SOURCE ? '' : data.filter;
        if (this.displayTags) {
          this.tags = tagList;
          this.tagsSelections = data.lastTags;
          // tagList.map(e => this.tagsSelectionModel[e._id] = {selected: data.lastTags.includes(e._id)});
        }
      }
    });
    this.sfxService.updateTagsList();
    this.router.events.subscribe(event => console.log(event));
  }

  search() {
    this.collectionService.filterText(this.value);
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

  filterTags(tags) {
    this.collectionService.filterTags(tags.selections);
  }

  filterVersions(versions) {
    this.collectionService.filterVersions(versions.selections);
  }

  onPageSizeChange($event) {
    this.collectionService.updatePageSize($event);
  }

  toggleSidePanel() {
    this.sidenavToggled = !this.sidenavToggled;
  }

}
