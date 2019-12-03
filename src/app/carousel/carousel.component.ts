import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass']
})
export class CarouselComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {
   }

  ngOnChanges() {
  }

  ngOnInit() {
    $('.carousel').carousel({ interval: 3000 }); 
    $('.carousel').carousel('cycle');
  }
  
  ngOnDestroy() {
  }
}
