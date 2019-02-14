import {JoinJsGraph} from './jointjs/jointjsgraph';
import {Graph} from './model/graph';

export class GraphFactory {

    constructor(){}

    getGraph(type:string): Graph{
        // if type==jointgraph
        return new JoinJsGraph();
    }
}
