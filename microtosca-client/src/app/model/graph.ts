import * as joint from 'jointjs';


export class Graph extends joint.dia.Graph {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
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

    getNameOfNode(node:joint.dia.Cell){
        return node.attr("label/text");
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
            if(link.get('type') === 'microtosca.RunTimeLink')
              dlink['type'] = "runtime";
            if  (link.get('type') === 'microtosca.DeploymentTimeLink')
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

    addDatabase(name: string): joint.dia.Cell {
        var database = joint.shapes.standard.Rectangle.define('microtosca.Database', {
            attrs: {
                body: {
                    fill: '#4E7F64'
                },
                label: {
                    text: name,
                    fill: 'white'
                }
            }
        }, {
                markup: [{
                    tagName: 'rect',
                    selector: 'body',
                },
                {
                    tagName: 'text',
                    selector: 'label'
                }]
            });
        // var rect = new joint.shapes.standard.Rectangle();
        // rect.position(0, 0);
        // rect.resize(50, 50);
        // rect.attr({
        //     body: {
        //         fill: '#4E7F64'
        //     },
        //     label: {
        //         text: name,
        //         fill: 'white'
        //     }
        // });

        var d = new database();
        d.position(20, 20);
        d.addTo(this);
        d.resize(50, 50);
        return d;
    }

    addCommunicationPattern(name: string, type: string): joint.dia.Cell {
        var dt = joint.shapes.standard.Polygon.define('microtosca.CommunicationPattern', {
            attrs: {
                body: {
                    fill: "#97CAA1",
                    refPoints: "0,10 10,0 20,10 10,20"
                },
                label: {
                    text: name,
                    fill: 'white'
                }
            },
        },
            {
                markup: [{
                    tagName: 'polygon',
                    selector: 'body',
                },
                {
                    tagName: 'text',
                    selector: 'label'
                }]
            }
        );

        // var polygon = new joint.shapes.standard.Polygon();
        // polygon.attr('root/title', 'joint.shapes.standard.Polygon');
        // polygon.attr('body/fill', '#97CAA1;');
        // polygon.attr('label/text', name);
        // // polygon.attr('body/class', 'service');
        // polygon.attr('text/fill', "white");
        // polygon.attr('body/refPoints', '0,10 10,0 20,10 10,20');
        var d = new dt();
        d.resize(50, 50);
        d.position(20, 20);
        d.addTo(this);
        return d;
    }

    addRunTimeInteraction(source: string | number, target: string | number): joint.shapes.standard.Link {
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

    addDeploymentTimeInteraction(source: string | number, target: string | number): joint.shapes.standard.Link {
        var dtl = joint.shapes.standard.Link.define('microtosca.DeploymentTimeLink', {
            attrs: {
                line: {
                    stroke: "#3c4260",
                    strokeDasharray: "5,10,5",
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

        var dpLink = new dtl();
        dpLink.source(this.getCell(source));
        dpLink.target(this.getCell(target));
        dpLink.addTo(this);
        return dpLink;
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


}