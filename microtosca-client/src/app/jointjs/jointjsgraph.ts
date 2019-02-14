import * as joint from 'jointjs';
import {Graph} from '../model/graph';


export class JoinJsGraph extends joint.dia.Graph  implements Graph {
    
    constructor() { 
        super();
    }

    addService(name:string):void{
        var rect = new joint.shapes.standard.Circle();
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

    addDatabase(name:string):void{
        var rect = new joint.shapes.standard.Rectangle();
        rect.position(0, 0);
        rect.resize(100, 40);
        rect.attr({
            body: {
                fill: 'purple'
            },
            label: {
                text: name,
                fill: 'white'
            }
        });
        rect.addTo(this);

    }

    removeDatabase():void{
    }

    addCommunicationPattern(name:string, type:string):void{
        var diamond = new joint.shapes.basic.Path({
            size: { width: 40, height: 40 },
            attrs: {
                path: { d: 'M 30 0 L 60 30 30 60 0 30 z' },
                text: {
                    text: name,
                    fill: 'yellow',
                    'ref-y': .5 // basic.Path text is originally positioned under the element
                }
            }
        });
        diamond.addTo(this);
    }
    removeCommunicationPattern():void{

    }

}