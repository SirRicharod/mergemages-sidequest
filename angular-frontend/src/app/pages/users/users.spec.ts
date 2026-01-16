import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users'; // Hier stond 'Users', moet 'UsersComponent' zijn

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent] // Ook hier aanpassen naar 'UsersComponent'
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});