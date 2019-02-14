import * as joint from 'jointjs';
import {Graph} from '../model/graph';


export class JoinJsGraph extends joint.dia.Graph  implements Graph {
    
    constructor() { 
        super();
    }

    addService(name:string):void{
        var rect = new joint.shapes.standard.Rectangle();
        rect.position(0, 0);
        rect.resize(100, 40);
        rect.attr({
            body: {
                fill: 'blue'
            },
            label: {
                text: name,
                fill: 'white'
            }
        });
        rect.addTo(this);
    }

    removeService(){

    }

}