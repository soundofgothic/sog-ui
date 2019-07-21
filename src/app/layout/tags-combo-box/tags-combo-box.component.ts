import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-combo-box-list',
  templateUrl: './tags-combo-box.component.html',
  styleUrls: ['./tags-combo-box.component.css']
})

export class TagsComboBoxComponent implements OnInit, OnChanges {
  @Input('tags') tags;
  @Input('selections') selections;
  @Output() onSelectAction = new EventEmitter<any>();
  protected selectionModel: any = {};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if(this.tags && this.selections && this.tags.length > 0) {
      for(let tag of this.tags) {
        this.selectionModel[tag._id] = {selected: false};
      }
      this.setSelections(this.selections);
    }
  }

  setSelections(tags) {
    for(let tag of tags) {
      this.selectionModel[tag].selected = true;
    }
  }

  getSelections() {
    return Object.keys(this.selectionModel).filter(item => this.selectionModel[item].selected);
  }

  onSelect(tag) {
    this.onSelectAction.emit({lastSelectedTag: tag, selections: this.getSelections()});
  }

}
