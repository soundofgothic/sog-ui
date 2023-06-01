import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcComboBoxComponent } from './npc-combo-box.component';

describe('NpcComboBoxComponent', () => {
  let component: NpcComboBoxComponent;
  let fixture: ComponentFixture<NpcComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpcComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpcComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
