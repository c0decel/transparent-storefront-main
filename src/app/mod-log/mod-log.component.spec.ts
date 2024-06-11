import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModLogComponent } from './mod-log.component';

describe('ModLogComponent', () => {
  let component: ModLogComponent;
  let fixture: ComponentFixture<ModLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModLogComponent]
    });
    fixture = TestBed.createComponent(ModLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
