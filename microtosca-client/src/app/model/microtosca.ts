import * as joint from 'jointjs';
import { Smell } from '../analyser/smell';
import * as _ from 'lodash';
import * as $ from 'jquery';

// extend joint.shapes namespace
declare module 'jointjs' {
    namespace shapes {
        namespace microtosca {
            class Node extends joint.dia.Element {
                setName(name): void;
                getName(): String;
                addSmell(smell: Smell): void;
                getSmell(name: string): Smell;
                getSmells(): Smell[];
                resetSmells(): void
                addIgnoreOnceSmell(smell: Smell): void;
                addIgnoreAlwaysSmell(smell: Smell): void;
                showDeleteButton():void;
                hideDeleteButton():void;

            }
            class Service extends Node {
            }
            class Database extends Node {
            }
            class CommunicationPattern extends Node {
                setConcreteType(ctype: String): void;
                getConcreteType(): string;
            }
            class Group extends joint.dia.Element {
                setName(name): void;
                getName(): String;
                addSmell(smell: Smell): void;
                getSmell(name: string): Smell;
                getSmells(): Smell[];
                resetSmells(): void
                showDeleteButton():void;
                hideDeleteButton():void;
            }
            class EdgeGroup extends Group {
                setExternalUserName(name: string): void;
                getExternalUserName(): string;
            }
            class SquadGroup extends Group {
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
        delete: {
            d : "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
            event: 'node:delete:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '-30%',
            refY: '-30%',
            refWidth: '5%',
            refHeight: '5%',
            fill: '#F78686',
            magnet: false 
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
            event: 'smell:WobblyServiceInteractionSmell:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '50%',
            refY: '100%',
            refWidth: '25%',
            refHeight: '25%',
        },
        NoApiGateway: { // WobblyServiceInteractionSmell
            fill: '#FF0000',
            event: 'smell:NoApiGateway:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '100%',
            refY: '100%',
            refWidth: '25%',
            refHeight: '25%',
        }
    },
    smells: [],            // list of smells that affects a single node
    ignoreOnceSmells: [],   // list of smell ignored (once)
    ignoreAlwaysSmells: []  // list of smell ignored (always)
}, {
        markup: [{
            tagName: 'circle',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'rect',
            selector: 'EndpointBasedServiceInteraction'
        }, {
            tagName: 'rect',
            selector: 'wsi'
        }, {
            tagName: 'rect',
            selector: 'NoApiGateway'
        },{
            tagName: "path",
            selector: "delete"
        }],
        addIgnoreOnceSmell(smell: Smell) {
            this._hideSmell(smell);
            this.attributes.ignoreOnceSmells.push(smell);
        },
        addIgnoreAlwaysSmell(smell: Smell) {
            this._hideSmell(smell);
            this.attributes.ignoreAlwaysSmells.push(smell);
        },
        getName: function () {
            return this.attr('label/text');
        },
        setName: function (text) {
            return this.attr('label/text', text || '');
        },
        getSmells: function () {
            return this.attributes.smells;
        },
        getSmell: function (name: string) {
            return this.attributes.smells.find(smell => {
                return name === smell.name;
            });
        },
        showDeleteButton: function(){
            this.attr('delete/visibility', 'visible')
        },
        hideDeleteButton: function(){
            this.attr('delete/visibility', 'hidden')
        },
        resetSmells: function () {
            this.attributes.smells = [];
            this.attr('EndpointBasedServiceInteraction/visibility', 'hidden');
            this.attr('wsi/visibility', 'hidden');
            this.attr('NoApiGateway/visibility', 'hidden');
            console.log("Resetted smelles");
        },
        _hideSmell(smell: Smell) {
            this.attr(`${smell.name}/visibility`, 'hidden');
        },
        addSmell: function (smell: Smell) {
            this.attributes.smells.push(smell);
            if (smell.name == "EndpointBasedServiceInteractionSmell") {
                this.attr('EndpointBasedServiceInteraction/visibility', 'visible');
            }
            else if (smell.name == "WobblyServiceInteractionSmell") {
                this.attr('wsi/visibility', 'visible');
            }
            else if (smell.name == "NoApiGateway") {
                this.attr('NoApiGateway/visibility', 'visible');
            }
            // console.log(this);
        }
    });

joint.dia.Element.define('microtosca.Database', {
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
        delete: {
            d : "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
            event: 'node:delete:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '-50%',
            refY: '-50%',
            refWidth: '5%',
            refHeight: '5%',
            fill: '#F78686',
            magnet: false 
        },
        sp: { // SharedPersitency
            fill: '#FC2B01',
            event: 'smell:SharedPersistency:pointerdown',
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
        }, {
            tagName: 'rect',
            selector: 'sp'
        },{
            tagName: "path",
            selector: "delete"
        }],
        getName: function () {
            return this.attr('label/text');
        },
        setName: function (text) {
            return this.attr('label/text', text || '');
        },
        getSmells: function () {
            return this.attributes.smells;
        },
        getSmell: function (name: string) {
            return this.attributes.smells.find(smell => {
                return name === smell.name;
            });
            return null;
        },
        resetSmells: function () {
            this.attributes.smells = [];
            this.attr('sp/visibility', 'hidden');
        },
        addSmell: function (smell: Smell) {
            this.attributes.smells.push(smell);
            if (smell.name == "SharedPersistencySmell")
                this.attr('sp/visibility', 'visible');
        },
        showDeleteButton: function(){
            this.attr('delete/visibility', 'visible')
        },
        hideDeleteButton: function(){
            this.attr('delete/visibility', 'hidden')
        }

    });

joint.dia.Element.define('microtosca.CommunicationPattern', {
    size: { width: 100, height: 100 },
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
            text: ''
        },
        delete: {
            d : "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
            event: 'node:delete:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '-0%',
            refY: '-30%',
            refWidth: '5%',
            refHeight: '5%',
            fill: '#F78686',
            magnet: false 
        },
        type: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '75%',
            fontSize: 13,
            fill: '#333333',
            // TODO: setConcreteType()  generate an error, so the text is setted here.
            text: ''
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
        }, {
            tagName: 'text',
            selector: 'type'
        },{
            tagName: "path",
            selector: "delete"
        }],
        getName: function () {
            return this.attr('label/text');
        },
        getSmells: function () {
            return this.attributes.smells;
        },
        setName: function (text) {
            console.log(this.attr());
            return this.attr('label/text', text || '');
        },
        setConcreteType: function (text) {
            return this.attr('type/text', `${text}` || '');
        },
        getConcreteType: function () {
            return this.attr('type/text');
        },
        resetSmells: function () {
            this.attributes.smells = [];
            // this.attr('sp/visibility', 'hidden');
        },
        addSmell: function (smell: Smell) {
            console.log(smell);
        },
        showDeleteButton: function(){
            this.attr('delete/visibility', 'visible')
        },
        hideDeleteButton: function(){
            this.attr('delete/visibility', 'hidden')
        },
    });
joint.dia.Element.define('microtosca.EdgeGroup', {
    size: {
        width: 75,
        height: 75
    },
    attrs: {
        body: {
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
            strokeWidth: 8,
            stroke: '#C2C2C2',
            fill: "#C2C2C2",
            magnet: true
        },
        label: {
            refX: '50%',
            refY: '50%',
            yAlignment: 'middle',
            xAlignment: 'middle',
            fontSize: 15,
            text: name || '',
        },
    },
    name: '', // name of the group. each nodes connected to this node are considered memeber of the EdgeGroup
    smells: [] // list of smells that affects a single node
}, {
        markup: [{
            tagName: 'circle',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }],
        getName: function () {
            return this.name
        },
        setName: function (text: string) {
            this.name = text;
        },
        setExternalUserName: function (name: string) {
            return this.attr('label/text', name || '');
        },
        getExternalUserName: function () {
            return this.attr('label/text');
        },
        addSmell: function (smell: Smell) {
            this.attributes.smells.push(smell);
        },
        getSmell: function (name: string) {
            return this.attributes.smells.find(smell => {
                return name === smell.name;
            });
        },
        getSmells: function (): Smell[] {
            return this.attributes.smells;
        },
        resetSmells: function (): void {
            this.attributes.smells = [];
        }
    });

joint.dia.Element.define('microtosca.SquadGroup', {
    position: { x: 20, y: 20 },
    size: {
        width: 200,
        height: 200
    },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: "none",
            stroke: '#7e7e77',
            strokeWidth: 2,
            strokeDasharray: "10,5",
            rx: 10,
            ry: 10,
        },
        label: {
            refX: '50%',
            refY: '0%',
            // yAlignment: 'hanging',
            xAlignment: 'center',
            fontSize: 15,
            text: name || '',
        },
        minimize: {
            refX: '100%',
            refY: '0%',
            fill: '#6a6a62',
            event: 'team:minimize:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refWidth: '10%',
            refHeight: '5%',
            xAlignment: 'center',

        }
    },
    smells: [] // list of smells that affects a single node
}, {
        markup: [{
            tagName: 'rect',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'rect',
            selector: 'minimize'
        }],
        getName: function () {
            return this.attr('label/text');
        },
        setName: function (text) {
            return this.attr('label/text', text || '');
        },
        showDeleteButton: function(){
            this.attr('minimize/visibility', 'visible')
        },
        hideDeleteButton: function(){
            this.attr('minimize/visibility', 'hidden')
        },
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