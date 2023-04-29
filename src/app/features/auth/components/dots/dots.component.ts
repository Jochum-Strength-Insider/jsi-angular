import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dots',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.css']
})
export class DotsComponent {
  @Input() step: number = 1;
}