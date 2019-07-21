import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-versions-combo-box',
  templateUrl: './versions-combo-box.component.html',
  styleUrls: ['./versions-combo-box.component.css']
})
export class VersionsComboBoxComponent implements OnInit, OnChanges {

  @Input('selections') selections;
  @Output() onSelectAction = new EventEmitter<any>();
  protected selectionModel = [];
  public versions = [0, 1, 2];
  public romaNumerals = ['I', 'II', 'III'];
  constructor() { }

  ngOnInit() {
    for(let v of this.versions) {
      this.selectionModel.push({selected: true});
    }
  }

  ngOnChanges() {
    for(let key in this.selectionModel) {
      this.selectionModel[key].selected = false;
    }
    if(this.selections && this.selections.length > 0) {
      this.setSelections(this.selections);
    }
  }

  setSelections(sels) {
    for(let sel of sels.map(s => parseInt(s) - 1)) {
      this.selectionModel[sel].selected = true;
    }
  }

  getSelections() {
    return Object.keys(this.selectionModel).filter(item => this.selectionModel[item].selected).map(v => parseInt(v) + 1);
  }

  onSelect(item) {
    this.onSelectAction.emit({lastSelectedItem: item, selections: this.getSelections()});
  }
}
