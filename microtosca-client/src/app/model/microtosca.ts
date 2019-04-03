import * as joint from 'jointjs';
import { Smell } from '../analyser/smell';
import * as _ from 'lodash';    
import * as $ from 'jquery';

// extend joint.shapes namespace
declare module 'jointjs' {
    namespace shapes {
        namespace microtosca {
            class Node extends joint.dia.Cell{
                setName(name): void;
                getName(): String;
                addSmell(smell:Smell): void;
                getSmell(name:string): Smell;
                getSmells(): Smell[];
                resetSmells():void
                addIgnoreOnceSmell(smell:Smell): void;
                addIgnoreAlwaysSmell(smell:Smell): void;
            }
            class Service extends Node {
                setName(name): void;
                resetSmells():void
                // addSmell(smell:Smell): void;
            }
            class Database extends Node{
                setName(name): void;
                resetSmells():void
                // static staticTest(): void;
            }
            class CommunicationPattern extends Node{
                setName(name): void;
                setType(t:String): void;
                resetSmells():void
            }
            class RunTimeLink extends joint.dia.Link {
            }

            class DeploymentTimeLink extends joint.dia.Link {
            }
        }
    }
}
  
joint.dia.Element.define('microtosca.Service', {
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
            text: 'caio',
            // magnet: true 
        },
        EndpointBasedServiceInteraction: { // endpointBasesdServiceInteraction
            fill: '#00ff00',
            event: 'smell:EndpointBasedServiceInteraction:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refY: '100%',
            refWidth: '25%',
            refHeight: '25%'
        },
        wsi: { // WobblyServiceInteractionSmell
            fill: '#0800ee',
            event: 'smell:wsi:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '100%',
            refY: '100%',
            refWidth: '25%',
            refHeight: '25%',
        }
    },
    smells: [],            // list of smells that affects a single node
    ignoreOnceSmells:[],   // list of smell ignored (once)
    ignoreAlwaysSmells:[]  // list of smell ignored (always)
}, {
        markup: [{
            tagName: 'circle',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        },{
            tagName: 'rect',
            selector: 'EndpointBasedServiceInteraction'
        },{
            tagName: 'rect',
            selector: 'wsi'
        }],
        addIgnoreOnceSmell(smell:Smell){
            this._hideSmell(smell);
            this.attributes.ignoreOnceSmells.push(smell);
        },
        addIgnoreAlwaysSmell(smell:Smell){
            this._hideSmell(smell);
            this.attributes.ignoreAlwaysSmells.push(smell);
        },
        getName: function(){
            return this.attr('label/text');
        },
        setName: function(text) {
            return this.attr('label/text', text || '');
        },
        getSmells: function(){
           return  this.attributes.smells;
        },
        getSmell: function(name:string){
            return  this.attributes.smells.find(smell => {
                return name === smell.name;
            });
            return null;

        },
        resetSmells: function(){
            this.attributes.smells= [];
            this.attr('EndpointBasedServiceInteraction/visibility', 'hidden');
            this.attr('wsi/visibility', 'hidden');
            console.log("Resetted smelles");
        },
        _hideSmell(smell:Smell){
            this.attr(`${smell.name}/visibility`, 'hidden');
        },
        addSmell: function(smell:Smell){
            this.attributes.smells.push(smell);
            if (smell.name == "EndpointBasedServiceInteraction"){
                this.attr('EndpointBasedServiceInteraction/visibility', 'visible');
            }
            else if(smell.name == "WobblyServiceInteractionSmell"){
                this.attr('wsi/visibility', 'visible');
            }
            // console.log(this);
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
        },
        sp: { // endpointBasesdServiceInteraction
            fill: '#00ff00',
            event: 'smell:sp:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refY: '100%',
            refWidth: '25%',
            refHeight: '25%',
        },
    },
    smells: [] // list of smells that affects a single node
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label'
    },{
        tagName: 'rect',
        selector: 'sp'
    }],
    getName: function(){
        return this.attr('label/text');
    },
    setName: function(text) {
        return this.attr('label/text', text || '');
    },
    getSmells: function(){
        return  this.attributes.smells;
     },
    resetSmells: function(){
        this.attributes.smells= [];
        this.attr('sp/visibility', 'hidden');
    },
    addSmell: function(smell:Smell){
        // console.log(smell);
        if (smell.name == "SharedPersistencySmell")
            this.attr('sp/visibility', 'visible');
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
    },
    smells: [] // list of smells that affects a single node
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
    getName: function(){
        return this.attr('label/text');
    },
    getSmells: function(){
        return  this.attributes.smells;
     },
    setName: function(text) {
        console.log(this.attr());
        return this.attr('label/text', text || '');
    },
    setType: function(text) {
        return this.attr('type/text', `(${text})` || '');
    },
    resetSmells: function(){
        this.attributes.smells= [];
        // this.attr('sp/visibility', 'hidden');
    },
    addSmell: function(smell:Smell){
        console.log(smell);
    //     if (smell.name == "SharedPersistencySmell")
    // //    if(smell instanceof  EndpointBasedServiceInteractionSmell){
    //         this.attr({EndpointBasedServiceInteraction: {
    //             event: 'smell:EndpointBasedServiceInteraction:pointerdown',
    //             ref: 'body',
    //             refY: '100%',
    //             refWidth: '25%',
    //             refHeight: '25%',
    //         }});

    //     }
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
    },
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


// demonstrate creating a custom dummy view for the app.CustomRect
namespace CustomViews {

    export class ServiceView extends joint.dia.ElementView {

        initialize() {
            super.initialize.apply(this, arguments);
        
        }

        render() {
            console.log("CALLED RENDER FUNCTION");
            super.render();
            this.model.prop('smells').forEach(smell => {
                console.log(smell);
            });
            
            // var model = this.model;
            // var sections = model.prop('sections');
            // var Vsections = []
            // this.model.prop('sections').forEach(section => {
            //     Vsections.push(section);
            // });
            // console.log(this.$box);
            // $('#jointjsgraph').prepend(this.$box);
            // // $('#v-3').prepend(this.$box);

            // // this.paper.$el.prepend(this.$box);
            // // $el is the div containing all the graph:  
            // // Bakcbone.VIEW: has the property $el 
            // // https://backbonejs.org/#Model-View-separation
            
            // console.log("AFTER RENDER FUNCITON");
            // // $(el).prepend(this.$box);
            // this.updateBox();
             return this;
        }   
    }
}
(<any>Object).assign(joint.shapes.microtosca, CustomViews)