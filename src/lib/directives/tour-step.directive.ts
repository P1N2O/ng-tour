import {
  Directive,
  Input,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  ElementRef,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

import { StepTargetService } from "../services/step-target.service";
import { TourService } from "../services/tour.service";

// @dynamic
@Directive({
  selector: "[ngTour]",
})
export class TourStepDirective implements AfterViewInit, OnDestroy {
  @Input("ngTour") name: string;
  private readonly onDestroy = new Subject<any>();
  subscription: Subscription;
  isBrowser: boolean;
  timeout: any;
  constructor(
    private elemRef: ElementRef,
    private readonly tour: TourService,
    private readonly stepTarget: StepTargetService,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }
    this.tour
      .getStepsStream()
      .pipe(
        takeUntil(this.onDestroy),
        map((stepName: string) => {
          if (!stepName || this.name !== stepName) {
            return stepName;
          } else {
            const target = this.elemRef.nativeElement;
            const delay = this.tour.isRouteChanged()
              ? this.tour.getStepByName(stepName).options.delay
              : 0;
            this.timeout = setTimeout(
              () => this.stepTarget.setTargetSubject({ target, stepName }),
              delay
            );
            return stepName;
          }
        })
      )
      .subscribe();
  }
  ngOnDestroy() {
    this.onDestroy.next();
    clearTimeout(this.timeout);
  }
}
