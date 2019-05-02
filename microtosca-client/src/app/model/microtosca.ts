import * as joint from 'jointjs';
import { SmellObject, WobblyServiceInteractionSmellObject, NoApiGatewaySmellObject, SharedPersistencySmellObject, EndpointBasedServiceInteractionSmellObject, SingleLayerTeamSmellObject } from '../analyser/smell';
import { Attribute } from '@angular/compiler';

let NAME_FONT_SIZE = 14;
let ICON_COLOR_SHARED_PERSISTENCY = "white";
let ICON_COLOR_ENDPOINT_SERVICE_INTERACTION = "white"; //"#00ff00";
let ICON_COLOR_WOBBLY_SERVICE_INTERACTION = "white";//'#0800ee';
let ICON_COLOR_NO_API_GATEWAY = "white";//'#EFF142';
let ICON_COLOR_SINGLE_LAYER_TEAM = "black";//'#c61aff';


// extend joint.shapes namespace
declare module 'jointjs' {
    namespace shapes {
        namespace microtosca {
            class Root extends joint.dia.Element {
                setName(name): void;
                getName(): string;
                addSmell(smell: SmellObject): void;
                getSmell(name: string): SmellObject;
                getSmells(): SmellObject[];
                hideSmell(smell: SmellObject): void;
                showSmell(smell: SmellObject): void;
                resetSmells(): void
                showIcons(): void;
                hideIcons(): void;
                ignoreOnce(smell: SmellObject): void;
                addIgnoreAlwaysSmell(smell: SmellObject): void;
                getIgnoreAlwaysSmells(): SmellObject[];
                undoIgnoreAlways(smell: SmellObject): void;
            }
            class Node extends Root {

            }
            class Service extends Node {
            }
            class Database extends Node {
                topRy(t, opt?):void;
            }
            class CommunicationPattern extends Node {
                setConcreteType(ctype: string): void;
                getConcreteType(): string;
            }
            class Group extends Root {
            }
            class EdgeGroup extends Group {
                setExternalUserName(name: string): void;
                getExternalUserName(): string;
            }
            class SquadGroup extends Group {
            }
            class RunTimeLink extends joint.dia.Link {
                getSource();
                setTimedout(boolean): void;
                hasTimeout(): boolean;
            }
            class DeploymentTimeLink extends joint.dia.Link {
                hasTimeout(): boolean
                setTimedout(boolean): void;
            }
        }
    }
}



joint.dia.Element.define('microtosca.Service', {
    size: { width: 75, height: 75 },
    attrs: {
        body: {
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
            strokeWidth: 8,
            stroke: '#1B6879',
            fill: '#1B6879',
            magnet: true
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '100%',
            refY2: 15,
            fontSize: NAME_FONT_SIZE,
            refWidth: '75%',
            refHeight: '75%',
            fill: 'black',
            text: '',
        },
        delete: {
            d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
            // d: "M12.71,7.291c-0.15-0.15-0.393-0.15-0.542,0L10,9.458L7.833,7.291c-0.15-0.15-0.392-0.15-0.542,0c-0.149,0.149-0.149,0.392,0,0.541L9.458,10l-2.168,2.167c-0.149,0.15-0.149,0.393,0,0.542c0.15,0.149,0.392,0.149,0.542,0L10,10.542l2.168,2.167c0.149,0.149,0.392,0.149,0.542,0c0.148-0.149,0.148-0.392,0-0.542L10.542,10l2.168-2.168C12.858,7.683,12.858,7.44,12.71,7.291z M10,1.188c-4.867,0-8.812,3.946-8.812,8.812c0,4.867,3.945,8.812,8.812,8.812s8.812-3.945,8.812-8.812C18.812,5.133,14.867,1.188,10,1.188z M10,18.046c-4.444,0-8.046-3.603-8.046-8.046c0-4.444,3.603-8.046,8.046-8.046c4.443,0,8.046,3.602,8.046,8.046C18.046,14.443,14.443,18.046,10,18.046z",
            event: 'node:delete:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '60%',
            refY: '0%',
            fill: '#F78686',
            magnet: false
        },
        EndpointBasedServiceInteraction: { // EndpointBasesdServiceInteraction
            fill: ICON_COLOR_ENDPOINT_SERVICE_INTERACTION,
            // stroke:"red",
            strokeWidth:"1",
            d: "M10.292,4.229c-1.487,0-2.691,1.205-2.691,2.691s1.205,2.691,2.691,2.691s2.69-1.205,2.69-2.691" +
								" S11.779,4.229,10.292,4.229z M10.292,8.535c-0.892,0-1.615-0.723-1.615-1.615S9.4,5.306,10.292,5.306"+
								" c0.891,0,1.614,0.722,1.614,1.614S11.184,8.535,10.292,8.535z M10.292,1C6.725,1,3.834,3.892,3.834,7.458"+
								" c0,3.567,6.458,10.764,6.458,10.764s6.458-7.196,6.458-10.764C16.75,3.892,13.859,1,10.292,1z M4.91,7.525"+
								"c0-3.009,2.41-5.449,5.382-5.449c2.971,0,5.381,2.44,5.381,5.449s-5.381,9.082-5.381,9.082S4.91,10.535,4.91,7.525z",
            event: 'smell:EndpointBasedServiceInteraction:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '0%',
            refY: '50%',
            refWidth: '25%',
            refHeight: '25%',
            magnet:false
        },
        wsi: { // WobblyServiceInteractionSmell
            fill: ICON_COLOR_WOBBLY_SERVICE_INTERACTION,
            event: 'smell:WobblyServiceInteractionSmell:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '30%',
            refY: '50%',
            refWidth: '50%',
            refHeight: '50%',
            d:"M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z",
            magnet:false
        },
        NoApiGateway: { // WobblyServiceInteractionSmell
            fill: ICON_COLOR_NO_API_GATEWAY,
            event: 'smell:NoApiGateway:pointerdown',
            d: "M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z",
            visibility: "hidden",
            ref: 'body',
            refX: '60%',
            refY: '50%',
            refWidth: '25%',
            refHeight: '25%',
        }
    },
    smells: [],            // list of smells that affects a single node
    ignoreAlwaysSmells: []       // list of smell ignored (always)
}, {
        markup: [{
            tagName: 'circle',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'path',
            selector: 'EndpointBasedServiceInteraction',
        }, {
            tagName: 'path',
            selector: 'wsi'
        }, {
            tagName: 'path',
            selector: 'NoApiGateway'
        }, {
            tagName: "path",
            selector: "delete"
        }],
        ignoreOnce(smell: SmellObject) {
            this.hideSmell(smell);
        },
        addIgnoreAlwaysSmell(smell: SmellObject) {
            this.hideSmell(smell);
            this.attributes.ignoreAlwaysSmells.push(smell);
        },
        undoIgnoreAlways(smell: SmellObject) {
            this.showSmell(smell);
            this.attributes.ignoreAlwaysSmells = this.attributes.ignoreAlwaysSmells.filter(function (sm) {
                return sm.getName() != smell.getName();
            });
        },
        getIgnoreAlwaysSmells() {
            return this.attributes.ignoreAlwaysSmells;
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
        showIcons: function () {
            this.attr('delete/visibility', 'visible')
        },
        hideIcons: function () {
            this.attr('delete/visibility', 'hidden')
        },
        resetSmells: function () {
            this.attributes.smells = [];
            this.attr('EndpointBasedServiceInteraction/visibility', 'hidden');
            this.attr('wsi/visibility', 'hidden');
            this.attr('NoApiGateway/visibility', 'hidden');
        },
        hideSmell(smell: SmellObject) {
            if (smell instanceof EndpointBasedServiceInteractionSmellObject) {
                this.attr('EndpointBasedServiceInteraction/visibility', 'hidden');
            }
            else if (smell instanceof WobblyServiceInteractionSmellObject) {
                this.attr('wsi/visibility', 'hidden');
            }
            else if (smell instanceof NoApiGatewaySmellObject) {
                this.attr('NoApiGateway/visibility', 'hidden');
            }
        },
        showSmell(smell: SmellObject) {
            if (smell instanceof EndpointBasedServiceInteractionSmellObject) {
                this.attr('EndpointBasedServiceInteraction/visibility', 'visible');
            }
            else if (smell instanceof WobblyServiceInteractionSmellObject) {
                this.attr('wsi/visibility', 'visible');
            }
            else if (smell instanceof NoApiGatewaySmellObject) {
                this.attr('NoApiGateway/visibility', 'visible');
            }
        },
        addSmell: function (smell: SmellObject) {
            this.attributes.smells.push(smell);
            if (smell instanceof EndpointBasedServiceInteractionSmellObject)
                this.attr('EndpointBasedServiceInteraction/visibility', 'visible');
            else if (smell instanceof WobblyServiceInteractionSmellObject)
                this.attr('wsi/visibility', 'visible');
            else if (smell instanceof NoApiGatewaySmellObject)
                this.attr('NoApiGateway/visibility', 'visible');
        }
    });


joint.shapes.standard.Cylinder.define('microtosca.Database', {
    size: {
        width: 20,
        height: 20
    },
    attrs: {
        body: {
            lateralArea: "10%",
            fill: '#1BCBD6',
            stroke: '#333333',
            strokeWidth: 2
        },
        top: {
            refCx: '50%',
            cy: 100,
            refRx: '50%',
            ry: 100,
            fill: '#9BCBD6',
            stroke: '#333333',
            strokeWidth: 2
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '100%',
            refY2: 15,
            fontSize: NAME_FONT_SIZE,
            fill: '#333333'
        },
        delete: {
            d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
            event: 'node:delete:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '60%',
            refY: '0',
            refWidth: '5%',
            refHeight: '5%',
            fill: '#F78686',
        },
        sp: { // SharedPersitency
            fill: ICON_COLOR_SHARED_PERSISTENCY,
            strokeWidth:"10", 
            d: "M14.68,12.621c-0.9,0-1.702,0.43-2.216,1.09l-4.549-2.637c0.284-0.691,0.284-1.457,0-2.146l4.549-2.638c0.514,0.661,1.315,1.09,2.216,1.09c1.549,0,2.809-1.26,2.809-2.808c0-1.548-1.26-2.809-2.809-2.809c-1.548,0-2.808,1.26-2.808,2.809c0,0.38,0.076,0.741,0.214,1.073l-4.55,2.638c-0.515-0.661-1.316-1.09-2.217-1.09c-1.548,0-2.808,1.26-2.808,2.809s1.26,2.808,2.808,2.808c0.9,0,1.702-0.43,2.217-1.09l4.55,2.637c-0.138,0.332-0.214,0.693-0.214,1.074c0,1.549,1.26,2.809,2.808,2.809c1.549,0,2.809-1.26,2.809-2.809S16.229,12.621,14.68,12.621M14.68,2.512c1.136,0,2.06,0.923,2.06,2.06S15.815,6.63,14.68,6.63s-2.059-0.923-2.059-2.059S13.544,2.512,14.68,2.512M5.319,12.061c-1.136,0-2.06-0.924-2.06-2.06s0.923-2.059,2.06-2.059c1.135,0,2.06,0.923,2.06,2.059S6.454,12.061,5.319,12.061M14.68,17.488c-1.136,0-2.059-0.922-2.059-2.059s0.923-2.061,2.059-2.061s2.06,0.924,2.06,2.061S15.815,17.488,14.68,17.488",
            event: 'smell:SharedPersistency:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refY: '50%',
            refX: '50%',
            refWidth: '50%',
            refHeight: '50%',
        },
        smells: [], // list of smells that affects a single node
        ignoreAlwaysSmells: []
    }
}, {
    markup: [{
        tagName: 'path',
        selector: 'body'
    }, {
        tagName: 'ellipse',
        selector: 'top'
    }, {
        tagName: 'text',
        selector: 'label'
    },{
        tagName: 'path',
        selector: 'sp'
    }, {
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
            console.log("esearching; ", name);
            return this.attributes.smells.find(smell => {
                console.log(smell.getName());
                return name === smell.getName();
            });
        },
        ignoreOnce(smell: SmellObject) {
            this.hideSmell(smell);
        },
        resetSmells: function () {
            this.attributes.smells = [];
            this.attr('sp/visibility', 'hidden');
        },
        addSmell: function (smell: SmellObject) {
            this.attributes.smells.push(smell);
            if (smell instanceof SharedPersistencySmellObject) {
                this.attr('sp/visibility', 'visible');
            }
            this.set('z', 123)
        },
        showSmell(smell: SmellObject) {
            if (smell instanceof SharedPersistencySmellObject) {
                this.attr('sp/visibility', 'visible');
            }
        },
        hideSmell(smell: SmellObject) {
            if (smell instanceof SharedPersistencySmellObject) {
                this.attr('sp/visibility', 'hidden');
            }
        },
        addIgnoreAlwaysSmell(smell: SmellObject) {
            this.hideSmell(smell);
            this.attributes.ignoreAlwaysSmells.push(smell);
        },
        undoIgnoreAlways(smell: SmellObject) {
            this.showSmell(smell);
            this.attributes.ignoreAlwaysSmells = this.attributes.ignoreAlwaysSmells.filter(function (sm) {
                return sm.getName() != smell.getName();
            });
        },
        getIgnoreAlwaysSmells() {
            return this.attributes.ignoreAlwaysSmells;
        },
        showIcons: function () {
            this.attr('delete/visibility', 'visible')
        },
        hideIcons: function () {
            this.attr('delete/visibility', 'hidden')
        },

        topRy: function (t, opt) {
            // getter
            if (t === undefined) return this.attr('body/lateralArea');

            // setter
            var isPercentage = joint.util.isPercentage(t);

            var bodyAttrs = { lateralArea: t };
            var topAttrs = isPercentage
                ? { refCy: t, refRy: t, cy: null, ry: null }
                : { refCy: null, refRy: null, cy: t, ry: t };

            return this.attr({ body: bodyAttrs, top: topAttrs }, opt);
        }

    }, {

    });

//  joint.dia.Element.define('microtosca.Database', {
//     size: {
//         width: 110,
//         height: 100
//     },
//     attrs: {
//         body: {
//             refWidth: '100%',
//             refHeight: '100%',
//             fill: '#74B7C6',
//             stroke: '#74B7C6',
//             strokeWidth: 8,
//             rx: 10,
//             ry: 10,
//             magnet: true
//         },
//         label: {
//             refX: '50%',
//             refY: '50%',
//             yAlignment: 'middle',
//             xAlignment: 'middle',
//             fontSize: 18,
//             fill: 'white',
//             text: name || '',
//         },
//         delete: {
//             d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
//             event: 'node:delete:pointerdown',
//             visibility: "hidden",
//             ref: 'body',
//             refX: '-50%',
//             refY: '-50%',
//             refWidth: '5%',
//             refHeight: '5%',
//             fill: '#F78686',
//             magnet: false
//         },
//         sp: { // SharedPersitency
//             fill: '#FC2B01',
//             event: 'smell:SharedPersistency:pointerdown',
//             visibility: "hidden",
//             ref: 'body',
//             refY: '100%',
//             refWidth: '25%',
//             refHeight: '25%',
//         },

//     },
//     smells: [], // list of smells that affects a single node
//     ignoreAlwaysSmells: []
// }, {
//          markup: [{
//             tagName: 'rect',
//             selector: 'body',
//         }, {
//             tagName: 'text',
//             selector: 'label'
//         }, {
//             tagName: 'rect',
//             selector: 'sp'
//         }, {
//             tagName: "path",
//             selector: "delete"
//         }],
//         getName: function () {
//             return this.attr('label/text');
//         },
//         setName: function (text) {
//             return this.attr('label/text', text || '');
//         },
//         getSmells: function () {
//             return this.attributes.smells;
//         },
//         getSmell: function (name: string) {
//             console.log("esearching; ", name);
//             return this.attributes.smells.find(smell => {
//                 console.log(smell.getName());
//                 return name === smell.getName();
//             });
//         },
//         ignoreOnce(smell: SmellObject) {
//             this.hideSmell(smell);
//         },
//         resetSmells: function () {
//             this.attributes.smells = [];
//             this.attr('sp/visibility', 'hidden');
//         },
//         addSmell: function (smell: SmellObject) {
//             this.attributes.smells.push(smell);
//             if (smell instanceof SharedPersistencySmellObject) {
//                 this.attr('sp/visibility', 'visible');
//             }
//         },
//         showSmell(smell: SmellObject) {
//             if (smell instanceof SharedPersistencySmellObject) {
//                 this.attr('sp/visibility', 'visible');
//             }
//         },
//         hideSmell(smell: SmellObject) {
//             if (smell instanceof SharedPersistencySmellObject) {
//                 this.attr('sp/visibility', 'hidden');
//             }
//         },
//         addIgnoreAlwaysSmell(smell: SmellObject) {
//             this.hideSmell(smell);
//             this.attributes.ignoreAlwaysSmells.push(smell);
//         },
//         undoIgnoreAlways(smell: SmellObject) {
//             this.showSmell(smell);
//             this.attributes.ignoreAlwaysSmells = this.attributes.ignoreAlwaysSmells.filter(function (sm) {
//                 return sm.getName() != smell.getName();
//             });
//         },
//         getIgnoreAlwaysSmells() {
//             return this.attributes.ignoreAlwaysSmells;
//         },
//         showIcons: function () {
//             this.attr('delete/visibility', 'visible')
//         },
//         hideIcons: function () {
//             this.attr('delete/visibility', 'hidden')
//         }

//     });

joint.dia.Element.define('microtosca.CommunicationPattern', {
    size: { width: 50, height: 50 },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#74B7C6',
            magnet: true
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '100%',
            refY2: 14,
            fontSize: NAME_FONT_SIZE,
            fill: 'black',
            text: ''
        },
        delete: {
            d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
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
            refY: '125%',
            refY2: 18,
            fontSize: NAME_FONT_SIZE - 4,
            fill: '#333333',
            text: ''
        }
    },
    smells: [] // list of smells that affects a single node
}, {
        markup: [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'text',
            selector: 'type'
        }, {
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
        },
        addSmell: function (smell: SmellObject) {
        },
        showIcons: function () {
            this.attr('delete/visibility', 'visible')
        },
        hideIcons: function () {
            this.attr('delete/visibility', 'hidden')
        },
        getIgnoreAlwaysSmells: function () {
            return [];
        }
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
            d: "M55.014,45.389l-9.553-4.776C44.56,40.162,44,39.256,44,38.248v-3.381c0.229-0.28,0.47-0.599,0.719-0.951 c1.239-1.75,2.232-3.698,2.954-5.799C49.084,27.47,50,26.075,50,24.5v-4c0-0.963-0.36-1.896-1-2.625v-5.319  c0.056-0.55,0.276-3.824-2.092-6.525C44.854,3.688,41.521,2.5,37,2.5s-7.854,1.188-9.908,3.53c-1.435,1.637-1.918,3.481-2.064,4.805  C23.314,9.949,21.294,9.5,19,9.5c-10.389,0-10.994,8.855-11,9v4.579c-0.648,0.706-1,1.521-1,2.33v3.454  c0,1.079,0.483,2.085,1.311,2.765c0.825,3.11,2.854,5.46,3.644,6.285v2.743c0,0.787-0.428,1.509-1.171,1.915l-6.653,4.173  C1.583,48.134,0,50.801,0,53.703V57.5h14h2h44v-4.043C60,50.019,58.089,46.927,55.014,45.389z M14,53.262V55.5H2v-1.797  c0-2.17,1.184-4.164,3.141-5.233l6.652-4.173c1.333-0.727,2.161-2.121,2.161-3.641v-3.591l-0.318-0.297  c-0.026-0.024-2.683-2.534-3.468-5.955l-0.091-0.396l-0.342-0.22C9.275,29.899,9,29.4,9,28.863v-3.454  c0-0.36,0.245-0.788,0.671-1.174L10,23.938l-0.002-5.38C10.016,18.271,10.537,11.5,19,11.5c2.393,0,4.408,0.553,6,1.644v4.731  c-0.64,0.729-1,1.662-1,2.625v4c0,0.304,0.035,0.603,0.101,0.893c0.027,0.116,0.081,0.222,0.118,0.334  c0.055,0.168,0.099,0.341,0.176,0.5c0.001,0.002,0.002,0.003,0.003,0.005c0.256,0.528,0.629,1,1.099,1.377  c0.005,0.019,0.011,0.036,0.016,0.054c0.06,0.229,0.123,0.457,0.191,0.68l0.081,0.261c0.014,0.046,0.031,0.093,0.046,0.139  c0.035,0.108,0.069,0.215,0.105,0.321c0.06,0.175,0.123,0.356,0.196,0.553c0.031,0.082,0.065,0.156,0.097,0.237  c0.082,0.209,0.164,0.411,0.25,0.611c0.021,0.048,0.039,0.1,0.06,0.147l0.056,0.126c0.026,0.058,0.053,0.11,0.079,0.167  c0.098,0.214,0.194,0.421,0.294,0.621c0.016,0.032,0.031,0.067,0.047,0.099c0.063,0.125,0.126,0.243,0.189,0.363  c0.108,0.206,0.214,0.4,0.32,0.588c0.052,0.092,0.103,0.182,0.154,0.269c0.144,0.246,0.281,0.472,0.414,0.682  c0.029,0.045,0.057,0.092,0.085,0.135c0.242,0.375,0.452,0.679,0.626,0.916c0.046,0.063,0.086,0.117,0.125,0.17  c0.022,0.029,0.052,0.071,0.071,0.097v3.309c0,0.968-0.528,1.856-1.377,2.32l-2.646,1.443l-0.461-0.041l-0.188,0.395l-5.626,3.069  C15.801,46.924,14,49.958,14,53.262z M58,55.5H16v-2.238c0-2.571,1.402-4.934,3.659-6.164l8.921-4.866  C30.073,41.417,31,39.854,31,38.155v-4.018v-0.001l-0.194-0.232l-0.038-0.045c-0.002-0.003-0.064-0.078-0.165-0.21  c-0.006-0.008-0.012-0.016-0.019-0.024c-0.053-0.069-0.115-0.152-0.186-0.251c-0.001-0.002-0.002-0.003-0.003-0.005  c-0.149-0.207-0.336-0.476-0.544-0.8c-0.005-0.007-0.009-0.015-0.014-0.022c-0.098-0.153-0.202-0.32-0.308-0.497  c-0.008-0.013-0.016-0.026-0.024-0.04c-0.226-0.379-0.466-0.808-0.705-1.283c0,0-0.001-0.001-0.001-0.002  c-0.127-0.255-0.254-0.523-0.378-0.802l0,0c-0.017-0.039-0.035-0.077-0.052-0.116h0c-0.055-0.125-0.11-0.256-0.166-0.391  c-0.02-0.049-0.04-0.1-0.06-0.15c-0.052-0.131-0.105-0.263-0.161-0.414c-0.102-0.272-0.198-0.556-0.29-0.849l-0.055-0.178  c-0.006-0.02-0.013-0.04-0.019-0.061c-0.094-0.316-0.184-0.639-0.26-0.971l-0.091-0.396l-0.341-0.22  C26.346,25.803,26,25.176,26,24.5v-4c0-0.561,0.238-1.084,0.67-1.475L27,18.728V12.5v-0.354l-0.027-0.021  c-0.034-0.722,0.009-2.935,1.623-4.776C30.253,5.458,33.081,4.5,37,4.5c3.905,0,6.727,0.951,8.386,2.828  c1.947,2.201,1.625,5.017,1.623,5.041L47,18.728l0.33,0.298C47.762,19.416,48,19.939,48,20.5v4c0,0.873-0.572,1.637-1.422,1.899  l-0.498,0.153l-0.16,0.495c-0.669,2.081-1.622,4.003-2.834,5.713c-0.297,0.421-0.586,0.794-0.837,1.079L42,34.123v4.125  c0,1.77,0.983,3.361,2.566,4.153l9.553,4.776C56.513,48.374,58,50.78,58,53.457V55.5z",
            strokeWidth: 2,
            stroke: '#C2C2C2',
            fill: "#C2C2C2",
            magnet: true
        },
        label: {
            refX: '0%',
            refY: '90%',
            fontSize: 18,
            text: name || '',
        },
    },
    groupName: '', // groupName of the group. each nodes connected to this node are considered memeber of the EdgeGroup
    smells: [] // list of smells that affects a single node
}, {
        markup: [{
            tagName: 'path',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }],
        getName: function () {
            return this.groupName
        },
        setName: function (text: string) {
            this.groupName = text;
        },
        setExternalUserName: function (name: string) {
            return this.attr('label/text', name || '');
        },
        getExternalUserName: function () {
            return this.attr('label/text');
        },
        addSmell: function (smell: SmellObject) {
            this.attributes.smells.push(smell);
        },
        getSmell: function (name: string) {
            return this.attributes.smells.find(smell => {
                console.log(smell);
                return name === smell.name;
            });
        },
        getSmells: function (): SmellObject[] {
            return this.attributes.smells;
        },
        resetSmells: function (): void {
            this.attributes.smells = [];
        },
        showIcons: function () {
            // this.attr('delete/visibility', 'visible')
        },
        hideIcons: function () {
            // this.attr('delete/visibility', 'hidden')
        },
        getIgnoreAlwaysSmells: function () {
            return [];
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
            refX: '70%',
            refY: '-15%',
            // yAlignment: 'hanging',
            xAlignment: 'center',
            fontSize: 18,
            text: name || '',
        },
        minimize: {
            refX: '100%',
            refY: '0%',
            fill: '#6a6a62',
            event: 'team:minimize:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refWidth: '7%',
            refHeight: '5%',
            xAlignment: 'center',
        },
        singleLayerTeam: {
            fill: ICON_COLOR_SINGLE_LAYER_TEAM,
            event: 'smell:SingleLayerTeam:pointerdown',
            d:"M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z",
            visibility: "hidden",
            ref: 'body',
            refX: '0%',
            refY: '100%',
            refWidth: '1%',
            refHeight: '1%',
            height:"1000",
            width:"1000",
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
            selector: 'minimize'
        }, {
            tagName: 'path',
            selector: 'singleLayerTeam'
        }],
        getName: function () {
            return this.attr('label/text');
        },
        setName: function (text) {
            return this.attr('label/text', text || '');
        },
        showIcons: function () {
            this.attr('minimize/visibility', 'visible')
        },
        hideIcons: function () {
            this.attr('minimize/visibility', 'hidden')
        },
        addSmell: function (smell: SmellObject) {
            this.attributes.smells.push(smell);
            if (smell instanceof SingleLayerTeamSmellObject)
                this.attr('singleLayerTeam/visibility', 'visible');
        },
        getSmell: function (name: string) {
            return this.attributes.smells.find(smell => {
                return name === smell.name;
            });
        },
        resetSmells: function () {
            this.attributes.smells = [];
            this.attr('singleLayerTeam/visibility', 'hidden');
        },
        getIgnoreAlwaysSmells: function () {
            return [];
        }
    });


joint.dia.Link.define('microtosca.RunTimeLink', {
    smooth: true,
    attrs: {
        line: {
            connection: true,
            stroke: '#0E343D',
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
    timeout: false
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
        }],
        setTimedout: function (value: boolean) {
            this.timeout = value;

            if (this.timeout)
                this._showTimeout();
            else
                this._removeTimeout()

        },
        hasTimeout: function () {
            return this.timeout;
        },
        _showTimeout: function () {
            console.log("Showing TIMEOUT on interaction");
            this.insertLabel(0, {
                markup: [
                    {
                        tagName: 'path',
                        selector: 'clock'
                    }, 
                ],
                attrs: {
                    clock: {
                        d:"M11.088,2.542c0.063-0.146,0.103-0.306,0.103-0.476c0-0.657-0.534-1.19-1.19-1.19c-0.657,0-1.19,0.533-1.19,1.19c0,0.17,0.038,0.33,0.102,0.476c-4.085,0.535-7.243,4.021-7.243,8.252c0,4.601,3.73,8.332,8.332,8.332c4.601,0,8.331-3.73,8.331-8.332C18.331,6.562,15.173,3.076,11.088,2.542z M10,1.669c0.219,0,0.396,0.177,0.396,0.396S10.219,2.462,10,2.462c-0.22,0-0.397-0.177-0.397-0.396S9.78,1.669,10,1.669z M10,18.332c-4.163,0-7.538-3.375-7.538-7.539c0-4.163,3.375-7.538,7.538-7.538c4.162,0,7.538,3.375,7.538,7.538C17.538,14.957,14.162,18.332,10,18.332z M10.386,9.26c0.002-0.018,0.011-0.034,0.011-0.053V5.24c0-0.219-0.177-0.396-0.396-0.396c-0.22,0-0.397,0.177-0.397,0.396v3.967c0,0.019,0.008,0.035,0.011,0.053c-0.689,0.173-1.201,0.792-1.201,1.534c0,0.324,0.098,0.625,0.264,0.875c-0.079,0.014-0.155,0.043-0.216,0.104l-2.244,2.244c-0.155,0.154-0.155,0.406,0,0.561s0.406,0.154,0.561,0l2.244-2.242c0.061-0.062,0.091-0.139,0.104-0.217c0.251,0.166,0.551,0.264,0.875,0.264c0.876,0,1.587-0.711,1.587-1.587C11.587,10.052,11.075,9.433,10.386,9.26z M10,11.586c-0.438,0-0.793-0.354-0.793-0.792c0-0.438,0.355-0.792,0.793-0.792c0.438,0,0.793,0.355,0.793,0.792C10.793,11.232,10.438,11.586,10,11.586z",
                        fill: 'none',
                        stroke: '#0E343D',
                        strokeWidth: 0.5,

                    },
                }
            });
        },
        _removeTimeout: function () {
            this.removeLabel(0);
        }

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
    },
    timeout: false
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
        }],

        setTimedout: function (value: boolean) {
            this.timeout = value;
        },
        hasTimeout: function () {
            return this.timeout;
        },
    }
);


// demonstrate creating a custom dummy view for the app.CustomRect
namespace CustomViews {

    export class MyLinkView extends joint.dia.LinkView {

        initialize() {
            console.log("MYLINK VIEW INITIALIZE");
            super.initialize.apply(this, arguments);
        }

        render() {
            super.render();
            return this;
        }
    }

    export class ServiceView extends joint.dia.ElementView {

        initialize() {
            super.initialize.apply(this, arguments);

        }

        render() {
            super.render();
            // this.model.prop('smells').forEach(smell => {
            //     console.log(smell);
            // });

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