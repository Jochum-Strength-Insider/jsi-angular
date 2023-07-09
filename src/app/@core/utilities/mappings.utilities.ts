import { map, OperatorFunction } from "rxjs";

export interface ObjectWithId {
    id: string;
    [key: string]: any;
}

export const mapKeyToObjectOperator = (): OperatorFunction<any, any> => map( mapKeyToObject() );
export const mapKeysToObjectArrayOperator = (): OperatorFunction<any[], any[]> =>
    map(changes => changes.map( mapKeyToObject() )
);

const mapKeyToObject = () => (change: any) => change.key ? ({ id: change.payload.key, ...change.payload.toJSON() }) : null