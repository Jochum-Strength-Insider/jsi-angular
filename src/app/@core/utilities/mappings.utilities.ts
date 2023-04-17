import { map, OperatorFunction } from "rxjs";

export interface ObjectWithId {
    id: string;
    [key: string]: any;
}

   
export const mapKeyToObjectOperator = (): OperatorFunction<any, ObjectWithId> => map( mapKeyToObject() );
export const mapKeysToObjectArrayOperator = (): OperatorFunction<any[], ObjectWithId[]> =>
    map(changes => changes.map( mapKeyToObject() )
);

const mapKeyToObject = () => (change: any) => ({ id: change.payload.key, ...change.payload.toJSON() })