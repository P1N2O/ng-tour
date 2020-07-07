import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {TourStepComponent} from './components/tour-step.component';
import {TourStepBackComponent} from './components/tour-step-back/tour-step-back.component';
import {TourStepDirective} from './directives/tour-step.directive';
import {TourRootDirective} from './directives/tour-root.directive';
import {StepTargetService} from './services/step-target.service';
import {TourService} from './services/tour.service';
import {StepEventsDirective} from './directives/step-events.directive';

// @dynamic
@NgModule({
  declarations: [
    TourStepBackComponent,
    TourStepComponent,
    TourStepDirective,
    TourRootDirective,
    StepEventsDirective,
  ],
  entryComponents: [TourStepComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    TourStepBackComponent,
    TourStepComponent,
    TourStepDirective,
    TourRootDirective,
    StepEventsDirective,
  ]
})
export class AngularTourModule {
  static forRoot(): ModuleWithProviders<AngularTourModule> {
    return {
      ngModule: AngularTourModule,
      providers: [
          StepTargetService,
          TourService
      ]
    };
  }
  static forChild(): ModuleWithProviders<AngularTourModule> {
    return {
        ngModule: AngularTourModule,
        providers: []
    };
  }
}
