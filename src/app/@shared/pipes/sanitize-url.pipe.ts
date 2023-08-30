import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeUrl' })
export class SanitizeUrlPipe implements PipeTransform {
  constructor(protected _sanitizer: DomSanitizer) { }

  transform(url: string): string {
    return this._sanitizer.sanitize(SecurityContext.URL, url) || "";
  }
}