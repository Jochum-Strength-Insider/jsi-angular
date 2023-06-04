import { SimpleChange } from "@angular/core";

export function ifPropChanged(
    prop: SimpleChange,
    callback: (value: any) => void
 ): void {
    if (prop !== undefined && prop.currentValue !== undefined) {
       callback(prop.currentValue);
    }
 }