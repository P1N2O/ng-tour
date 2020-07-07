import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface TargetSize {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height?: number;
  width?: number;
  pageHeight: number;
}

@Injectable()
export class StepTargetService {
  targetExist$ = new BehaviorSubject<{stepName: string, target: Element}>(null);
  constructor() { }
  private maxHeight() {
    return Math.round(Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
      window.innerHeight
    ));
  }
  public getSizeAndPosition(el: Element) {
    const targetRect = el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const top = Math.round(targetRect.top - bodyRect.top);
    const left = Math.round(targetRect.left - bodyRect.left);
    const bottom = Math.round(targetRect.bottom - bodyRect.top);
    const right = Math.round(targetRect.left - bodyRect.left);
    const height = Math.round(targetRect.height || bottom - top);
    const width = Math.round(targetRect.width || right - left);
    const pageHeight = this.maxHeight();
    return {top, left, bottom, right, width, height, pageHeight};
  }

  public resizeTarget(target: TargetSize, size: number[]): TargetSize {
    target.left -= size[0];
    target.right += size[0];
    target.top -= size[1] || size[0];
    target.bottom += size[1] || size[0];
    target.width += 2 * size[0];
    target.height += 2 * (size[1] || size[0]);
    return target;
  }

  public getTargetSubject(): Observable<{stepName: string, target: Element}> {
      return this.targetExist$;
  }
  public setTargetSubject(value: {stepName: string, target: Element}): void {
    this.targetExist$.next(value);
  }
}
