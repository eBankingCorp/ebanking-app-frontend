import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeComponent } from './rechargetel.component';

describe('RechargeComponent', () => {
  let component: RechargeComponent;
  let fixture: ComponentFixture<RechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
