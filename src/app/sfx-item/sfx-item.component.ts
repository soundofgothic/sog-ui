import {Component, Inject, Input, OnInit} from '@angular/core';
import {CollectorService} from '../collector.service';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-sfx-item',
  templateUrl: './sfx-item.component.html',
  styleUrls: ['./sfx-item.component.css']
})
export class SfxItemComponent implements OnInit {

  @Input() filename: string;
  @Input() description: string;
  @Input() version: any;
  @Input() id: string;
  @Input() tags: string[];

  reportMode = false;
  loading = false;
  reportDetails: string;
  reportSent = false;

  constructor(protected collectorService: CollectorService,
              @Inject(LOCAL_STORAGE) private local_storage: any,
              private router: Router,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.filename = this.filename.split('.')[0];
    if (this.local_storage[this.id] == 'reported') {
      // this.reportSent = true;
    }
  }

  parseFilename(filename: String): String {
    return environment.soundsAssetsUrl + '/assets/sfx/g' + this.version.toString() + '/' + filename + '.WAV';
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
      this.snackBar.open('Dziekuję za zgłoszenie!', ':)', {duration: 3000});
    });
  }

}
