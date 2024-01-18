import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FilterDescriptorComponent } from "./filter-descriptor.component";

describe("FilterDescriptorComponent", () => {
  let component: FilterDescriptorComponent;
  let fixture: ComponentFixture<FilterDescriptorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDescriptorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDescriptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
