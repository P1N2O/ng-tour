import { Injectable, isDevMode, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

import { StepTargetService } from "./step-target.service";

export interface Tour {
  steps: TourStep[];
  tourOptions?: StepOptions;
  withoutLogs?: boolean;
  tourEvents?: TourEvents;
  ctrlBtns?: CtrlBtns;
}

export interface TourStep {
  stepName: string;
  route?: string;
  index?: number;
  title?: string | { [propName: string]: any };
  description?: string | { [propName: string]: any };
  options?: StepOptions;
  ctrlBtns?: CtrlBtns;
  [propName: string]: any;
}

export interface CtrlBtns {
  prev?: { [propsName: string]: any };
  next?: { [propsName: string]: any };
  done?: { [propsName: string]: any };
  [propsName: string]: any;
}

// export const defaultInternalization = {
//   "en": {
//     "done": "done",
//     "prev": "prev",
//     "next": "next",
//     "of": "of"
//   },
//   "fr": {
//     "done": "fini",
//     "prev": "préc",
//     "next": "proch",
//     "of": "de"
//   },
//   "ru": {
//     "done": "закр",
//     "prev": "пред",
//     "next": "след",
//     "of": "из"
//   }
// }

export const defaultTranslation = {
  done: {
    "en-EN": "done",
    "ru-RU": "закр",
    "fr-FR": "fini",
  },
  prev: {
    "en-EN": "prev",
    "ru-RU": "пред",
    "fr-FR": "préc",
  },
  next: {
    "en-EN": "next",
    "ru-RU": "след",
    "fr-FR": "proch",
  },
  of: {
    "en-EN": "of",
    "fr-FR": "de",
    "ru-RU": "из",
  },
};

export const defaultOptions: StepOptions = {
  className: "",
  continueIfTargetAbsent: true,
  withoutCounter: false,
  withoutPrev: false,
  customTemplate: false,
  smoothScroll: false,
  scrollTo: true,
  themeColor: "rgb(20, 60, 60)",
  opacity: 0.7,
  placement: "down",
  arrowToTarget: true,
  stepTargetResize: [0],
  delay: 1000,
  animatedStep: true,
  fixed: false,
  backdrop: true,
  minWidth: "250px",
  minHeight: "150px",
  maxWidth: "400px",
  maxHeight: "600px",
  autofocus: true,
  closeOnClickOutside: false,
};

export class StepOptions {
  className?: string;
  withoutCounter?: boolean;
  withoutPrev?: boolean;
  customTemplate?: boolean;
  themeColor?: string;
  opacity?: number;
  placement?: string;
  arrowToTarget?: boolean;
  backdrop?: boolean;
  animatedStep?: boolean;
  smoothScroll?: boolean;
  scrollTo?: boolean;
  continueIfTargetAbsent?: boolean;
  stepTargetResize?: number[];
  delay?: number;
  fixed?: boolean;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  autofocus?: boolean;
  closeOnClickOutside?: boolean;
  constructor(options = defaultOptions) {
    const {
      className,
      continueIfTargetAbsent,
      withoutCounter,
      withoutPrev,
      customTemplate,
      smoothScroll,
      scrollTo,
      themeColor,
      opacity,
      placement,
      arrowToTarget,
      stepTargetResize,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      delay,
      animatedStep,
      fixed,
      backdrop,
      autofocus,
      closeOnClickOutside,
    } = options;
    this.className = className;
    this.placement = placement;
    this.arrowToTarget = arrowToTarget;
    this.themeColor = themeColor;
    this.opacity = opacity;
    this.backdrop = backdrop;
    this.customTemplate = customTemplate;
    this.withoutCounter = withoutCounter;
    this.withoutPrev = withoutPrev;
    this.continueIfTargetAbsent = continueIfTargetAbsent;
    this.stepTargetResize = stepTargetResize;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.minWidth = minWidth;
    this.delay = delay;
    this.animatedStep = animatedStep;
    this.smoothScroll = smoothScroll;
    this.scrollTo = scrollTo;
    this.fixed = fixed;
    this.autofocus = autofocus;
    this.closeOnClickOutside = closeOnClickOutside;
  }
}

export type TourEvent = (props: {
  tourEvent: string;
  step?: number | string;
  history?: number[];
  tour?: Tour;
}) => void;

export interface TourEvents {
  tourStart?: TourEvent;
  tourEnd?: TourEvent;
  tourBreak?: TourEvent;
  next?: TourEvent;
  prev?: TourEvent;
}

export const defaultTourEvent: TourEvent = (props) => {};

export const TourDefaultEvents = {
  tourStart: defaultTourEvent,
  tourEnd: defaultTourEvent,
  tourBreak: defaultTourEvent,
  next: defaultTourEvent,
  prev: defaultTourEvent,
};

// @dynamic
@Injectable()
export class TourService {
  private steps: TourStep[];
  private tourStarted = false;
  private stepsStream$ = new BehaviorSubject<any>(null);
  private history = [];
  private routeChanged = false;
  private presets: { [propName: string]: any };
  // private tourStart = TourDefaultEvents.tourStart;
  private tourBreak = TourDefaultEvents.tourBreak;
  private tourEnd = TourDefaultEvents.tourEnd;
  private next = TourDefaultEvents.next;
  private prev = TourDefaultEvents.prev;
  private isBrowser: boolean;
  private lang: string;
  constructor(
    private router: Router,
    private readonly targetService: StepTargetService,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}
  ) {
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.stopTour = this.stopTour.bind(this);
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.lang = navigator.language;
    } else {
      this.lang = "";
    }
  }
  private validateTour(tour: Tour): void | never {
    this.validateOptions(tour);
  }

  private validateOptions(tour: Tour): void | never {
    const regExpr = /^top$|^down$|^left$|^right$|^center$|^right-center$|^left-center$|^right-top$|^left-top$/i;
    let isValid = true;
    tour.steps.forEach((step: TourStep) => {
      if (step.options && step.options.placement) {
        isValid = regExpr.test(step.options.placement);
      }
    });
    if (tour.tourOptions && tour.tourOptions.placement) {
      isValid = regExpr.test(tour.tourOptions.placement);
    }
    if (!isValid) {
      throw Error(
        "Placement option of the ng-tour or one of it step is invalid"
      );
    }
  }

  private setSteps(tour: Tour): void {
    const options = new StepOptions({
      ...defaultOptions,
      ...this.presets,
      ...tour.tourOptions,
    });
    this.steps = tour.steps.map((x, i) => {
      x.index = i;
      if (x.description && typeof x.description === "object") {
        x.description = this.defineLocalName(x.description);
      }
      if (x.title && typeof x.title === "object") {
        x.title = this.defineLocalName(x.title);
      }
      x.options = x.options ? { ...options, ...x.options } : options;
      x.total = tour.steps.length;
      x.ctrlBtns = this.defineDefaultNames(tour.ctrlBtns || defaultTranslation);
      return x;
    });
    if (isDevMode()) {
      console.log("Development Mode: ", isDevMode());
      console.log("ng-tour is initiated with steps:");
      console.log(this.steps);
    }
  }

  private defineLocalName(obj: any): string {
    let result: string;
    if (!this.isBrowser) {
      return "";
    }
    if (obj.hasOwnProperty(this.lang)) {
      result = obj[this.lang];
    } else {
      const setLanguages = Object.keys(obj);
      const ralatedLang = setLanguages.filter((l) =>
        l.includes(this.lang.slice(0, 2))
      )[0];
      if (ralatedLang) {
        result = obj[ralatedLang];
      } else {
        result = obj[setLanguages[0]];
      }
    }
    if (typeof result === "string") {
      return result;
    }
    console.error(`Tour configuration error with ${JSON.stringify(obj)}`);
    return "Error";
  }

  private defineDefaultNames(btns: CtrlBtns): CtrlBtns {
    const btnCtrls = {};
    for (let prop in btns) {
      if (btns.hasOwnProperty(prop)) {
        let result: string;
        if (typeof btns[prop] === "string") {
          result = btns[prop];
        } else if (
          typeof btns[prop] === "object" &&
          btns[prop][this.lang] === "string"
        ) {
          result = btns[prop][this.lang];
        } else {
          const setLanguages = Object.keys(btns[prop]);
          const ralatedLang = setLanguages.filter((l) =>
            l.includes(this.lang.slice(0, 2))
          )[0];
          if (ralatedLang) {
            result = btns[prop][ralatedLang];
          } else {
            result = btns[prop][setLanguages[0]];
          }
          if (typeof result === "string") {
            btnCtrls[prop] = result;
          } else if (this.isBrowser) {
            console.error(
              `Tour configuration error with ${JSON.stringify(btns)}`
            );
            btnCtrls[prop] = "Error";
          }
        }
      }
    }
    return btnCtrls;
  }

  private initStep(step: number): void {
    const previousStep = this.history.length
      ? this.getLastStep()
      : { route: null };
    const newtStep = this.steps[step];
    this.routeChanged = previousStep.route !== newtStep.route;
    this.history.push(step);
    if (newtStep.route && this.routeChanged) {
      this.router.navigate([newtStep.route]);
    }
    this.stepsStream$.next(newtStep.stepName);
  }

  public getHistory() {
    return this.history;
  }
  public setPresets(presets: { customTemplate: boolean }): void {
    this.presets = { ...presets };
  }
  public resetStep(stepName: string | number, step: TourStep) {
    const index =
      typeof stepName === "number"
        ? stepName
        : this.getStepByName(stepName).index;
    this.steps[index] = { ...step };
  }
  public getStepByName(stepName: string): TourStep {
    return this.steps.filter((step) => step.stepName === stepName)[0];
  }
  public getStepByIndex(index = 0): TourStep {
    return this.steps[index];
  }
  public getLastStep(): TourStep {
    if (this.history.length) return this.steps[this.history.slice(-1)[0]];
    return null;
  }
  public getStepsStream(): Observable<string> {
    return this.stepsStream$;
  }
  public isRouteChanged() {
    return this.routeChanged;
  }
  private setTourStatus(status: boolean): void {
    this.tourStarted = status;
  }
  public getTourStatus() {
    return this.tourStarted;
  }
  public startTour(tour: Tour): void {
    this.validateTour(tour);
    const { tourBreak, tourStart, tourEnd, next, prev } = {
      ...TourDefaultEvents,
      ...tour.tourEvents,
    };
    tourStart({ tourEvent: "Tour start", tour });
    this.tourBreak = tourBreak;
    this.tourEnd = tourEnd;
    this.next = next;
    this.prev = prev;
    this.setSteps(tour);
    this.initStep(0);
    this.setTourStatus(true);
  }
  public stopTour() {
    const index = this.getLastStep().index;
    const latestStepIndex = this.steps.length - 1;
    if (index < latestStepIndex) {
      this.tourBreak({
        tourEvent: "Tour break",
        step: index,
        history: this.history,
      });
    } else if (latestStepIndex === index) {
      this.tourEnd({
        tourEvent: "Tour end",
        step: index,
        history: this.history,
      });
    }
    this.setTourStatus(false);
    this.steps.length = 0;
    this.stepsStream$.next(null);
    this.history.length = 0;
    this.targetService.setTargetSubject(null);
  }
  public nextStep() {
    const step = this.getLastStep().index + 1;
    this.next({ tourEvent: "Init next", step, history: this.history });
    this.initStep(step);
  }
  public prevStep() {
    const step = this.getLastStep().index - 1;
    this.prev({ tourEvent: "Init prev", step, history: this.history });
    this.initStep(step);
  }
}
