import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidateScoreCardTournamentPage } from './validate-score-card-tournament.page';

describe('ValidateScoreCardTournamentPage', () => {
  let component: ValidateScoreCardTournamentPage;
  let fixture: ComponentFixture<ValidateScoreCardTournamentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateScoreCardTournamentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateScoreCardTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
