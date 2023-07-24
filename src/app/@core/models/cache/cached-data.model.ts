export class CachedData {
  data: any;
  version: number;

  constructor(data: any, version: string) {
    this.data = data;
    this.version = !isNaN(+version) ? +version : 0;
  }
}