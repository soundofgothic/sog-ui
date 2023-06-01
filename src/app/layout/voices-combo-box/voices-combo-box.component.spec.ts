import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicesComboBoxComponent } from './voices-combo-box.component';

describe('VoicesComboBoxComponent', () => {
  let component: VoicesComboBoxComponent;
  let fixture: ComponentFixture<VoicesComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicesComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicesComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
