import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { Router, RouterModule } from "@angular/router";
import { PLATFORM_ID, Inject } from "@angular/core";

import {
  TourService,
  TourStepComponent,
  StepTargetService,
  AngularTourModule,
} from "../../public_api";

describe("TourStepComponent", () => {
  let component: TourStepComponent;
  let fixture: ComponentFixture<TourStepComponent>;
  let tour: TourService = null;
  let router: Router;
  let target: StepTargetService;
  const stepsStream$ = new BehaviorSubject<any>("first");
  const dummyApp = document.createElement("div");
  dummyApp.setAttribute("ngTour", "first");

  beforeEach(async(() => {
    tour = new TourService(router, target, PLATFORM_ID);
    target = new StepTargetService();
    // console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', Element);
    TestBed.configureTestingModule({
      imports: [AngularTourModule, RouterModule],
      // declarations: [TourStepComponent],
      providers: [
        { provide: TourService, useValue: tour },
        { provide: StepTargetService, useValue: target },
      ],
      schemas: [],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TourStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    const userService = fixture.debugElement.injector.get(TourService);
    const usService = TestBed.get(TourService);
  });
  it("simple test", () => {
    expect(true).toBe(true);
  });
});
