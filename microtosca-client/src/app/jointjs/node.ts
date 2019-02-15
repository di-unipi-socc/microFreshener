import * as joint from 'jointjs';
import {Node} from '../model/node';
import { join } from 'path';

export class JointNode  extends joint.dia.Cell {

    constructor(id, name){
        super();
    }

    getID(): string{
        return "fjaj";
    }
}