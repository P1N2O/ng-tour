import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ng-tour-step-back',
  templateUrl: './tour-step-back.component.html',
  styleUrls: ['./tour-step-back.component.scss'],
})
export class TourStepBackComponent implements OnInit {
  @Input() themeColor: string;
  @Input() stepBackSize: {[propName: string]: any};
  @Input() position: string;
  @Input() opacity: number;
  @Input() targetBackground: string;

  constructor() { }

  ngOnInit() {
  }
}
