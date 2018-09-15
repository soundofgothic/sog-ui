import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() filename: String;
  @Input() text: String;

  constructor() { }

  ngOnInit() {

  }

  parseFilename(filename: String): String {
    filename = filename.toUpperCase() + ".WAV";
    return "assets/gsounds/" + filename;
  }



}
