import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.sass']
})
export class ProgressBarComponent implements OnInit {
  @Input() post?: any;
  constructor() { }

  ngOnInit() {
  }

  isBeginer(ratingValue) {
    if (ratingValue >= 1 && ratingValue <= 3) {
      return true;
    }
  }
  isIntermediate(ratingValue) {
    if (ratingValue >= 4 && ratingValue <= 7) {
      return true;
    }
  }

  isAdvanced(ratingValue) {
    if (ratingValue >= 8 && ratingValue <= 9) {
      return true;
    }
  }

  isElite(ratingValue) {
    if (ratingValue == 10) {
      return true;
    }
  }

}
