import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {CollectorService} from '../../collector.service';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../../environments/environment';
import {SfxService} from '../../sfx.service';

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

  protected editSpan: ElementRef;
  protected wasVisibleSpan = false;

  @ViewChild('editSpan') set editSpanSetter(span: ElementRef) {
    if (span) {
      this.editSpan = span;
      if (!this.wasVisibleSpan) {
        this.editSpan.nativeElement.addEventListener('keyup', ($event) => {
          if ($event.code == 'Enter') {
            this.proposedTags.push(this.editSpan.nativeElement.textContent);
            this.editSpan.nativeElement.textContent = '';
          }
        });
      }
      this.wasVisibleSpan = true;
    } else {
      this.wasVisibleSpan = false;
    }
  }

  proposedTags = [];

  reportMode = false;
  loading = false;
  reportDetails: string;
  reportSent = false;

  constructor(protected collectorService: CollectorService,
              protected sfxService: SfxService,
              @Inject(LOCAL_STORAGE) protected local_storage: any,
              protected router: Router,
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
    this.proposedTags = [];
  }

  selectTag(tagName) {
    this.collectorService.selectTag(tagName);
  }

  commitReport() {
    this.loading = true;
    this.sfxService.report(this.id, this.reportDetails, this.proposedTags).subscribe((data) => {
      this.reportMode = false;
      this.loading = false;
      this.reportSent = true;
      this.snackBar.open('Dziekuję za zgłoszenie!', ':)', {duration: 3000});
    });
  }

}
