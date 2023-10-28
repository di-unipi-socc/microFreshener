import { Graph } from '../graph/model/graph';
import { GroupSmellObject, SmellObject } from './smell';
import * as joint from 'jointjs';

/**
 * Analysed group. Contains the violated principles of a group-based smell
 */
export class Analysed<T extends (joint.shapes.microtosca.Node | joint.shapes.microtosca.Group)> {

    private constructor(
        private name: string,
        private smells: GroupSmellObject[],
        private element: T
    ) {}

    getName(): string {
        return this.name;
    }

    getSmells() {
        return this.smells;
    }

    hasSmells(): boolean {
        return this.smells.length > 0;
    }

    getElement() {
        return this.element;
    }

    static getBuilder<T extends (joint.shapes.microtosca.Node | joint.shapes.microtosca.Group)>() {
        return new class Builder {
            private name: string;
            private smells: GroupSmellObject[];
            private element: T;

            constructor() {
                this.smells = [];
            }

            setName(name: string) {
                this.name = name;
                return this;
            }

            setSmells(smells: GroupSmellObject[]) {
                this.smells = smells;
                return this;
            }

            setElement(element: T) {
                this.element = element;
                return this;
            }

            build() {
                if(!this.name || !this.smells || !this.element) {
                    throw new Error("Some required fields are missing: " + (!this.name ? "name " : "") + (!this.smells ? "smells " : "") + !this.element ? "element " : "");
                }
                return new Analysed<T>(this.name, this.smells, this.element);
            }
        }
    }
}