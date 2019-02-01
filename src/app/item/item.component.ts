import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {CollectorService, SearchType} from '../collector.service';
import {Router} from '@angular/router';


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

  constructor(private collectorService: CollectorService, private router: Router) {
  }

  ngOnInit() {

  }

  parseFilename(filename: String): String {
    filename = filename.toUpperCase() + '.WAV';
    return environment.soundsAssetsUrl + '/assets/gsounds/' + filename;
  }

  searchBySource() {
    this.collectorService.searchBySource(this.filesource);
  }

}
