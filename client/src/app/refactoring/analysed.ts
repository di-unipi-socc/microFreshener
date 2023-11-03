import { GroupSmellObject, SmellObject } from './smells/smell';
import * as joint from 'jointjs';

export class Analysed<T extends (joint.shapes.microtosca.Node | joint.shapes.microtosca.Group)> {

    private constructor(
        private name: string,
        private smells: (SmellObject | GroupSmellObject)[],
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
            private smells: (SmellObject | GroupSmellObject)[];
            private element: T;

            constructor() {
                this.smells = [];
            }

            setSmells(smells: (SmellObject | GroupSmellObject)[]) {
                this.smells = smells;
                return this;
            }

            setElement(element: T) {
                this.element = element;
                this.name = element.getName();
                return this;
            }

            build() {
                if(!this.name || !this.element) {
                    throw new Error("Some required fields are missing: " + (!this.name ? "name " : "") + !this.element ? "element " : "");
                }
                return new Analysed<T>(this.name, this.smells, this.element);
            }
        }
    }
}