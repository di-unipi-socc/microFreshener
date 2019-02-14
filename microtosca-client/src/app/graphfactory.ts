import {Graph} from './model/graph';
import {JoinJsGraph} from './jointjs/jointjsgraph';

export class GraphFactory {
    
    constructor() { }

    getGraph(type:string):Graph{
        // if type == jointgraph:
        return new JoinJsGraph();
    }
}