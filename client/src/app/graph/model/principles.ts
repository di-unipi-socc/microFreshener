import {Smell} from "./smell";

export interface Principle {
    id?: number;
    name?: string;
    smells?: Smell[];
}