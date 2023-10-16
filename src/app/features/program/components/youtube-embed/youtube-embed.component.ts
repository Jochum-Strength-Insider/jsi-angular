import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-youtube-embed',
  templateUrl: './youtube-embed.component.html',
  styleUrls: ['./youtube-embed.component.css']
})
export class YoutubeEmbedComponent {
  @Input() title: string = 'Exercise';
  @Input() videoId: string;
  videoIdDelay: string;

  ngOnInit(){
    setTimeout(() => {
      this.videoIdDelay = this.videoId
    }, 150);
  }

  constructor(
    public activeModal: NgbActiveModal
  ){}
}