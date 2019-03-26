import * as joint from 'jointjs';

// extend joint.shapes namespace
declare module 'jointjs' {
    namespace shapes {
        namespace microtosca {
            class Service extends joint.shapes.standard.Circle {
                setName(name): void;
                setSmell(smell:number): void;
                // static staticTest(): void;
            }

            class Database extends joint.shapes.standard.Rectangle {
                setName(name): void;
                // static staticTest(): void;
            }

            class CommunicationPattern extends joint.shapes.standard.Rectangle {
                setName(name): void;
                setType(t:String): void;
                // static staticTest(): void;
            }
            class RunTimeLink extends joint.dia.Link {
            }

            class DeploymentTimeLink extends joint.dia.Link {
            }
        }
    }
}

joint.dia.Element.define('microtosca.Service',{
    size: { width: 80, height: 80 },
    attrs: {
        body: {
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
            strokeWidth: 8,
            stroke: '#74F2CE',
            fill: '#FFFFFF',
            magnet: true 
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%',
            fontSize: 15,
            fill: '#333333',
            // TODO: setName()  generate an error, so the text is setted here.
            text: '',
            // magnet: true 
        },
        smell: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '10%',
            refY: '10%',
            fontSize: 15,
            fill: '#333333',
            text: '',
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
            selector: 'smell'
        },],
        setName: function(text) {
            return this.attr('label/text', text || '');
            console.log("Setted name funciton");
        },
        setSmell: function(number){
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

joint.dia.Element.define('microtosca.Database',{
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
            ry: 10,
            magnet: true 
        },
        label: {
            refX: '50%',
            refY: '50%',
            yAlignment: 'middle',
            xAlignment: 'middle',
            fontSize: 15,
            // TODO: setName()  generate an error, so the text is setted here.
            text: name || '',
     
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

joint.dia.Element.define('microtosca.CommunicationPattern', {
    size:{width: 100, height:100},
    attrs: {
        body: {
            refPoints: "0,10 10,0 20,10 10,20",
            strokeWidth: 8,
            stroke: '#005E7C',
            fill: '#FFFFFF',
            magnet: true 
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%',
            fontSize: 14,
            fill: '#333333',
             // TODO: setName()  generate an error, so the text is setted here.
            text:  ''
        },
        type:{
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '75%',
            fontSize: 13,
            fill: '#333333',
             // TODO: setType()  generate an error, so the text is setted here.
            text:  ''
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

joint.dia.Link.define('microtosca.RunTimeLink', {
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
joint.dia.Link.define('microtosca.DeploymentTimeLink', {
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