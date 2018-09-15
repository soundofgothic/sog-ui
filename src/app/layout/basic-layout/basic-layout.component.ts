import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CollectorService} from '../../collector.service';


@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.css']
})
export class BasicLayoutComponent implements OnInit {

  constructor(private collectionService: CollectorService) { }

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
    this.collectionService.observedRecords.subscribe((data)=>{
      this.recordCount = (data.recordsOnPage > 0) ? data.pageNumber * data.defaultPageSize + 1 : 0;
      this.totalRecordCount = data.recordCountTotal;
      this.pageSize = data.defaultPageSize;
      this.upTo = Math.max(this.recordCount - 1 + data.recordsOnPage, 0);
      this.pageNumber = data.pageNumber;

      this.backDisplay = (this.recordCount > 1);
      this.forwardDisplay = (this.upTo < this.totalRecordCount);
      this.loading = false;
    });
  }

  search() {
    this.collectionService.getFilteredRecords(this.value);
    this.loading = true;
  }

  back() {
    this.collectionService.getFilteredRecords(this.value, this.pageNumber - 1);
    window.scrollTo(0,0);
  }

  forward() {
    this.collectionService.getFilteredRecords(this.value, this.pageNumber + 1);
    window.scrollTo(0,0);
  }



}
