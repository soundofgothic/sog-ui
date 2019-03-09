import {Component, Inject, Input, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {CollectorService, SearchType} from '../collector.service';
import {Router} from '@angular/router';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() filename: string;
  @Input() text: string;
  @Input() filesource: string;
  @Input() version: any;
  @Input() id: string;

  reportMode = false;
  loading = false;
  reportDetails: string;
  reportSent = false;

  constructor(private collectorService: CollectorService, @Inject(LOCAL_STORAGE) private local_storage: any, private router: Router) {
  }

  ngOnInit() {
    if (this.local_storage[this.id] == 'reported') {
      this.reportSent = true;
    }
  }

  parseFilename(filename: String): String {
    filename = filename.toUpperCase() + '.WAV';
    return environment.soundsAssetsUrl + '/assets/gsounds/' + filename;
  }

  searchBySource() {
    this.collectorService.searchBySource(this.filesource);
  }

  openReport() {
    this.reportMode = !this.reportMode;
  }

  commitReport() {
    this.loading = true;
    this.collectorService.reportRecord(this.id, this.reportDetails).subscribe((data) => {
      this.reportMode = false;
      this.loading = false;
      this.reportSent = true;
    });
  }

}
