import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, debounceTime, fromEvent } from 'rxjs';


interface IResultImage {
  img: string;
  alt: string;
}

@Component({
  selector: 'app-landing-carousel',
  templateUrl: './landing-carousel.component.html',
  styleUrls: ['./landing-carousel.component.css']
})
export class LandingCarouselComponent implements OnInit {
	@ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  results : IResultImage[] = [
    { img: "../../../../../assets/images/carousel/results-1-before.jpg", alt: "Selfy photo of Jochum Strength trainee before training." },
    { img: "../../../../../assets/images/carousel/results-1-after.jpg", alt: "Selfy photo of Jochum Strength trainee after training." },
    { img: "../../../../../assets/images/carousel/results-2-before.jpg", alt: "Selfy photo of Jochum Strength trainee before training." },
    { img: "../../../../../assets/images/carousel/results-2-after.jpg", alt: "Selfy photo of Jochum Strength trainee after training." },
    { img: "../../../../../assets/images/carousel/results-3-before.jpg", alt: "Selfy photo of Jochum Strength trainee before training." },
    { img: "../../../../../assets/images/carousel/results-3-after.jpg", alt: "Selfy photo of Jochum Strength trainee after training." },
    { img: "../../../../../assets/images/carousel/results-4-before.jpg", alt: "Selfy photo of Jochum Strength trainee before training." },
    { img: "../../../../../assets/images/carousel/results-4-after.jpg", alt: "Selfy photo of Jochum Strength trainee after training." },
    { img: "../../../../../assets/images/carousel/results-5-before.jpg", alt: "Selfy photo of Jochum Strength trainee before training." },
    { img: "../../../../../assets/images/carousel/results-5-after.jpg", alt: "Selfy photo of Jochum Strength trainee after training." },
    { img: "../../../../../assets/images/carousel/results-6-after.jpg", alt: "Selfy photo of Jochum Strength trainee after training." },
    { img: "../../../../../assets/images/carousel/results-6-before-front.jpg", alt: "Selfy photo of Jochum Strength trainee before training." }
  ];
  resultsGrouped: Array<IResultImage[]> = [];
  resizeSubscription: Subscription;
  colCount: number = 1;
	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;

  ngOnInit(){
    this.updateColumnCount();

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.updateColumnCount());
  }

  updateColumnCount() {
    const width = window.innerWidth;
    let j = -1;
    this.colCount = 2;
    this.resultsGrouped = [];

    // These are tied to the bootstrap column sizes used on the cards.
    if (width > 320) this.colCount = 2; // col-xs-6
    if (width > 767) this.colCount = 4; // col-md-3
    if (width > 991) this.colCount = 6; // col-lg-2

    for(let i = 0; i < this.results.length; i++){
      if (i % this.colCount == 0) {
        j++;
        this.resultsGrouped[j] = [];
        this.resultsGrouped[j].push(this.results[i]);
      }
      else {
          this.resultsGrouped[j].push(this.results[i]);
      }
    }
  }

	// togglePaused() {
	// 	if (this.paused) {
	// 		this.carousel.cycle();
	// 	} else {
	// 		this.carousel.pause();
	// 	}
	// 	this.paused = !this.paused;
	// }

	// onSlide(slideEvent: NgbSlideEvent) {
	// 	if (
	// 		this.unpauseOnArrow &&
	// 		slideEvent.paused &&
	// 		(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
	// 	) {
	// 		this.togglePaused();
	// 	}
	// 	if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
	// 		this.togglePaused();
	// 	}
	// }
}