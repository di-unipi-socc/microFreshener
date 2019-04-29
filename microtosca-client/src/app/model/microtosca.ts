import * as joint from 'jointjs';
import { SmellObject, WobblyServiceInteractionSmellObject, NoApiGatewaySmellObject, SharedPersistencySmellObject, EndpointBasedServiceInteractionSmellObject, SingleLayerTeamSmellObject } from '../analyser/smell';


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
            d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
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
        EndpointBasedServiceInteraction: { // EndpointBasesdServiceInteraction
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
            fill: '#EFF142',
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
    ignoreAlwaysSmells: []       // list of smell ignored (always)
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
            text: name || '',
        },
        delete: {
            d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
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
    smells: [], // list of smells that affects a single node
    ignoreAlwaysSmells: []
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
            refY: '75%',
            fontSize: 13,
            fill: '#333333',
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
        getIgnoreAlwaysSmells: function (){
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
            d: "M55.014,45.389l-9.553-4.776C44.56,40.162,44,39.256,44,38.248v-3.381c0.229-0.28,0.47-0.599,0.719-0.951  c1.239-1.75,2.232-3.698,2.954-5.799C49.084,27.47,50,26.075,50,24.5v-4c0-0.963-0.36-1.896-1-2.625v-5.319  c0.056-0.55,0.276-3.824-2.092-6.525C44.854,3.688,41.521,2.5,37,2.5s-7.854,1.188-9.908,3.53c-1.435,1.637-1.918,3.481-2.064,4.805  C23.314,9.949,21.294,9.5,19,9.5c-10.389,0-10.994,8.855-11,9v4.579c-0.648,0.706-1,1.521-1,2.33v3.454  c0,1.079,0.483,2.085,1.311,2.765c0.825,3.11,2.854,5.46,3.644,6.285v2.743c0,0.787-0.428,1.509-1.171,1.915l-6.653,4.173  C1.583,48.134,0,50.801,0,53.703V57.5h14h2h44v-4.043C60,50.019,58.089,46.927,55.014,45.389z M14,53.262V55.5H2v-1.797  c0-2.17,1.184-4.164,3.141-5.233l6.652-4.173c1.333-0.727,2.161-2.121,2.161-3.641v-3.591l-0.318-0.297  c-0.026-0.024-2.683-2.534-3.468-5.955l-0.091-0.396l-0.342-0.22C9.275,29.899,9,29.4,9,28.863v-3.454  c0-0.36,0.245-0.788,0.671-1.174L10,23.938l-0.002-5.38C10.016,18.271,10.537,11.5,19,11.5c2.393,0,4.408,0.553,6,1.644v4.731  c-0.64,0.729-1,1.662-1,2.625v4c0,0.304,0.035,0.603,0.101,0.893c0.027,0.116,0.081,0.222,0.118,0.334  c0.055,0.168,0.099,0.341,0.176,0.5c0.001,0.002,0.002,0.003,0.003,0.005c0.256,0.528,0.629,1,1.099,1.377  c0.005,0.019,0.011,0.036,0.016,0.054c0.06,0.229,0.123,0.457,0.191,0.68l0.081,0.261c0.014,0.046,0.031,0.093,0.046,0.139  c0.035,0.108,0.069,0.215,0.105,0.321c0.06,0.175,0.123,0.356,0.196,0.553c0.031,0.082,0.065,0.156,0.097,0.237  c0.082,0.209,0.164,0.411,0.25,0.611c0.021,0.048,0.039,0.1,0.06,0.147l0.056,0.126c0.026,0.058,0.053,0.11,0.079,0.167  c0.098,0.214,0.194,0.421,0.294,0.621c0.016,0.032,0.031,0.067,0.047,0.099c0.063,0.125,0.126,0.243,0.189,0.363  c0.108,0.206,0.214,0.4,0.32,0.588c0.052,0.092,0.103,0.182,0.154,0.269c0.144,0.246,0.281,0.472,0.414,0.682  c0.029,0.045,0.057,0.092,0.085,0.135c0.242,0.375,0.452,0.679,0.626,0.916c0.046,0.063,0.086,0.117,0.125,0.17  c0.022,0.029,0.052,0.071,0.071,0.097v3.309c0,0.968-0.528,1.856-1.377,2.32l-2.646,1.443l-0.461-0.041l-0.188,0.395l-5.626,3.069  C15.801,46.924,14,49.958,14,53.262z M58,55.5H16v-2.238c0-2.571,1.402-4.934,3.659-6.164l8.921-4.866  C30.073,41.417,31,39.854,31,38.155v-4.018v-0.001l-0.194-0.232l-0.038-0.045c-0.002-0.003-0.064-0.078-0.165-0.21  c-0.006-0.008-0.012-0.016-0.019-0.024c-0.053-0.069-0.115-0.152-0.186-0.251c-0.001-0.002-0.002-0.003-0.003-0.005  c-0.149-0.207-0.336-0.476-0.544-0.8c-0.005-0.007-0.009-0.015-0.014-0.022c-0.098-0.153-0.202-0.32-0.308-0.497  c-0.008-0.013-0.016-0.026-0.024-0.04c-0.226-0.379-0.466-0.808-0.705-1.283c0,0-0.001-0.001-0.001-0.002  c-0.127-0.255-0.254-0.523-0.378-0.802l0,0c-0.017-0.039-0.035-0.077-0.052-0.116h0c-0.055-0.125-0.11-0.256-0.166-0.391  c-0.02-0.049-0.04-0.1-0.06-0.15c-0.052-0.131-0.105-0.263-0.161-0.414c-0.102-0.272-0.198-0.556-0.29-0.849l-0.055-0.178  c-0.006-0.02-0.013-0.04-0.019-0.061c-0.094-0.316-0.184-0.639-0.26-0.971l-0.091-0.396l-0.341-0.22  C26.346,25.803,26,25.176,26,24.5v-4c0-0.561,0.238-1.084,0.67-1.475L27,18.728V12.5v-0.354l-0.027-0.021  c-0.034-0.722,0.009-2.935,1.623-4.776C30.253,5.458,33.081,4.5,37,4.5c3.905,0,6.727,0.951,8.386,2.828  c1.947,2.201,1.625,5.017,1.623,5.041L47,18.728l0.33,0.298C47.762,19.416,48,19.939,48,20.5v4c0,0.873-0.572,1.637-1.422,1.899  l-0.498,0.153l-0.16,0.495c-0.669,2.081-1.622,4.003-2.834,5.713c-0.297,0.421-0.586,0.794-0.837,1.079L42,34.123v4.125  c0,1.77,0.983,3.361,2.566,4.153l9.553,4.776C56.513,48.374,58,50.78,58,53.457V55.5z",
            strokeWidth: 2,
            stroke: '#C2C2C2',
            //fill: "#C2C2C2",
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
        getIgnoreAlwaysSmells: function (){
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
            refY: '-8%',
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
            refWidth: '10%',
            refHeight: '5%',
            xAlignment: 'center',
        },
        singleLayerTeam: {
            fill: '#FC2B01',
            event: 'smell:SingleLayerTeam:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '10%',
            refWidth: '10%',
            refHeight: '10%',
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
        },{
            tagName: 'rect',
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
        resetSmells: function(){
            this.attributes.smells = [];
            this.attr('singleLayerTeam/visibility', 'hidden');
        },
        getIgnoreAlwaysSmells: function (){
            return [];
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
        clock: {
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
            strokeWidth: 8,
            stroke: '#74F2CE',
            fill: '#FFFFFF'
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
            tagName: "circle",
            selector: 'clock'
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
                        tagName: 'circle',
                        selector: 'body'
                    }, {
                        tagName: 'text',
                        selector: 'label'
                    },

                ],
                attrs: {
                    label: {
                        text: 'T',
                        fill: '#000000',
                        fontSize: 14,
                        textAnchor: 'middle',
                        yAlignment: 'middle',
                        pointerEvents: 'none'
                    },
                    body: {
                        ref: 'label',
                        fill: '#ffffff',
                        stroke: '#000000',
                        strokeWidth: 1,
                        refR: 1,
                        refCx: -10,
                        refCy: 0
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