import * as joint from 'jointjs';
import {Graph} from '../model/graph';
import {Node} from '../model/node';


export class JoinJsGraph extends joint.dia.Graph  {
    
    constructor() { 
        super();
    }

    getNodes(){
        return this.getCells();
    }

    addService(name:string){
        var rect = new joint.shapes.standard.Circle();
        rect.position(0, 0);
        rect.resize(100, 40);
        rect.attr({
            body: {
                fill: '#065143'
            },
            label: {
                text: name,
                fill: 'white'
            }
        });
        rect.addTo(this);
        this.getNode(name);
        return rect;
    }

    removeService(){

    }

    addDatabase(name:string):void{
        var rect = new joint.shapes.standard.Rectangle();
        rect.position(0, 0);
        rect.resize(50, 50);
        rect.attr({
            body: {
                fill: '#4E7F64'
            },
            label: {
                text: name,
                fill: 'white'
            }
        });
        rect.addTo(this);
    }

    getNode(name:string){
        // console.log(this.getCell(name));
        // this.getElements().forEach((element)=> {

        //     if(element.attributes.attrs["text"]["text"] == name){
        //                 alert("YEAHHHHHH");
        //     }

        //    });
    }

    removeDatabase():void{
    }

    addCommunicationPattern(name:string, type:string):void{
        var polygon = new joint.shapes.standard.Polygon();
        polygon.resize(50, 50);
        polygon.position(250, 210);
        polygon.attr('root/title', 'joint.shapes.standard.Polygon');
        polygon.attr('body/fill', '#97CAA1;');
        polygon.attr('label/text', name);
        // polygon.attr('body/class', 'service');
        polygon.attr('text/fill', "white");
        polygon.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        polygon.addTo(this);

        // var diamond = new joint.shapes.basic.Path({
        //     size: { width: 40, height: 40 },
        //     attrs: {
        //         body: {
        //             fill: 'purple'
        //         },
        //         path: { d: 'M 30 0 L 60 30 30 60 0 30 z' },
        //         text: {
        //             text: name,
        //             fill: 'black',
        //             //'ref-y': .5 // basic.Path text is originally positioned under the element
        //         }
        //     }
        // });
        // diamond.addTo(this);
    }

    removeCommunicationPattern():void{
    }

    addRunTimeInteraction(source:string, target:string):void{
        var link = new joint.shapes.standard.Link();
        link.attr({
            line: {
                sourceMarker: { // hour hand
                    'type': 'path',
                    'd': 'M 20 -10 0 0 20 10 Z'
                },
                targetMarker: { // minute hand
                    'type': 'path',
                    'stroke': 'green',
                    'stroke-width': 2,
                    'fill': 'yellow',
                    'd': 'M 20 -10 0 0 20 10 Z'
                }
            }
        });
        link.source(this.getCell(source));
        link.target(this.getCell(target));
        link.addTo(this);

    }
    addDeploymentTimeInteration():void{

    }

}