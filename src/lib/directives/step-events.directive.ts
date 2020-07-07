import {
    Directive,
    Input,
    Output,
    EventEmitter,
    OnInit,
    Inject,
    PLATFORM_ID,
    HostListener
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {TourService} from '../services/tour.service';
// @dynamic
@Directive({
    selector: '[stepEvent]',
})
export class StepEventsDirective implements OnInit {
    @Input('stepEvent') eventType: string; // possible values 'next', 'prev', 'close'
    isBrowser: boolean;

    @Output() next: EventEmitter<{[propName: string]: any}> = new EventEmitter();
    @Output() prev: EventEmitter<any> = new EventEmitter();
    @Output() done: EventEmitter<any> = new EventEmitter();
    @Output() break: EventEmitter<any> = new EventEmitter();
    handler: () => void;
    constructor(
        private readonly tourService: TourService,
        // @dynamic
        @Inject(PLATFORM_ID) platformId: {}) {
        this.isBrowser = isPlatformBrowser(platformId);
    }
    ngOnInit() {
        if (!this.isBrowser) {
            return;
        }
        if (this.eventType === 'next') {
           this.handleNext();
        }
        if (this.eventType === 'prev') {
            this.handlePrev();
        }
        if (this.eventType === 'close') {
            this.handleClose();
        }
    }
    @HostListener('click', ['$event']) onClick(event: Event) {
        this.handler();
    }
    handleNext() {
        return this.handler = () => {
            this.next.emit({
                tourEvent: 'next',
                index: this.tourService.getLastStep().index + 1,
                history: this.tourService.getHistory()
            });
            this.tourService.nextStep();
        };
    }
    handlePrev() {
        return this.handler = () => {
            this.prev.emit({
                tourEvent: 'next',
                index: this.tourService.getLastStep().index - 1,
                history: this.tourService.getHistory()
            });
            this.tourService.prevStep();
        };
    }
    handleClose() {
        return this.handler = () => {
            if (this.tourService.getLastStep().index + 1 === this.tourService.getLastStep().total) {
                this.done.emit({
                    tourEvent: 'done',
                    index: this.tourService.getLastStep().index,
                    history: this.tourService.getHistory()
                });
            } else {
                this.break.emit({
                    tourEvent: 'break',
                    index: this.tourService.getLastStep().index,
                    history: this.tourService.getHistory()
                });
            }
            this.tourService.stopTour();
        };
    }
}
