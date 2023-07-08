import { Component, EventEmitter, Input, Output } from "@angular/core";

type Selections = number[];
type Model = any & { id: number; displayName: string; selected: boolean };

@Component({
  selector: "app-combo-box",
  templateUrl: "./combo-box.component.html",
  styleUrls: ["./combo-box.component.css"],
})
export class ComboBoxComponent {
  @Input() items: Model[] = [];
  @Output() onSelectAction = new EventEmitter<Selections>();
  @Output() onSearchAction = new EventEmitter<string>();

  private inputTimeout: any;

  constructor() {}

  onSelect(item: Model, event: any) {
    item.selected = event.target.checked;
    const selected = this.items
      .filter((item) => item.selected)
      .map((item) => item.id);
    this.onSelectAction.emit(selected);
  }

  onSearch(event: any) {
    let value = event.target.value;
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      this.onSearchAction.emit(value);
    }, 500);
  }
}
