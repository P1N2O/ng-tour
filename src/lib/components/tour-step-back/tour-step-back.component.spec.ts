import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser'
import {Component} from '@angular/core';

import {
  TourStepBackComponent,
} from '../../../public_api';

describe('TourStepBackComponent', () => {
  let component: WrapperForTestComponent;
  let fixture: ComponentFixture<WrapperForTestComponent>;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      declarations: [TourStepBackComponent, WrapperForTestComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperForTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it ('test component styles', () => {
    const backdrop = fixture.nativeElement.querySelector('.tour-step-backdrop');
    const st = window.getComputedStyle(backdrop);
    console.log(st['height'])
    const styles = fixture.debugElement.query(By.css('.tour-step-backdrop')).styles;
    //expect(backdrop).toBeDefined();
    expect(styles['opacity']).toBe(".7");
    expect(styles['height']).toBe("400px");
    expect(styles['position']).toBe("absolute");
  });
  it ('test component background', () => {
    const styles = fixture.debugElement.query(By.css('.target-window')).styles;
    // expect(styles['background']).toBe('transparent');
    // component.setBack('green');
    // sexpect(styles['background']).toBe('green');
  })
  @Component({
    selector: `wrapper-for-testing-component`,
    template: `<ng-tour-step-back 
                [themeColor]="color"
                [stepBackSize]="size"
                [position]="position"
                [targetBackground]="transparent"
                [opacity]="opacity"
              >
              </ng-tour-step-back>`
  })
  class WrapperForTestComponent {
    color = 'ffffff';
    position = 'absolute';
    back = 'transparent';
    opacity = '.7';
    size = {
      pageHeight: 400,
      top: 100,
      bottom: 150,
      left: 200,
      height: 50,
    }
    setColor(color: string): void {
      this.color = color;
    }
    setPosition(color: string): void {
      this.position = color;
    }
    setBack(color: string): void {
      this.back = color;
    }
    setOpacity(color: string): void {
      this.opacity = color;
    }
    setSize(size: any): void {
      this.size = size;
    }
  }
});
