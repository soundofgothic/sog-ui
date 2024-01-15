import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";

@Component({
  selector: "app-versions-combo-box",
  templateUrl: "./versions-combo-box.component.html",
  styleUrls: ["./versions-combo-box.component.css"],
})
export class VersionsComboBoxComponent implements OnChanges {
  @Input("selections") selections;
  @Output() onSelectAction = new EventEmitter<any>();
  protected selectionModel = [
    { selected: true },
    { selected: true },
    { selected: true },
  ];
  public versions = [0, 1];
  public romaNumerals = ["I", "II"];
  constructor() {}

  ngOnChanges() {
    for (let key in this.selectionModel) {
      this.selectionModel[key].selected = false;
    }
    if (this.selections && this.selections.length > 0) {
      this.setSelections(this.selections);
    }
  }

  setSelections(sels) {
    for (let sel of sels.map((s) => parseInt(s) - 1)) {
      this.selectionModel[sel] = { selected: true };
    }
  }

  getSelections() {
    return Object.keys(this.selectionModel)
      .filter((item) => this.selectionModel[item].selected)
      .map((v) => parseInt(v) + 1);
  }

  onSelect(item) {
    this.onSelectAction.emit({
      lastSelectedItem: item,
      selections: this.getSelections(),
    });
  }
}
