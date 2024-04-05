import * as joint from 'jointjs';
import { Smell } from 'src/app/refactoring/smells/smell';

let NODE_LABEL_FONT_SIZE = 16;
let COMMUNICATION_PATTERN_TYPE_FONT_SIZE = 18;
let ICON_COLOR_SMELLS_FOUND = "#ffba01";


// extend joint.shapes namespace
declare module 'jointjs' {
    namespace shapes {
        namespace microtosca {
            class Root extends joint.dia.Element {
                setName(name): void;
                getName(): string;
            }
            interface Sniffable {
                addSmell(smell: Smell): void;
                getSmell(name: string): Smell;
                getSmells(): Smell[];
                hasSmells(): boolean;
                showSmells(): void;
                hideSmells(): void;
                removeSmell(smell: Smell): void;
                resetSmells(): void
                ignoreAlways(smell: Smell): void;
                undoIgnoreAlways(smell: Smell): void;
                getIgnoreAlwaysSmells(): Smell[];
                isSniffable(): boolean;
            }
            class Node extends Root implements Sniffable {
                addSmell(smell: Smell): void;
                getSmell(name: string): Smell;
                getSmells(): Smell[];
                hasSmells(): boolean;
                showSmells(): void;
                hideSmells(): void;
                removeSmell(smell: Smell): void;
                resetSmells(): void;
                ignoreAlways(smell: Smell): void;
                undoIgnoreAlways(smell: Smell): void;
                getIgnoreAlwaysSmells(): Smell[];
                isSniffable(): boolean;
                show(): void;
                hide(): void;
            }
            class Service extends Node {
            }
            class Compute extends Node {
            }
            class Datastore extends Node {
                topRy(t, opt?): void;
            }
            class CommunicationPattern extends Node {
                setType(ctype: string): void;
                getType(): string;
                getType(): string;
            }
            class Group extends Root implements Sniffable {
                addSmell(smell: Smell): void;
                getSmell(name: string): Smell;
                getSmells(): Smell[];
                hasSmells(): boolean;
                showSmells(): void;
                hideSmells(): void;
                removeSmell(smell: Smell): void;
                resetSmells(): void;
                ignoreAlways(smell: Smell): void;
                undoIgnoreAlways(smell: Smell): void;
                getIgnoreAlwaysSmells(): Smell[];
                isSniffable(): boolean;
                addMember(node:joint.shapes.microtosca.Node): void;
                removeMember(node:joint.shapes.microtosca.Node): void;
                getMembers(): joint.shapes.microtosca.Node[];
                getInternalLinks(): joint.shapes.microtosca.RunTimeLink[];
            }
            class EdgeGroup extends Group {
                setExternalUserName(name: string): void;
                getExternalUserName(): string;
            }
            class SquadGroup extends Group {
                show(): void;
                hide(): void;
            }
            class RunTimeLink extends joint.dia.Link {
                show(): void;
                hide(): void;
                setTimedout(boolean): void;
                setCircuitBreaker(boolean): void;
                setDynamicDiscovery(boolean): void;
                hasTimeout(): boolean;
                hasDynamicDiscovery(): boolean;
                hasCircuitBreaker(): boolean;
            }
            class DeploymentTimeLink extends joint.dia.Link {
                show(): void;
                hide(): void;
                /*hasTimeout(): boolean
                setTimedout(boolean): void;*/
            }
        }
    }
}

class MicrotoscaElementConfiguration {

    private constructor(
        private defaultAttributes,
        private prototypeProperties,
        private staticProperties
    ) {}

    static builder(defaultAttributes?, prototypeProperties?, staticProperties?): MicrotoscaElementConfiguration {
        if(!defaultAttributes) defaultAttributes = {};
        if(!prototypeProperties) prototypeProperties = {};
        if(!staticProperties) staticProperties = {};
        return new MicrotoscaElementConfiguration(defaultAttributes, prototypeProperties, staticProperties);
    }

    buildName() {
        this.prototypeProperties = {
            ...this.prototypeProperties,
            getName: function () {
                return this.attr('label/text');
            },
            setName: function (text) {
                return this.attr('label/text', text || '');
            },
        }
        return this;
    }

    buildVisibility() {
        this.prototypeProperties = {
            ...this.prototypeProperties,
            hide: function () {
                this.attr('./visibility', 'hidden');
                if(this.hideSmells)
                    this.hideSmells();
            },
            show: function () {
                this.attr('./visibility', 'visible');
                if(this.showSmells)
                    this.showSmells();
            },
        }
        return this;
    }

    buildSmells(custom?) {
        // Define visual element for smells
        this.buildSmellGraphics();
        // Add smell management functions
        this.buildSmellLogic(custom);

        return this;
    }

    private buildSmellGraphics() {
        if(!this.defaultAttributes.attrs) {
            this.defaultAttributes = {
                ...this.defaultAttributes,
                attrs: {}
            }
        }
        this.defaultAttributes.attrs = {
            ...this.defaultAttributes.attrs,
            SmellsFoundTriangle: {
                fill: ICON_COLOR_SMELLS_FOUND,
                visibility: "hidden",
                ref: 'text',
                refX: '100%',
                refY: '0%',
                stroke: ICON_COLOR_SMELLS_FOUND,
                strokeWidth: 0,
                d: "M 20,18.75 H 4 C 3.7334394,18.749191 3.4867871,18.608789 3.35,18.38 3.2200186,18.146895 3.2200186,17.863105 3.35,17.63 l 8,-14 c 0.308525,-0.4651184 0.991475,-0.4651184 1.3,0 l 8,14 c 0.129981,0.233105 0.129981,0.516895 0,0.75 -0.136787,0.228789 -0.383439,0.369191 -0.65,0.37 z",
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
                magnet: false
            },
            SmellsFoundExclamation: {
                fill: "black",
                visibility: "hidden",
                ref: 'text',
                refX: '100%',
                refY: '0%',
                strokeWidth: 0,
                d: "M12,13.25a.76.76,0,0,1-.75-.75V9a.75.75,0,0,1,1.5,0v3.5A.76.76,0,0,1,12,13.25Z M12,16.25a.76.76,0,0,1-.75-.75V15a.75.75,0,0,1,1.5,0v.5A.76.76,0,0,1,12,16.25Z",
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
                magnet: false
            }
        }
        let markup = this.prototypeProperties.markup;
        if(!markup) {
            this.prototypeProperties = {
                ...this.prototypeProperties,
                markup: []
            }
        }
        this.prototypeProperties.markup = this.prototypeProperties.markup.concat([{
            tagName:"path",
            selector :"SmellsFoundTriangle"
        }, {
            tagName:"path",
            selector :"SmellsFoundExclamation"
        }]);
    }

    private buildSmellLogic(custom?) {
        this.defaultAttributes = {
            ...this.defaultAttributes,
            smells: [],
            alwaysIgnoredSmells: new Set<string>()
        }
        if(custom?.showSmells) {
            this.prototypeProperties.showSmells = custom.showSmells;
        } else {
            this.prototypeProperties.showSmells = function () {
                let visibility = this.attr("./visibility");
                if(this.hasSmells() && (!visibility || visibility === 'visible')) {
                    this.attr('SmellsFoundTriangle/visibility', 'visible');
                    this.attr('SmellsFoundExclamation/visibility', 'visible');
                }
            }
        }
        this.prototypeProperties = {
            ...this.prototypeProperties,
            addSmell: function (smell: Smell) {
                if(!this.attributes.alwaysIgnoredSmells.has(smell.getName())) {
                    this.attributes.smells.push(smell);
                    this.showSmells();
                }
            },
            getSmells: function (): Smell[] {
                return this.attributes.smells;
            },
            getSmell: function (name: string): Smell {
                return this.attributes.smells.find(smell => {
                    return name === smell.getName();
                });
            },
            hasSmells: function ():  boolean {
                return this.attributes.smells.length > 0;
            },
            removeSmell: function (smell: Smell): Smell {
                let smells: Smell[] = this.attributes.smells;
                let smellIndex = smells.indexOf(this.getSmell(smell.getName()));
                let removingSmell = smells.splice(smellIndex, 1)[0];
                if(smells.length == 0)
                    this.hideSmells();
                return removingSmell;
            },
            resetSmells: function () {
                this.attributes.smells = [];
                this.hideSmells();
            },
            hideSmells: function() {
                this.attr('SmellsFoundTriangle/visibility', 'hidden');
                this.attr('SmellsFoundExclamation/visibility', 'hidden');
            },
            ignoreAlways: function(smell: Smell) {
                let ignoredSmell: Smell = this.removeSmell(smell);
                this.attributes.alwaysIgnoredSmells.add(ignoredSmell.getName());
            },
            undoIgnoreAlways: function(smell: Smell) {
                this.addSmell(smell);
                this.attributes.alwaysIgnoredSmells.delete(smell.getName());
            },
            getIgnoreAlwaysSmells: function() {
                return this.attributes.alwaysIgnoredSmells;
            },
            isSniffable: function() {
                return true;
            }
        }
    }

    build(): [{},{},{}] {
        return [this.defaultAttributes, this.prototypeProperties, this.staticProperties];
    }
}

joint.dia.Element.define('microtosca.Service', ...MicrotoscaElementConfiguration.builder(
    {
        size: { width: 75, height: 75 },
        attrs: {
            body: {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
                stroke: "black",
                strokeWidth: 2,
                fill: '#0A6372',
                magnet: false
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '100%',
                refY2: 15,
                fontSize: NODE_LABEL_FONT_SIZE,
                fill: 'black',
                text: '',
            },
        }
    },
    {
        markup: [{
            tagName: 'circle',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    }).buildName().buildSmells().buildVisibility().build());


joint.dia.Element.define('microtosca.Compute', ...MicrotoscaElementConfiguration.builder({
    size: { width: 50, height: 50 },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#52B38E',
            magnet: false,
            points: "50,0 100,50 50,100 0,50",
            stroke: "black",
            strokeWidth: 2,
            fontWeight: '500'
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '100%',
            refY: '200%',
            refY2: 14,
            fontSize: NODE_LABEL_FONT_SIZE,
            fill: 'black',
            text: ''
        },
        type: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            //visibility: "visible",
            refX: '100%',
            refY: '100%',
            // refY2: 18,
            fontSize: COMMUNICATION_PATTERN_TYPE_FONT_SIZE,
            fill: '#333333',
            text: 'C',
            cursor: "default"
        }
    },
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
        }],
    }).buildName().buildSmells().buildVisibility().build());


joint.shapes.standard.Cylinder.define('microtosca.Datastore', ...MicrotoscaElementConfiguration.builder(
{
    size: {
        width: 20,
        height: 20
    },
    attrs: {
        body: {
            magnet: false,
            lateralArea: "10%",
            fill: '#6DB4BF',
            stroke: '#333333',
            strokeWidth: 2
        },
        top: {
            refCx: '50%',
            cy: 100,
            refRx: '50%',
            ry: 100,
            fill: '#A9D3D9',
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
        }],
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
    }).buildName().buildSmells().buildVisibility().build());

joint.dia.Element.define('microtosca.CommunicationPattern', ...MicrotoscaElementConfiguration.builder(
{
    size: { width: 50, height: 50 },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#D3E8EE',
            stroke: 'black',
            magnet: false,
            strokeWidth: 2
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
        type: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            //visibility: "visible",
            refX: '50%',
            refY: '40%',
            // refY2: 18,
            fontSize: COMMUNICATION_PATTERN_TYPE_FONT_SIZE,
            fill: '#333333',
            text: '',
            fontWeight: '500',
            cursor: "default"
        }
    }
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
        }],
        setType: function (text) {
            return this.attr('type/text', `${text}` || '');
        },
        getType: function () {
            return this.attr('type/text');
        },
    }
).buildName().buildSmells().buildVisibility().build());

joint.dia.Element.define('microtosca.Group', ...MicrotoscaElementConfiguration.builder({
}, {
        markup: [],
}
).build());

joint.dia.Element.define('microtosca.EdgeGroup', ...MicrotoscaElementConfiguration.builder({
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
            text: name != undefined ? name : ''
        },
    },
    groupName: '', // groupName of the group. each nodes connected to this node is considered memeber of the EdgeGroup
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
        }
    }).buildSmells({
        // This override hides the smells icon, since it is shown in the involved nodes instead
        showSmells: function() {}
    }).build());

joint.dia.Element.define('microtosca.SquadGroup', ...MicrotoscaElementConfiguration.builder({
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
            // fill:"#E5E7E9",
            fill: "#ffffff",
            fillOpacity:"0.4",
            stroke: '#7e7e77', 
            strokeWidth: 2,
            //strokeDasharray: "10,5",
            rx: 10,
            ry: 10,
            magnet: false
        },
        label: {
            refX: '99%',
            refY: '-22',
            //yAlignment: 'hanging',
            xAlignment: 'right',
            fontSize: 18,
            text: name != undefined ? name : '',
            magnet: false
        },
        minimize: {
            refX: '90%',
            refY: '0%',
            fill: 'black',
            event: 'team:minimize:pointerdown',
            visibility: "hidden",
            ref: 'body',
            width: '20',
            height: '5',
            xAlignment: 'center',
            //d:"M67.69 0h504.62c37.229 0 67.678 30.473 67.678 67.702L640 572.299C640 609.527 609.527 640 572.298 640l-504.609-.012c-37.229 0-67.69-30.449-67.69-67.678V67.69C0 30.462 30.46.012 67.69 0zm39.615 409.753h425.39c7.914 0 14.351 5.811 14.351 12.91l.012 97.465c0 7.087-6.46 12.898-14.362 12.898l-425.391-.012c-7.914 0-14.363-5.787-14.363-12.886v-97.477c0-7.099 6.449-12.886 14.363-12.898z"
        },
        maximize: {
            refX: '95%',
            refY: '-2%',
            fill: 'black',
            event: 'team:maximize:pointerdown',
            visibility: "hidden",
            ref: 'body',
            width: '15px',
            height: '15px',
            xAlignment: 'center',
            d: "M18.25859511712037,0.0909130039541598 L2.1152406294586434,0.0909130039541598 C1.0868779036821152,0.0909130039541598 0.25254588088229035,0.9252450267539847 0.25254588088229035,1.953607752530513 L0.25254588088229035,15.613369242090437 C0.25254588088229035,16.641731967866964 1.0868779036821152,17.47606399066679 2.1152406294586434,17.47606399066679 L18.25859511712037,17.47606399066679 C19.286957842896904,17.47606399066679 20.121289865696724,16.641731967866964 20.121289865696724,15.613369242090437 L20.121289865696724,1.953607752530513 C20.121289865696724,0.9252450267539847 19.286957842896904,0.0909130039541598 18.25859511712037,0.0909130039541598 zM17.637696867594926,6.299895499208672 L2.7361388789840935,6.299895499208672 L2.7361388789840935,3.0401796892000528 C2.7361388789840935,2.784059161270804 2.945692038198934,2.5745060020559642 3.2018125661281824,2.5745060020559642 L17.17202318045083,2.5745060020559642 C17.428143708380077,2.5745060020559642 17.637696867594926,2.784059161270804 17.637696867594926,3.0401796892000528 L17.637696867594926,6.299895499208672 z"
        },
    },
    //isMaximed: true
}, {
        markup: [{
            tagName: 'rect',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }/*, {
            tagName: 'rect',
            selector: 'minimize'
        }, {
            tagName: 'path',
            selector: 'maximize'
        }*/],
        /*setMinimize: function(){
            return this.isMaximed = false; 
        },
        setMaximize: function(){
            return this.isMaximed = true;
        },*/
        addMember: function(node:joint.shapes.microtosca.Node){
            this.embed(node);
            this.toBack();
            // this.fitEmbeds({ padding: 40});
        },
        removeMember: function(node:joint.shapes.microtosca.Node){
            this.unembed(node);
            //node.toFront();
            //this.fitEmbeds({ padding: 40});
        },
        getMembers: function () {
            var members = [];
            this.getEmbeddedCells().forEach(cell => {
                members.push(<joint.shapes.microtosca.Root>cell);
            });
            return members;
        },
        // TODO implement show e hide
}).buildName().buildSmells().buildVisibility().build());


// joint.dia.Link
joint.shapes.standard.Link.define('microtosca.RunTimeLink', ...MicrotoscaElementConfiguration.builder({
    // joint.dia.Link.define('microtosca.RunTimeLink', {
    smooth: true, // false,
    attrs: {
        line: {
            cursor: 'default',
        },
        wrapper: {
            cursor: 'default',
        }
    },

    timeout: undefined,
    circuit_breaker: undefined,
    dynamic_discovery: undefined
}, {
        setTimedout: function (value: boolean) {
            if (value)
                this._showTimeout();
            else
                this._hideTimeout()
        },
        setCircuitBreaker: function (value: boolean) {
            if (value)
                this._showCircuitBreaker()
            else
                this._hideCircuitBreaker()
        },
        setDynamicDiscovery: function (value: boolean) {
            if (value)
                this._showDynamicDiscovery();
            else {
                this._hideDynamicDiscovery();
            }
        },
        hasTimeout: function (): boolean {
            return this.timeout ? true : false;
        },
        hasDynamicDiscovery: function(): boolean {
            return this.dynamic_discovery ? true : false;
        },
        hasCircuitBreaker: function(): boolean {
            return this.circuit_breaker ? true : false;
        },

        _showTimeout: function () {
            if(this.timeout)
                this.removeLabel(this.timeout);
            this.timeout = this.insertLabel(0, {
                attrs: {
                    text: {
                        text: 'timeout',
                        fontSize: 10
                    }
                },
                position: {
                    distance: 0.1
                }
            });
        },
        _hideTimeout: function () {
            if(this.timeout) {
                this.removeLabel(this.timeout);
                this.timeout = undefined;
            }
        },

        _showCircuitBreaker: function () {
            if(this.circuit_breaker)
                this.removeLabel(this.circuit_breaker);
            this.circuit_breaker = this.insertLabel(1, {
                attrs: {
                    text: {
                        text: 'circuit\nbreaker',
                        fontSize: 10
                    },
                    position: {
                        distance: 0.2
                    }
                },
            });
        },
        _hideCircuitBreaker: function () {
            if(this.circuit_breaker) {
                this.removeLabel(this.circuit_breaker);
                this.circuit_breaker = undefined;
            }
        },
        _showDynamicDiscovery: function () {
            if(this.dynamic_discovery)
                this.removeLabel(this.dynamic_discovery);
            this.dynamic_discovery = this.insertLabel(2, {
                attrs: {
                    text: {
                        text: 'dynamic\ndiscovery',
                        fontSize: 10
                    }
                },
                position: {
                    distance: 0.3
                }
            });

        },
        _hideDynamicDiscovery: function () {
            if(this.dynamic_discovery) {
                this.removeLabel(this.dynamic_discovery);
                this.dynamic_discovery = undefined;
            }
        },

    }).buildVisibility().build());

// MicroTosca DeploymentTime Link
joint.dia.Link.define('microtosca.DeploymentTimeLink', ...MicrotoscaElementConfiguration.builder({
    attrs: {
        line: {
            cursor: 'default',
            connection: true,
            stroke: '#333333',
            strokeWidth: 2,
            strokeLinejoin: 'round',
            strokeDasharray: "10",
            targetMarker: {
                type: 'path',
                d: 'M 10 -5 0 0 10 5 z'
            }
        },
        wrapper: {
            cursor: 'default',
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
).buildVisibility().build());


// demonstrate creating a custom dummy view for the app.CustomRect
/*namespace CustomViews {

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
(<any>Object).assign(joint.shapes.microtosca, CustomViews)*/