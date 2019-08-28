import * as joint from 'jointjs';
import { SmellObject, WobblyServiceInteractionSmellObject, NoApiGatewaySmellObject, SharedPersistencySmellObject, EndpointBasedServiceInteractionSmellObject, SingleLayerTeamSmellObject } from '../analyser/smell';

let NODE_LABEL_FONT_SIZE = 20;
let COMMUNICATION_PATTERN_TYPE_FONT_SIZE = 18;
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
            class Datastore extends Node {
                topRy(t, opt?): void;
            }
            class CommunicationPattern extends Node {
                setType(ctype: string): void;
                getType(): string;
            }
            class Group extends Root {
                addMember(node:joint.shapes.microtosca.Node): void
                getMembers(): joint.shapes.microtosca.Root[]
                getInternalLinks(): joint.shapes.microtosca.RunTimeLink[]

            }
            class EdgeGroup extends Group {
                setExternalUserName(name: string): void;
                getExternalUserName(): string;
            }
            class SquadGroup extends Group {
            }
            class RunTimeLink extends joint.dia.Link {
                setTimedout(boolean): void;
                setCircuitBreaker(boolean): void;
                setDynamicDiscovery(boolean): void;
                hasTimeout(): boolean;
                hasDynamicDiscovery(): boolean;
                hasCircuitBreaker(): boolean;
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
            //strokeWidth: 8,
            stroke: '#1B6879',
            fill: '#1B6879',
            magnet: false
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '100%',
            refY2: 15,
            fontSize: NODE_LABEL_FONT_SIZE,
            refWidth: '75%',
            refHeight: '75%',
            fill: 'black',
            text: '',
        },
        button: {
            ref: 'body',
            refX: '80%',
            refY: '0%',
            event: 'node:delete:pointerdown',
            visibility: "hidden",
        },
        icon: {
            visibility: "hidden",
            ref: "button",
            refX: '50%',
            refY: '50%',
        },
        EndpointBasedServiceInteraction: { // EndpointBasesdServiceInteraction
            fill: ICON_COLOR_ENDPOINT_SERVICE_INTERACTION,
            // stroke:"red",
            strokeWidth: "1",
            d: "M10.292,4.229c-1.487,0-2.691,1.205-2.691,2.691s1.205,2.691,2.691,2.691s2.69-1.205,2.69-2.691" +
                " S11.779,4.229,10.292,4.229z M10.292,8.535c-0.892,0-1.615-0.723-1.615-1.615S9.4,5.306,10.292,5.306" +
                " c0.891,0,1.614,0.722,1.614,1.614S11.184,8.535,10.292,8.535z M10.292,1C6.725,1,3.834,3.892,3.834,7.458" +
                " c0,3.567,6.458,10.764,6.458,10.764s6.458-7.196,6.458-10.764C16.75,3.892,13.859,1,10.292,1z M4.91,7.525" +
                "c0-3.009,2.41-5.449,5.382-5.449c2.971,0,5.381,2.44,5.381,5.449s-5.381,9.082-5.381,9.082S4.91,10.535,4.91,7.525z",
            event: 'smell:EndpointBasedServiceInteraction:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '0%',
            refY: '50%',
            refWidth: '25%',
            refHeight: '25%',
            magnet: false
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
            d: "M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z",
            magnet: false
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
        },
        {
            tagName: "path",
            selector: "delete"
        },
        {
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 7,
                'fill': '#FF1D00',
                'cursor': 'pointer'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -3 -3 3 3 M -3 3 3 -3',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
        }
        ],
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
            this.attr('icon/visibility', 'visible');
            this.attr('button/visibility', 'visible');

        },
        hideIcons: function () {
            this.attr('icon/visibility', 'hidden');
            this.attr('button/visibility', 'hidden');
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


joint.shapes.standard.Cylinder.define('microtosca.Datastore', {
    size: {
        width: 20,
        height: 20
    },
    attrs: {
        body: {
            magnet: false,
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
            fontSize: NODE_LABEL_FONT_SIZE,
            fill: '#333333'
        },
        button: {
            ref: 'body',
            refX: '80%',
            refY: '0%',
            event: 'node:delete:pointerdown',
            visibility: "hidden",
        },
        icon: {
            visibility: "hidden",
            ref: "button",
            refX: '50%',
            refY: '50%',
        },
        sp: { // SharedPersitency
            fill: ICON_COLOR_SHARED_PERSISTENCY,
            strokeWidth: "10",
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
        }, {
            tagName: 'path',
            selector: 'sp'
        }, {
            tagName: "path",
            selector: "delete"
        }, {
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 7,
                'fill': '#FF1D00',
                'cursor': 'pointer'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -3 -3 3 3 M -3 3 3 -3',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
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
            this.attr('icon/visibility', 'visible');
            this.attr('button/visibility', 'visible');

        },
        hideIcons: function () {
            this.attr('icon/visibility', 'hidden');
            this.attr('button/visibility', 'hidden');
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

joint.dia.Element.define('microtosca.CommunicationPattern', {
    size: { width: 50, height: 50 },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#74B7C6',
            magnet: false,
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '100%',
            refY2: 14,
            fontSize: NODE_LABEL_FONT_SIZE,
            fill: 'black',
            text: ''
        },
        button: {
            ref: 'body',
            refX: '80%',
            refY: '0%',
            event: 'node:delete:pointerdown',
            visibility: "hidden",
        },
        icon: {
            visibility: "hidden",
            ref: "button",
            refX: '50%',
            refY: '50%',
        },
        type: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            //visibility: "visible",
            refX: '50%',
            refY: '40%',
            // refY2: 18,
            fontSize: COMMUNICATION_PATTERN_TYPE_FONT_SIZE,
            fill: '#333333',
            text: ''
        },
        NoApiGateway: {
            fill: ICON_COLOR_NO_API_GATEWAY,
            event: 'smell:NoApiGateway:pointerdown',
            d: "M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z",
            visibility: "hidden",
            ref: 'body',
            refX: '50%',
            refY: '50%',
            refWidth: '100%',
            refHeight: '100%',
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
        }, {
            tagName: 'path',
            selector: 'NoApiGateway'
        }, {
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 7,
                'fill': '#FF1D00',
                'cursor': 'pointer'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -3 -3 3 3 M -3 3 3 -3',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
        }],
        getName: function () {
            return this.attr('label/text');
        },
        getSmell: function (name: string) {
            return this.attributes.smells.find(smell => {
                return name === smell.name;
            });
        },
        getSmells: function () {
            return this.attributes.smells;
        },
        setName: function (text) {
            return this.attr('label/text', text || '');
        },
        setType: function (text) {
            return this.attr('type/text', `${text}` || '');
        },
        getType: function () {
            return this.attr('type/text');
        },
        ignoreOnce(smell: SmellObject) {
            this.hideSmell(smell);
        },
        resetSmells: function () {
            this.attributes.smells = [];
        },
        addSmell: function (smell: SmellObject) {
            this.attributes.smells.push(smell);
            if (smell instanceof NoApiGatewaySmellObject)
                this.attr('NoApiGateway/visibility', 'visible');
        },
        hideSmell: function (smell: SmellObject) {
            if (smell instanceof NoApiGatewaySmellObject) {
                this.attr('NoApiGateway/visibility', 'hidden');
            }
        },
        showIcons: function () {
            this.attr('icon/visibility', 'visible');
            this.attr('button/visibility', 'visible');

        },
        hideIcons: function () {
            this.attr('icon/visibility', 'hidden');
            this.attr('button/visibility', 'hidden');
        },
        getIgnoreAlwaysSmells: function () {
            return [];
        }
    });

joint.dia.Element.define('microtosca.Group', {
}, {
        markup: [],
        

    }
);

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
            d: "M48.355,17.922c3.705,2.323,6.303,6.254,6.776,10.817c1.511,0.706,3.188,1.112,4.966,1.112   c6.491,0,11.752-5.261,11.752-11.751c0-6.491-5.261-11.752-11.752-11.752C53.668,6.35,48.453,11.517,48.355,17.922z M40.656,41.984   c6.491,0,11.752-5.262,11.752-11.752s-5.262-11.751-11.752-11.751c-6.49,0-11.754,5.262-11.754,11.752S34.166,41.984,40.656,41.984   z M45.641,42.785h-9.972c-8.297,0-15.047,6.751-15.047,15.048v12.195l0.031,0.191l0.84,0.263   c7.918,2.474,14.797,3.299,20.459,3.299c11.059,0,17.469-3.153,17.864-3.354l0.785-0.397h0.084V57.833   C60.688,49.536,53.938,42.785,45.641,42.785z M65.084,30.653h-9.895c-0.107,3.959-1.797,7.524-4.47,10.088   c7.375,2.193,12.771,9.032,12.771,17.11v3.758c9.77-0.358,15.4-3.127,15.771-3.313l0.785-0.398h0.084V45.699   C80.13,37.403,73.38,30.653,65.084,30.653z M20.035,29.853c2.299,0,4.438-0.671,6.25-1.814c0.576-3.757,2.59-7.04,5.467-9.276   c0.012-0.22,0.033-0.438,0.033-0.66c0-6.491-5.262-11.752-11.75-11.752c-6.492,0-11.752,5.261-11.752,11.752   C8.283,24.591,13.543,29.853,20.035,29.853z M30.589,40.741c-2.66-2.551-4.344-6.097-4.467-10.032   c-0.367-0.027-0.73-0.056-1.104-0.056h-9.971C6.75,30.653,0,37.403,0,45.699v12.197l0.031,0.188l0.84,0.265   c6.352,1.983,12.021,2.897,16.945,3.185v-3.683C17.818,49.773,23.212,42.936,30.589,40.741z",
            strokeWidth: 1,
            stroke: '#C2C2C2',
            fill:"#E5E7E9",
            fillOpacity:"0.2",
            magnet: false
        },
        label: {
            refX: '0%',
            refY: '100%',
            fontSize: NODE_LABEL_FONT_SIZE,
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
            minWidth:"200px",
            // width: '150pc',
            // height: '100%',
            fill:"#E5E7E9",
            fillOpacity:"0.4",
            stroke: '#7e7e77', 
            strokeWidth: 2,
            strokeDasharray: "10,5",
            rx: 10,
            ry: 10,
            magnet: false
        },
        label: {
            refX: '50%',
            refY: '-5%',
            // yAlignment: 'hanging',
            xAlignment: 'center',
            fontSize: 18,
            text: name || '',
            magnet: false
        },
        minimize: {
            refX: '100%',
            refY: '0%',
            fill: '#6a6a62',
            event: 'team:minimize:pointerdown',
            visibility: "hidden",
            ref: 'body',
            width: '15px',
            height: '15px',
            xAlignment: 'center',
        },
        maximize: {
            refX: '105%',
            refY: '0%',
            fill: '#F50C0C',
            event: 'team:maximize:pointerdown',
            visibility: "hidden",
            ref: 'body',
            width: '15px',
            height: '15px',
            xAlignment: 'center',
        },
        singleLayerTeam: {
            fill: ICON_COLOR_SINGLE_LAYER_TEAM,
            event: 'smell:SingleLayerTeam:pointerdown',
            d: "M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z",
            visibility: "hidden",
            ref: 'body',
            refX: '0%',
            refY: '100%',
            refWidth: '1%',
            refHeight: '1%',
            height: "1000",
            width: "1000",
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
            tagName: 'rect',
            selector: 'maximize'
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
            this.attr('minimize/visibility', "visible");
            this.attr('maximize/visibility', 'visible');
        },
        hideIcons: function () {
            this.attr('minimize/visibility', "hidden");
            this.attr('maximize/visibility', 'hidden')
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
        },

        addMember: function(node:joint.shapes.microtosca.Node){
            this.embed(node);
            this.toBack();
            this.fitEmbeds({ padding: 40});
        },
        getMembers: function () {
            var members = [];
            this.getEmbeddedCells().forEach(cell => {
                members.push(<joint.shapes.microtosca.Root>cell);
            });
            return members;
        },

    });


// joint.dia.Link
joint.shapes.standard.Link.define('microtosca.RunTimeLink', {
    // joint.dia.Link.define('microtosca.RunTimeLink', {
    smooth: true,
    // attrs: {
    //     // line: {
    //     //     connection: true,
    //     //     stroke: '#0E343D',
    //     //     strokeWidth: 2,
    //     // },
    //     // wrapper: {
    //     //     // connection: true,
    //     //     strokeWidth: 10,
    //     //     strokeLinejoin: 'round'
    //     // }
    // },

    timeout: false,
    circuit_breaker: false,
    dynamic_discovery: false
}, {
        // markup: [{
        //     tagName: 'path',
        //     selector: 'wrapper',
        //     attributes: {
        //         'fill': 'none',
        //         'cursor': 'pointer',
        //         'stroke': 'transparent'
        //     }
        // }, {
        //     tagName: 'path',
        //     selector: 'line',
        //     attributes: {
        //         'fill': 'none',
        //         'pointer-events': 'none'
        //     }
        // }],
        setTimedout: function (value: boolean) {
            this.timeout = value;
            if (this.timeout)
                this._showTimeout();
            else
                this._hideTimeout()
        },
        setCircuitBreaker: function (value: boolean) {
            this.circuit_breaker = value;
            if (this.circuit_breaker)
                this._showCircuitBreaker()
            else
                this._hideCircuitBreaker()
        },
        setDynamicDiscovery: function (value: boolean) {
            this.dynamic_discovery = value;
            if (this.dynamic_discovery)
                this._showDynamicDiscovery();
            else {
                this._hideDynamicDiscovery();
            }
        },
        hasTimeout: function () {
            return this.timeout;
        },
        hasDynamicDiscovery: function () {
            return this.dynamic_discovery;
        },
        hasCircuitBreaker: function () {
            return this.circuit_breaker;
        },
        _showTimeout: function () {
            this.insertLabel(0, {
                markup: [
                    {
                        tagName: 'path',
                        selector: 'clock'
                    },
                ],
                position: .5, // place it halfway on the link (0-1)
                attrs: {
                    clock: {
                        d: "M11.088,2.542c0.063-0.146,0.103-0.306,0.103-0.476c0-0.657-0.534-1.19-1.19-1.19c-0.657,0-1.19,0.533-1.19,1.19c0,0.17,0.038,0.33,0.102,0.476c-4.085,0.535-7.243,4.021-7.243,8.252c0,4.601,3.73,8.332,8.332,8.332c4.601,0,8.331-3.73,8.331-8.332C18.331,6.562,15.173,3.076,11.088,2.542z M10,1.669c0.219,0,0.396,0.177,0.396,0.396S10.219,2.462,10,2.462c-0.22,0-0.397-0.177-0.397-0.396S9.78,1.669,10,1.669z M10,18.332c-4.163,0-7.538-3.375-7.538-7.539c0-4.163,3.375-7.538,7.538-7.538c4.162,0,7.538,3.375,7.538,7.538C17.538,14.957,14.162,18.332,10,18.332z M10.386,9.26c0.002-0.018,0.011-0.034,0.011-0.053V5.24c0-0.219-0.177-0.396-0.396-0.396c-0.22,0-0.397,0.177-0.397,0.396v3.967c0,0.019,0.008,0.035,0.011,0.053c-0.689,0.173-1.201,0.792-1.201,1.534c0,0.324,0.098,0.625,0.264,0.875c-0.079,0.014-0.155,0.043-0.216,0.104l-2.244,2.244c-0.155,0.154-0.155,0.406,0,0.561s0.406,0.154,0.561,0l2.244-2.242c0.061-0.062,0.091-0.139,0.104-0.217c0.251,0.166,0.551,0.264,0.875,0.264c0.876,0,1.587-0.711,1.587-1.587C11.587,10.052,11.075,9.433,10.386,9.26z M10,11.586c-0.438,0-0.793-0.354-0.793-0.792c0-0.438,0.355-0.792,0.793-0.792c0.438,0,0.793,0.355,0.793,0.792C10.793,11.232,10.438,11.586,10,11.586z",
                        fill: 'none',
                        stroke: '#0E343D',
                        strokeWidth: 0.5,

                    },
                }
            });
        },
        _showCircuitBreaker: function () {
            this.insertLabel(1, {
                markup: [
                    {
                        tagName: 'path',
                        selector: 'clock'
                    },
                ],
                position: .35,
                attrs: {
                    clock: {
                        d: "M9.634,10.633c0.116,0.113,0.265,0.168,0.414,0.168c0.153,0,0.308-0.06,0.422-0.177l4.015-4.111c0.229-0.235,0.225-0.608-0.009-0.836c-0.232-0.229-0.606-0.222-0.836,0.009l-3.604,3.689L6.35,5.772C6.115,5.543,5.744,5.55,5.514,5.781C5.285,6.015,5.29,6.39,5.522,6.617L9.634,10.633z",
                        fill: 'none',
                        stroke: '#0E343D',
                        strokeWidth: 0.5,

                    },
                }
            });
        },
        _hideCircuitBreaker: function () {
            this.removeLabel(1);
        },
        _showDynamicDiscovery: function () {
            this.insertLabel(2, {
                markup: [
                    {
                        tagName: 'path',
                        selector: 'clock'
                    },
                ],
                position: .20,
                attrs: {
                    clock: {
                        d: "M16.85,7.275l-3.967-0.577l-1.773-3.593c-0.208-0.423-0.639-0.69-1.11-0.69s-0.902,0.267-1.11,0.69L7.116,6.699L3.148,7.275c-0.466,0.068-0.854,0.394-1,0.842c-0.145,0.448-0.023,0.941,0.314,1.27l2.871,2.799l-0.677,3.951c-0.08,0.464,0.112,0.934,0.493,1.211c0.217,0.156,0.472,0.236,0.728,0.236c0.197,0,0.396-0.048,0.577-0.143l3.547-1.864l3.548,1.864c0.18,0.095,0.381,0.143,0.576,0.143c0.256,0,0.512-0.08,0.729-0.236c0.381-0.277,0.572-0.747,0.492-1.211l-0.678-3.951l2.871-2.799c0.338-0.329,0.459-0.821,0.314-1.27C17.705,7.669,17.316,7.343,16.85,7.275z M13.336,11.754l0.787,4.591l-4.124-2.167l-4.124,2.167l0.788-4.591L3.326,8.5l4.612-0.67l2.062-4.177l2.062,4.177l4.613,0.67L13.336,11.754z",
                        fill: 'none',
                        stroke: '#0E343D',
                        strokeWidth: 0.5,
                    },
                }
            });

        },
        _hideDynamicDiscovery: function () {
            this.removeLabel(2);
        },
        _hideTimeout: function () {
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