import * as joint from 'jointjs';


export class Graph extends joint.dia.Graph{

    // graph: joint.dia.Graph;
    
    constructor(){
        super()
        // this = new joint.dia.Graph;
    }
    
    getJointGraph(): joint.dia.Graph{
        return this;
    }

    getNode(id: string | number):joint.dia.Cell{
        return this.getCell(id);
    }

    removeNode(id: string | number){
        return this.getNode(id).remove();
    }

    getNodes():joint.dia.Cell[]{
        return this.getCells();
    }

    getServices():joint.dia.Cell[]{
        return this.getNodes(); //.filter(node => node.constructor == Service);
    }
    
    getDatabase():joint.dia.Cell[]{
        return this.getNodes(); //.filter(node => node.constructor == Database);
    }

    getCommunicationPattern():joint.dia.Cell[]{
        return this.getNodes(); //.filter(node => node.constructor == CommunicationPattern);
    }

    addService(name:string): joint.dia.Cell{
        var service = joint.shapes.basic.Circle.define('microtosca.Service', {
            attrs: {
                    body: {
                fill: '#065143'
            },
            label: {
                text: name,
                fill: 'white'
            }
            }
        }, {
            markup: [{
                tagName: 'circle',
                selector: 'body',
            }, {
                tagName: 'text',
                selector: 'label'
            }]
        });
        var customRectangle = new service();
        customRectangle.addTo(this);
        // var s = new Service(name);
        // s.getInstance().addTo(this)
        return customRectangle;
    }

    addDatabase(name:string):joint.dia.Cell{
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
        return rect;
    }

    addCommunicationPattern(name:string, type:string):joint.dia.Cell{

        var dt = joint.shapes.standard.Polygon.define('microtosca.CommunicationPattern', {
            attrs: {
                body: {
                    fill:"#97CAA1",
                    refPoints: "0,10 10,0 20,10 10,20"
                },
            }
        },
            {
                markup: [{
                    tagName: 'polygon',
                    selector: 'body',
                }]
            }
        );

        // var polygon = new joint.shapes.standard.Polygon();
        // polygon.resize(50, 50);
        // polygon.position(250, 210);
        // polygon.attr('root/title', 'joint.shapes.standard.Polygon');
        // polygon.attr('body/fill', '#97CAA1;');
        // polygon.attr('label/text', name);
        // // polygon.attr('body/class', 'service');
        // polygon.attr('text/fill', "white");
        // polygon.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        var d = new dt();
        d.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        d.addTo(this);
        return d;
    }

    addRunTimeInteraction(source: string |number, target:string | number): joint.shapes.standard.Link{

        var rt = joint.shapes.standard.Link.define('microtosca.RunTimeLink', {
            attrs: {
                line: {
                    stroke: "#3c4260",
                    strokeWidth: 4,
                    targetMarker: {
                        // if no fill or stroke specified, marker inherits the line color
                        'd': 'M 0 -5 L -10 0 L 0 5 Z'
                    },
                    sourceMarker: {
                        // the marker can be an arbitrary SVGElement
                        'type': 'circle',
                        'r': 5
                    }
                },
            }
        });
        
        // var link = new joint.shapes.standard.Link();
        // link.attr({
        //     line: {
        //         stroke: "#3c4260",
        //         strokeWidth: 4,
        //         targetMarker: {
        //             // if no fill or stroke specified, marker inherits the line color
        //             'd': 'M 0 -5 L -10 0 L 0 5 Z'
        //         },
        //         sourceMarker: {
        //             // the marker can be an arbitrary SVGElement
        //             'type': 'circle',
        //             'r': 5
        //         }
        //     }
        // });
        var link = new rt();
        link.source(this.getCell(source));
        link.target(this.getCell(target));
        link.addTo(this);
        return link;
    }

    addDeploymentTimeInteraction(source: string |number, target:string | number): joint.shapes.standard.Link{
        var link = new joint.shapes.standard.Link();
        link.attr({
            line: {
                stroke: "#3c4260",
                strokeWidth: 4,
                targetMarker: {
                    // if no fill or stroke specified, marker inherits the line color
                    'd': 'M 0 -5 L -10 0 L 0 5 Z'
                },
                sourceMarker: {
                    // the marker can be an arbitrary SVGElement
                    'type': 'circle',
                    'r': 5
                }
            }
        });

        link.attr('line/stroke-dasharray', "5,10,5");
        link.source(this.getCell(source));
        link.target(this.getCell(target));
        link.addTo(this);
        return link;
    }

    
 

}