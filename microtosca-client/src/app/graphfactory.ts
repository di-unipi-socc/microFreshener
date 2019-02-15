import {Graph} from './model/graph';
import {JoinJsGraph} from './jointjs/jointjsgraph';
import {ForceDirectedGraph} from './d3';

export class GraphFactory {
    
    constructor() { 
        console.log("Facorty method created");
    }

    //factory method
     getGraph(typegraph:string):Graph{
        console.log("Facorty method getGraph "+typegraph);
        if (typegraph == "jointjs"){
            console.log("using jointJs graph");
            return new JoinJsGraph();
        }
        if (typegraph =="d3")
            return new ForceDirectedGraph([],[],{width:0, height:0});

    }
}