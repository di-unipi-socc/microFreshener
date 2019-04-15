
import * as joint from 'jointjs';

export class Causa {

    link: joint.shapes.microtosca.RunTimeLink

    constructor(link) {
        this.link = link;
    }

    getCausa(){
        return this.link;
    }
}