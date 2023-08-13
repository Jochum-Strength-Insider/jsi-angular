import { SimpleChange } from "@angular/core";

export function ifPropChanged(
    prop: SimpleChange,
    callback: (value: any, firstChange: boolean) => void
 ): void {
    if (prop !== undefined && (prop.currentValue !== undefined) && (prop.currentValue !== prop.previousValue)) {
       callback(prop.currentValue, prop.firstChange);
    }
 }