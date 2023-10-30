import * as joint from 'jointjs';
import { ISmell } from 'src/app/refactoring/smells/smell';

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
                addSmell(smell: ISmell): void;
                getSmell(name: string): ISmell;
                getSmells(): ISmell[];
                hasSmells(): boolean;
                removeSmell(smell: ISmell): void;
                resetSmells(): void
                ignoreAlways(smell: ISmell): void;
                undoIgnoreAlways(smell: ISmell): void;
                getIgnoreAlwaysSmells(): ISmell[];
            }
            class Node extends Root {

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
            class Group extends Root {
                addMember(node:joint.shapes.microtosca.Node): void
                removeMember(node:joint.shapes.microtosca.Node): void
                getMembers(): joint.shapes.microtosca.Root[]
                getInternalLinks(): joint.shapes.microtosca.RunTimeLink[]
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
                this.visibility = 'hidden';
                if(this.hideSmells)
                    this.hideSmells();
            },
            show: function () {
                this.attr('./visibility', 'visible');
                this.visibility = 'visible';
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
                if(this.hasSmells() && (!this.visibility || this.visibility === 'visible')) {
                    this.attr('SmellsFoundTriangle/visibility', 'visible');
                    this.attr('SmellsFoundExclamation/visibility', 'visible');
                }
            }
        }
        this.prototypeProperties = {
            ...this.prototypeProperties,
            addSmell: function (smell: ISmell) {
                if(!this.attributes.alwaysIgnoredSmells.has(smell.getName())) {
                    this.attributes.smells.push(smell);
                    this.showSmells();
                }
            },
            getSmells: function (): ISmell[] {
                return this.attributes.smells;
            },
            getSmell: function (name: string): ISmell {
                return this.attributes.smells.find(smell => {
                    return name === smell.getName();
                });
            },
            hasSmells: function ():  boolean {
                return this.attributes.smells.length > 0;
            },
            removeSmell: function (smell: ISmell): ISmell {
                let smells: ISmell[] = this.attributes.smells;
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
            ignoreAlways: function(smell: ISmell) {
                let ignoredSmell: ISmell = this.removeSmell(smell);
                this.attributes.ignoreAlwaysSmells.add(ignoredSmell.getName());
            },
            undoIgnoreAlways: function(smell: ISmell) {
                this.addSmell(smell);
                this.attributes.alwaysIgnoredSmells.delete(smell.getName());
            },
            getIgnoreAlwaysSmells: function() {
                return this.attributes.ignoreAlwaysSmells;
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
    }).buildName().buildSmells().build());


joint.dia.Element.define('microtosca.Compute', ...MicrotoscaElementConfiguration.builder({
    size: { width: 75, height: 75 },
    attrs: {
        body: {
            refCx: '50%',
            refCy: '50%',
            refR: '50%',
            //strokeWidth: 8,
            stroke: '#1CC288',
            fill: '#1CC288',
            magnet: false
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '100%',
            refY2: 15,
            fontSize: NODE_LABEL_FONT_SIZE,
            //refWidth: '75%',
            //refHeight: '75%',
            fill: 'black',
            text: '',
        },
        /*MultipleServicesInOneContainer: { // MultipleServicesInOneContainer
            fill: ICON_COLOR_MULTIPLE_SERVICES_IN_ONE_CONTAINER,
            event: 'smell:MultipleServicesInOneContainer:pointerdown',
            stroke:"white",
            strokeWidth: "1",
            visibility: "hidden",
            ref: 'body',
            refX: '35%',
            refY: '40%',
            d: "M20.15243413209694,2.0800748598753587 L20.15243413209694,13.479177718203825 C20.15243413209694,14.41943099033625 19.365550607512933,15.206314514920258 18.425297335380503,15.206314514920258 L8.407903914425187,15.206314514920258 L4.953630320992318,19.006015467696415 L4.953630320992318,15.206314514920258 L1.8447840869027365,15.206314514920258 C0.9045308147703093,15.206314514920258 0.11764729018630199,14.41943099033625 0.11764729018630199,13.479177718203825 L0.11764729018630199,2.0800748598753587 C0.11764729018630199,1.1398215877429332 0.9045308147703093,0.3529380631589255 1.8447840869027365,0.3529380631589255 L18.425297335380503,0.3529380631589255 C19.365550607512933,0.3529380631589255 20.15243413209694,1.1398215877429332 20.15243413209694,2.0800748598753587 z",
            magnet: false
        },*/
    },
}, {
        markup: [{
            tagName: 'circle',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }, /*{
            tagName: 'path',
            selector: 'MultipleServicesInOneContainer'
        },*/
        ],
    }).buildName().buildSmells().build());


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
    }).buildName().buildSmells().build());

joint.dia.Element.define('microtosca.CommunicationPattern', ...MicrotoscaElementConfiguration.builder(
{
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
).buildName().buildSmells().build());

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
            text: name != undefined ? name : '',
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
    smooth: true,
    attrs: {
        line: {
            cursor: 'default',
    //     //     connection: true,
    //     //     stroke: '#0E343D',
    //     //     strokeWidth: 2,
        },
        wrapper: {
            cursor: 'default',
    //     //     // connection: true,
    //     //     strokeWidth: 10,
    //     //     strokeLinejoin: 'round'
        }
    },

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

    }).build());

// MicroTosca DeployemntTime Link
joint.dia.Link.define('microtosca.DeploymentTimeLink', ...MicrotoscaElementConfiguration.builder({
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
).build());


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