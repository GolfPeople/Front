import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayersGroupReadOnlyComponent } from './players-group-read-only.component';

describe('PlayersGroupReadOnlyComponent', () => {
  let component: PlayersGroupReadOnlyComponent;
  let fixture: ComponentFixture<PlayersGroupReadOnlyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersGroupReadOnlyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersGroupReadOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
