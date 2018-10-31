import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CollectorService} from '../../collector.service';


@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.css']
})
export class BasicLayoutComponent implements OnInit {

  constructor(private collectionService: CollectorService,
              private route: ActivatedRoute) { }

  public recordCount: number;
  public totalRecordCount: number;
  public pageSize: number;
  public upTo: number;
  public pageNumber: number;

  public backDisplay: boolean = false;
  public forwardDisplay: boolean = false;
  public value: string;
  public loading: boolean = false;
  public filesource: any = false;

  ngOnInit() {

    this.collectionService.observedMetadata.subscribe((data)=>{
      this.recordCount = data.recordCount;
      this.totalRecordCount = data.totalRecordCount;
      this.pageSize = data.pageSize;
      this.upTo = data.upToIndex;
      this.pageNumber = data.pageNumber;
      this.backDisplay = data.backOption;
      this.forwardDisplay = data.forwardOption;
      this.loading = false;
    });

    // this.collectionService.observedRecords.subscribe((data)=>{
    //   this.recordCount = (data.recordsOnPage > 0) ? data.pageNumber * data.defaultPageSize + 1 : 0;
    //   this.totalRecordCount = data.recordCountTotal;
    //   this.pageSize = data.defaultPageSize;
    //   this.upTo = Math.max(this.recordCount - 1 + data.recordsOnPage, 0);
    //   this.pageNumber = data.pageNumber;
    //
    //   this.backDisplay = (this.recordCount > 1);
    //   this.forwardDisplay = (this.upTo < this.totalRecordCount);
    //   this.loading = false;
    // });


  }

  search() {
    this.collectionService.getFilteredRecords(this.value);
    this.loading = true;
  }

  back() {
    this.loading = true;
    this.collectionService.previousPage();
    // if(this.collectionService.isSourceFiltered()) {
    //   this.collectionService.getRecordsFromSource(this.collectionService.getLastSourceSearch(), this.pageNumber - 1);
    // } else {
    //   this.collectionService.getFilteredRecords(this.value, this.pageNumber - 1);
    // }
    window.scrollTo(0,0);
  }

  forward() {
    this.loading = true;
    this.collectionService.nextPage();
    // if(this.collectionService.isSourceFiltered()) {
    //   this.collectionService.getRecordsFromSource(this.collectionService.getLastSourceSearch(), this.pageNumber + 1);
    // } else {
    //   this.collectionService.getFilteredRecords(this.value, this.pageNumber + 1);
    // }
    window.scrollTo(0,0);
  }



}
