import * as joint from 'jointjs';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';


export class Graph extends joint.dia.Graph {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
        this.defineLinkClass();
    }
    // joint class that define the shape of the links
    defineLinkClass(){
        // MicroTosca RunTimeLink
        joint.dia.Link.define('MicroTosca.RunTimeLink', {
            attrs: {
                line: {
                    connection: true,
                    stroke: '#333333',
                    strokeWidth: 4,
                    strokeLinejoin: 'round',
                    targetMarker: {
                        type: 'path',
                        d: 'M 10 -5 0 0 10 5 z'
                    }
                },
                wrapper: {
                    connection: true,
                    strokeWidth: 10,
                    strokeLinejoin: 'round'
                }
            }
        }, {
            markup: [{
                tagName: 'path',
                selector: 'wrapper',
                attributes: {
                    'fill': 'none',
                    'cursor': 'pointer',
                    'stroke': 'transparent'
                }
            }, {
                tagName: 'path',
                selector: 'line',
                attributes: {
                    'fill': 'none',
                    'pointer-events': 'none'
                }
            }]
        });

        // MicroTosca DeployemntTime Link
        joint.dia.Link.define('MicroTosca.DeploymentTimeLink', {
            attrs: {
                line: {
                    connection: true,
                    stroke: '#333333',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                    strokeDasharray: "5,10,5",
                    targetMarker: {
                        type: 'path',
                        d: 'M 10 -5 0 0 10 5 z'
                    }
                },
                wrapper: {
                    connection: true,
                    strokeWidth: 10,
                    strokeLinejoin: 'round'
                }
            }
        }, {
            markup: [{
                tagName: 'path',
                selector: 'wrapper',
                attributes: {
                    'fill': 'none',
                    'cursor': 'pointer',
                    'stroke': 'transparent'
                }
            }, {
                tagName: 'path',
                selector: 'line',
                attributes: {
                    'fill': 'none',
                    'pointer-events': 'none'
                }
            }]
        });


    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getNode(id: string | number): joint.dia.Cell {
        return this.getCell(id);
    }

    findNodeByName(name:string): joint.dia.Cell{
        return this.getNodes().find(node => {
            console.log("finding" + this.getNameOfNode(node));
            return name === this.getNameOfNode(node)
        });
    }

    getNameOfNode(node:joint.dia.Cell){
        return node.attr("label/text");
    }

    builtFromJSON(json:string){

        this.removeCells(this.getCells());
        // var g = new Graph(json['name']);
        console.log("removed cells");
        this.name = json['name'];
        json['nodes'].forEach(node => {
            if(node.type == "service")
                this.addService(node.name)
            if(node.type == "database")
                this.addDatabase(node.name);
             if (node.type == "communicationpattern")
                this.addCommunicationPattern(node.name, node.type);
        });
        json['links'].forEach((link) => {
            if(link.type == "deploymenttime")
                this.addDeploymentTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
            if(link.type = "runtime")
                this.addRunTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));

        });
    }

    toJSON() {
        var data: Object = { 'name': this.name, 'nodes': [], 'links': [] };
        this.getNodes().forEach((node: joint.dia.Cell) => {
            var dnode = { 'id': node.get('id'), 'name': this.getNameOfNode(node)};
            if (this.isService(node))
                dnode['type'] = "service";
            if (this.isDatabase(node))
                dnode['type'] = "database";
            if (this.isCommunicationPattern(node))
                dnode['type'] = "communicationpattern";
            data['nodes'].push(dnode);

        })
        this.getLinks().forEach((link)=>{
            var dlink = {'source': link.getSourceElement().get('id'),
             'target': link.getTargetElement().get('id'),
            }
            if(link.get('type') === 'MicroTosca.RunTimeLink')
              dlink['type'] = "runtime";
            if  (link.get('type') === 'MicroTosca.DeploymentTimeLink')
              dlink['type'] = "deploymenttime";
            data['links'].push(dlink);
        })

       return data;
    }

    removeNode(id: string | number) {
        return this.getNode(id).remove();
    }

    getNodes(): joint.dia.Cell[] {
        return this.getCells().filter(node => !node.isLink());
    }

    getLinks():joint.dia.Link[]{
      
        return super.getLinks();// .filter(node => node.isLink());
    }

    getServices(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isService(node));
    }

    getDatabase(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isDatabase(node));
    }

    getCommunicationPattern(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isCommunicationPattern(node));
    }

    addService(name: string): joint.dia.Cell {
        var service = joint.dia.Element.define('microtosca.Service',{
            size: { width: 80, height: 80 },
            attrs: {
                body: {
                    refCx: '50%',
                    refCy: '50%',
                    refR: '50%',
                    strokeWidth: 8,
                    stroke: '#74F2CE',
                    fill: '#FFFFFF'
                },
                label: {
                    textVerticalAnchor: 'middle',
                    textAnchor: 'middle',
                    refX: '50%',
                    refY: '50%',
                    fontSize: 15,
                    fill: '#333333'
                },
                r : {

                }
            }
        }, {
                markup: [{
                    tagName: 'circle',
                    selector: 'body',
                }, {
                    tagName: 'text',
                    selector: 'label'
                },{
                    tagName: 'rect',
                    selector: 'r'
                },],
                setName: function(text) {
                    return this.attr('label/text', text || '');
                },
                addPrinciples: function(number){
                    for (var _i = 0; _i < number; _i++) {

                        this.attr({r: {
                            ref: 'body',
                            refX: '100%',
                            x: 100 *_i, // additional x offset
                            refY: '100%',
                            y: 10, // additional y offset
                            refWidth: '50%',
                            refHeight: '50%',
                        }});
                        console.log("added"+_i);
                    }


                }
            });
        var customRectangle = new service();
        customRectangle.setName(name);
        customRectangle.addTo(this);
        return customRectangle;
    }

    addDatabase(name: string): joint.dia.Cell {
        var database = joint.dia.Element.define('microtosca.Database',{
            size: {
                width: 75,
                height: 75
            },
            attrs: {
                body: {
                    refWidth: '100%',
                    refHeight: '100%',
                    fill: 'white',
                    stroke: '#F4A259',
                    strokeWidth: 8,
                    rx: 10,
                    ry: 10
                },
                label: {
                    refX: '50%',
                    refY: '50%',
                    yAlignment: 'middle',
                    xAlignment: 'middle',
                    fontSize: 15
                }
            }
        }, {
            markup: [{
                tagName: 'rect',
                selector: 'body',
            }, {
                tagName: 'text',
                selector: 'label'
            }],
            setName: function(text) {
                return this.attr('label/text', text || '');
            }
        });

        var d = new database();
        d.setName(name);
        d.addTo(this);
        return d;
    }

    addCommunicationPattern(name: string, type: string): joint.dia.Cell {
        var cp = joint.dia.Element.define('microtosca.CommunicationPattern', {
            size:{width: 100, height:100},
            attrs: {
                body: {
                    refPoints: "0,10 10,0 20,10 10,20",
                    strokeWidth: 8,
                    stroke: '#005E7C',
                    fill: '#FFFFFF'
                },
                label: {
                    textVerticalAnchor: 'middle',
                    textAnchor: 'middle',
                    refX: '50%',
                    refY: '50%',
                    fontSize: 14,
                    fill: '#333333'
                },
                type:{
                    textVerticalAnchor: 'middle',
                    textAnchor: 'middle',
                    refX: '50%',
                    refY: '75%',
                    fontSize: 13,
                    fill: '#333333'
                }
            }
        }, {
            markup: [{
                tagName: 'polygon',
                selector: 'body'
            }, {
                tagName: 'text',
                selector: 'label'
            },{
                tagName: 'text',
                selector: 'type'
            }],
            setName: function(text) {
                console.log(this.attr());
                return this.attr('label/text', text || '');
            },
            setType: function(text) {
                return this.attr('type/text', `(${text})` || '');
            }
        });

        var d = new cp();
        d.setName(name);
        d.setType(type);
        d.addTo(this);
        return d;
    }

    addRunTimeInteraction(source: joint.dia.Cell, target: joint.dia.Cell): joint.shapes.standard.Link {
        var link = new joint.shapes.MicroTosca.RunTimeLink({
            source: { id: source.id },
            target: { id: target.id },
        });

        this.addCell(link);
        return link;
    }

    addDeploymentTimeInteraction(source: joint.dia.Cell, target: joint.dia.Cell): joint.shapes.standard.Link {
        var link = new joint.shapes.MicroTosca.DeploymentTimeLink({
            source: { id: source.id },
            target: { id: target.id },
        });
        this.addCell(link);
        return link;
    }

    isService(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.Service';
    }

    isDatabase(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.Database';
    }

    isCommunicationPattern(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.CommunicationPattern';
    }

    applyLayout(){
        joint.layout.DirectedGraph.layout(this, {
          nodeSep: 50,
          edgeSep: 80,
          rankDir: "TB", // TB
          // ranker: "tight-tree",
          setVertices: false,
        });
    }

}
