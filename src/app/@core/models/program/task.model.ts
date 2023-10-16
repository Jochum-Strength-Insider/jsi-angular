export class Tasks {
    id: string;
    e: string;
    l: string;

    constructor(e: string = "", l: string = ""){
        this.e = e;
        this.l = l;
    }
}

export const INITIAL_TASKS: Tasks[] = [
    {e: '1 1/2 Rep Chest Supported Rows', l: 'cMCtDDF3CI8', id: '-M5x2KwdWdFt722WcQdN'},
    {e: '1 1/2 Rep Pull Ups', l: 'Tu8R9xjsGLM', id: '-M5x2KwgzF41-u5Lgxt3'},
    {e: '1 Arm Dead Hang Lat Stretch', l: 'Dn9kmmaXpaA', id: '-M5x2KwjPUVJR6NWBawb'},
    {e: '1 Arm Hangs', l: 'Z8vaDCHA5kc', id: '-M5x2KwjPUVJR6NWBawc'},
    {e: '1 Arm Plank', l: 'rNlWYIYS-Dk', id: '-M5x2KwkFaY4iM5CNHTL'},
    {e: '1 Arm on Medball Push Ups', l: 'xgji0PxZOpc', id: '-M5x2KwkFaY4iM5CNHTK'},
    {e: '1 Handed Eccentric Push Up', l: 'FaFgUm6krIA', id: '-M5x2Kwl2R0BqSnUfeG0'},
    {e: '1 Up 1 Down Goodmorning', l: 'GQEolSWEFp0', id: '-M5x2KwmFlGssldYyh-v'},
    {e: '1 Up 1 Down Squat', l: 'aRZCQdGJ94M', id: '-M5x2KwnbhFpV3UQMWPz'}
  ]