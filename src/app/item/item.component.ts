import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() filename: String;
  @Input() text: String;
  @Input() filesource: String;
  @Input() version: any;

  constructor() {
  }

  ngOnInit() {

  }

  parseFilename(filename: String): String {
    filename = filename.toUpperCase() + '.WAV';
    return environment.soundsAssetsUrl + '/assets/gsounds/' + filename;
  }


}
