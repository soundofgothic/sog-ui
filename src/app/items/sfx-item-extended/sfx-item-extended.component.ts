import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';

import {SfxItemComponent} from '../sfx-item/sfx-item.component';
import {CollectorService} from '../../services/collector.service';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {SfxService} from '../../services/sfx.service';

@Component({
  selector: 'app-sfx-item-extended',
  templateUrl: './sfx-item-extended.component.html',
  styleUrls: ['./sfx-item-extended.component.css']
})
export class SfxItemExtendedComponent extends SfxItemComponent implements OnInit {
  public allTags: any[];
  public proposedTags: any[];
  public tempAllTagList = [];

  @Input('proposedTags') proposedTagsE;
  @Input('proposedDescriptions') proposedDescriptions;

  @ViewChild('editSpanE') editSpanE: ElementRef;

  ngOnInit() {
    super.ngOnInit();
    this.sfxService.tagsList.subscribe((tags) => {
      this.allTags = tags.slice(0, tags.length - 1).filter(e => {
        if (this.tags.includes(e._id)) {
          this.tempAllTagList.push(e);
          return false;
        } else {
          return true;
        }
      });
    });
    this.editSpanE.nativeElement.addEventListener('keyup', ($event) => {
      if ($event.code === 'Enter') {
        this.tags.push(this.editSpanE.nativeElement.textContent);
        this.editSpanE.nativeElement.textContent = '';
      }
    });
    this.reportDetails = this.description;
  }

  addTag(tag) {
    this.tempAllTagList.push(tag);
    this.tags.push(tag._id);
    this.allTags = this.allTags.filter(e => e._id !== tag._id);
  }

  acceptDescription(descr) {
    this.reportDetails = descr;
  }

  acceptTag(tag, index) {
    this.proposedTagsE.splice(index, 1);
    this.tags.push(tag);
  }

  removeTag(tag) {
    let restoreTagIndex = this.tempAllTagList.findIndex((t) => t._id == tag);
    if (restoreTagIndex >= 0) {
      this.allTags.push(this.tempAllTagList[restoreTagIndex]);
      this.tempAllTagList.splice(restoreTagIndex, 1);
    }
    this.tags = this.tags.filter((t) => t !== tag);
  }

  updateSFX() {
    this.loading = true;
    this.sfxService.resolve(this.id, this.reportDetails, this.tags).subscribe(()=> {
      this.loading = false;
      this.snackBar.open('Zaaktualizowano wpis!', ':)', {duration: 3000});
    });
    this.collectorService.reloadPage();
  }

}
