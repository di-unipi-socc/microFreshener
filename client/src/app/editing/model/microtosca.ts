import * as joint from 'jointjs';
import { SmellObject, WobblyServiceInteractionSmellObject, NoApiGatewaySmellObject, SharedPersistencySmellObject, EndpointBasedServiceInteractionSmellObject, SingleLayerTeamSmellObject, MultipleServicesInOneContainerSmellObject } from '../analyser/smell';
import { selector } from 'd3';

let NODE_LABEL_FONT_SIZE = 16;
let COMMUNICATION_PATTERN_TYPE_FONT_SIZE = 18;
let ICON_COLOR_SHARED_PERSISTENCY = "#1B6879";
let ICON_COLOR_ENDPOINT_SERVICE_INTERACTION = "#48A9A6"; //"#00ff00";
let ICON_COLOR_WOBBLY_SERVICE_INTERACTION = "#48A9A6";//'#0800ee';
let ICON_COLOR_MULTIPLE_SERVICES_IN_ONE_CONTAINER = "#48A9A6";//'#0800ee';
let ICON_COLOR_NO_API_GATEWAY = "#48A9A6";//'#EFF142';
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
                setMinimize():boolean;
                setMaximize():boolean;
            }
            class EdgeGroup extends Group {
                setExternalUserName(name: string): void;
                getExternalUserName(): string;
            }
            class SquadGroup extends Group {
                setMinimize():boolean;
                setMaximize():boolean;
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
            //refWidth: '75%',
            //refHeight: '75%',
            fill: 'black',
            text: '',
        },
        button: {
            ref: 'body',
            refX: '80%',
            refY: '0%',
            event: 'node:service:delete',
            visibility: "hidden",
        },
        icon: {
            visibility: "hidden",
            ref: "button",
            refX: '50%',
            refY: '50%',
        },
        // endpoint_backgound : {
        //     ref: 'EndpointBasedServiceInteraction',
        //     event: 'smell:EndpointBasedServiceInteraction:pointerdown',
        //     refCx: '100%',
        //     refCy: '100%',
        //     refR: '100%',
        //     //strokeWidth: 8,
        //     stroke: '#1B6879',
        //     fill: 'white',
        //     magnet: false
        // },
        // EndpointBasedServiceInteraction: { // EndpointBasesdServiceInteraction
        //     fill: ICON_COLOR_ENDPOINT_SERVICE_INTERACTION,
        //     stroke:"white",
        //     strokeWidth: "1",
        //     d: "M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M38.5,28H28v11c0,1.104-0.896,2-2,2  s-2-0.896-2-2V28H13.5c-1.104,0-2-0.896-2-2s0.896-2,2-2H24V14c0-1.104,0.896-2,2-2s2,0.896,2,2v10h10.5c1.104,0,2,0.896,2,2  S39.604,28,38.5,28z",
        //     event: 'smell:EndpointBasedServiceInteraction:pointerdown',
        //     visibility: "hidden", //hidden
        //     ref: 'body',
        //     refX: '50%',
        //     refY: '50%',
        //     width: '10',
        //     height: '10',
        //     magnet: false
        // },
        EndpointBasedServiceInteraction: {
            fill: ICON_COLOR_ENDPOINT_SERVICE_INTERACTION,
            event: 'smell:EndpointBasedServiceInteraction:pointerdown',
            visibility: "hidden", //hidden
            ref: 'body',
            refX: '70%',
            refY: '40%',
            stroke:"white",
            strokeWidth: "1",
            points:"10.083689495921135,-0.014947996474802494 13.261116787791252,6.423906326293945 20.367001339793205,7.4567060470581055 15.225153729319572,12.468356132507324 16.438929364085197,19.545604705810547 10.083689495921135,16.204376220703125 3.7280669659376144,19.545604705810547 4.941843792796135,12.468356132507324 -0.20000223815441132,7.4567060470581055 6.905877396464348,6.423906326293945 ",
            magnet: false

        },
        wsi: { // WobblyServiceInteractionSmell
            fill: ICON_COLOR_WOBBLY_SERVICE_INTERACTION,
            event: 'smell:WobblyServiceInteractionSmell:pointerdown',
            stroke:"white",
            strokeWidth: "1",
            visibility: "hidden",
            ref: 'body',
            refX: '35%',
            refY: '40%',
            d: "M20.15243413209694,2.0800748598753587 L20.15243413209694,13.479177718203825 C20.15243413209694,14.41943099033625 19.365550607512933,15.206314514920258 18.425297335380503,15.206314514920258 L8.407903914425187,15.206314514920258 L4.953630320992318,19.006015467696415 L4.953630320992318,15.206314514920258 L1.8447840869027365,15.206314514920258 C0.9045308147703093,15.206314514920258 0.11764729018630199,14.41943099033625 0.11764729018630199,13.479177718203825 L0.11764729018630199,2.0800748598753587 C0.11764729018630199,1.1398215877429332 0.9045308147703093,0.3529380631589255 1.8447840869027365,0.3529380631589255 L18.425297335380503,0.3529380631589255 C19.365550607512933,0.3529380631589255 20.15243413209694,1.1398215877429332 20.15243413209694,2.0800748598753587 z",
            magnet: false
        },
        NoApiGateway: { // No api gateway
            fill: ICON_COLOR_NO_API_GATEWAY,
            stroke:"white",
            strokeWidth: "1",
            event: 'smell:NoApiGateway:pointerdown',
            // d:"M9.926967200076188,0 C4.44504019635184,0 0.001000000044354314,4.444172546066147 0.001000000044354314,9.925901025152502 S4.44504019635184,19.852331449339644 9.926901025196857,19.852331449339644 S19.85313292474601,15.40782802887685 19.85313292474601,9.925901025152502 S15.408828028921201,0 9.926967200076188,0 zM2.6963690100479316,13.664847882195348 C2.6963690100479316,10.564025386534853 5.419597644249577,10.564687135328155 6.023906642294129,9.75391251377298 L6.0930593911943225,9.38419346295444 C5.244035689386217,8.95372587291066 4.6446898072914395,7.916566989166434 4.6446898072914395,6.703184401765544 C4.6446898072914395,5.104796366420809 5.684429511329547,3.8088275296156717 6.966700148113309,3.8088275296156717 C7.976396456935449,3.8088275296156717 8.8331626196252,4.613778761789777 9.152919636549345,5.735707665956153 C7.868465228747685,6.143874321665614 6.918326311322838,7.53659083205169 6.918326311322838,9.192153963137828 C6.918326311322838,10.331950084723394 7.367653741975764,11.379895473798465 8.105305121870927,12.045680934740888 C7.98685208786964,12.10642947396613 7.8550979031229575,12.168369161019317 7.741806509709436,12.22144141424224 C7.146960519409121,12.500500880378231 6.3224215229532374,12.888418023012614 5.727575532652922,13.664847882195348 L2.6963690100479316,13.664847882195348 zM9.957142945050817,16.15361891892964 L9.957142945050817,16.153486569170983 L9.896526755584238,16.153486569170983 L5.65663606201081,16.153486569170983 C5.65663606201081,13.052796423269145 8.379864696212456,13.053656696700441 8.98417369425701,12.242882075145268 L9.0533264431572,11.873163024326725 C8.204302741349096,11.442695434282943 7.604956859254319,10.405536550538717 7.604956859254319,9.192153963137828 C7.604956859254319,7.593765927793093 8.644696563292428,6.297797090987956 9.926967200076188,6.297797090987956 C11.209237836859947,6.297797090987956 12.248977540898053,7.593765927793093 12.248977540898053,9.192153963137828 C12.248977540898053,10.395080919604526 11.66028581437546,11.42608553957103 10.822578016932843,11.863038267789182 L10.901326123335934,12.283381101295427 C11.564332239346484,13.054847844528387 14.19696746374491,13.105140752819437 14.19696746374491,16.15361891892964 L9.957142945050817,16.15361891892964 zM14.126094167982128,13.664980231954008 L14.126094167982128,13.664847882195348 L14.126094167982128,13.664847882195348 C13.531049653043823,12.88855037277127 12.70651065658794,12.500699405016224 12.111664666287624,12.221639938880232 C11.994601304752273,12.166714789036059 11.864832366385503,12.105767725172829 11.748827802919436,12.046210333775532 C12.485817434021296,11.37956459940181 12.935674263708865,10.329369264429511 12.935674263708865,9.192153963137828 C12.935674263708865,7.536789356689681 11.985866220680673,6.144337545820927 10.701742687275665,5.736038540352805 C11.021301179561815,4.613911111548438 11.878067342251567,3.808959879374331 12.887962175711698,3.808959879374331 C14.17036516225412,3.808959879374331 15.209972516533565,5.104928716179469 15.209972516533565,6.703316751524204 C15.209972516533565,7.906243707990901 14.621280790010971,8.937115978198745 13.783572992568354,9.374201056175558 L13.862321098971444,9.794543889681801 C14.525327214981997,10.565878283156103 17.157962439380423,10.616105016567822 17.157962439380423,13.664980231954008 L14.126094167982128,13.664980231954008 z",
            d: "M17.499999030921387,17.03079435426681 C17.499999030921387,15.995112602995468 16.914658159646567,15.04806720963411 15.988408219487171,14.585112694088856 L12.732044793501693,12.956930981096114 C12.311363002498126,12.746590085594333 12.045453928768154,12.316362840661997 12.045453928768154,11.845908325601279 L12.045453928768154,10.568181135421886 C12.136817559229222,10.464203869412088 12.24181755244567,10.330226605340453 12.353635727039814,10.172044797378009 C12.797499334727535,9.545453928768154 13.132953858509955,8.855794882414656 13.365794752558122,8.132044929172698 C13.783408361941728,8.003522210203215 14.090908342075616,7.617613144225873 14.090908342075616,7.1590904465761165 L14.090908342075616,5.795454171037808 C14.090908342075616,5.495454190419382 13.957612896141748,5.227158753207218 13.74999927319104,5.039658765320701 L13.74999927319104,3.0681816199611927 C13.74999927319104,3.0681816199611927 14.15465833795703,0 9.999999515460694,0 C5.844999783895471,0 6.249999757730347,3.0681816199611927 6.249999757730347,3.0681816199611927 L6.249999757730347,5.039658765320701 C6.0423861347796395,5.227158753207218 5.909090688845771,5.495454190419382 5.909090688845771,5.795454171037808 L5.909090688845771,7.1590904465761165 C5.909090688845771,7.5184086051804595 6.0979543130078255,7.834431312036464 6.380567931113139,8.017158572958596 C6.721136090928833,9.500794840744275 7.613636033268654,10.568181135421886 7.613636033268654,10.568181135421886 L7.613636033268654,11.814203782195015 C7.613636033268654,12.268635571018153 7.365454231120682,12.686930998539532 6.966249711456842,12.904430984487892 L3.924999907937532,14.563635422749128 C3.0464772374219766,15.042612664531958 2.5,15.963408059589197 2.5,16.963976176765435 L2.5,17.727271581998004 C2.5,17.727271581998004 2.5,17.95124884025517 2.5,18.068180650882578 C2.5,19.009430590072895 5.8579543285130855,19.772725995305464 9.999999515460694,19.772725995305464 S17.499999030921387,19.009430590072895 17.499999030921387,18.068180650882578 C17.499999030921387,17.95124884025517 17.499999030921387,17.727271581998004 17.499999030921387,17.727271581998004 L17.499999030921387,17.03079435426681 z",
            visibility: "hidden",
            ref: 'body',
            refX: '2%',
            refY: '40%',
            magnet: false
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
        },{
            tagName: 'circle',
            selector:"endpoint_backgound"
        },{
            tagName:"polygon",
            selector :"EndpointBasedServiceInteraction"
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


joint.dia.Element.define('microtosca.Compute', {
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
        button: {
            ref: 'body',
            refX: '80%',
            refY: '0%',
            event: 'node:service:delete',
            visibility: "hidden",
        },
        icon: {
            visibility: "hidden",
            ref: "button",
            refX: '50%',
            refY: '50%',
        },
        MultipleServicesInOneContainer: { // MultipleServicesInOneContainer
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
        },
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
            selector: 'MultipleServicesInOneContainer'
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
        },{
            tagName: 'circle',
            selector:"endpoint_backgound"
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
            this.attr('MultipleServicesInOneContainer/visibility', 'hidden');
        },
        hideSmell(smell: SmellObject) {
            if (smell instanceof MultipleServicesInOneContainerSmellObject)
                this.attr("MultipleServicesInOneContainer/visibility", 'hidden')
        },
        showSmell(smell: SmellObject) {
            if (smell instanceof MultipleServicesInOneContainerSmellObject)
                this.attr("MultipleServicesInOneContainer/visibility", 'visible')
        },
        addSmell: function (smell: SmellObject) {
            this.attributes.smells.push(smell);

            if (smell instanceof MultipleServicesInOneContainerSmellObject)
                this.attr("MultipleServicesInOneContainer/visibility", 'visible')
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
            event: 'node:datastore:delete',
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
            strokeWidth: ".5",
            stroke:"white",
            d: "M9.91997319102718,0 C4.4419384554171515,0 0.0010000000443565072,4.441269098833944 0.0010000000443565072,9.919105448367283 S4.4419384554171515,19.838607668887942 9.91997319102718,19.838607668887942 S19.83947541154784,15.397206312669539 19.83947541154784,9.919105448367283 S15.398007926637208,0 9.91997319102718,0 zM8.81681434725255,9.919105448367283 C8.81681434725255,10.126286641122702 8.779054863989433,10.32321788658253 8.713058429144267,10.507716937903188 L11.481734515414267,11.839681056792323 C11.800408683268836,11.490852205281044 12.257490203960016,11.271304947078685 12.767011777589287,11.271304947078685 C13.729382635607042,11.271304947078685 14.509701203916634,12.051359000619358 14.509701203916634,13.013663729944883 C14.509701203916634,13.976166845347096 13.729184249530352,14.75655154234892 12.76661500543591,14.75655154234892 C11.804244147418157,14.75655154234892 11.023528806955186,13.976166845347096 11.023528806955186,13.013663729944883 C11.023528806955186,12.921414204284554 11.033117467328482,12.831346925467802 11.046872235312243,12.74319737872571 L8.09964868002225,11.325662732091438 C7.811525967977768,11.536481002919487 7.457539078472578,11.662191646848006 7.073331376618449,11.662191646848006 C6.110828261216235,11.662191646848006 5.330443564214414,10.882137593307332 5.330443564214414,9.918973190982824 C5.330443564214414,8.956800719041757 6.110828261216235,8.176614408116624 7.073331376618449,8.176614408116624 C7.457539078472578,8.176614408116624 7.811658225362228,8.302325052045145 8.09984706609894,8.512944936796506 L11.047269007465621,7.09574093362338 C11.033381982097401,7.007393000804599 11.023925579108564,6.917722494141225 11.023925579108564,6.825274582404208 C11.023925579108564,5.862573080925305 11.804442533494845,5.082386770000173 12.767011777589287,5.082386770000173 C13.729382635607042,5.082386770000173 14.509899589993324,5.862573080925305 14.509899589993324,6.825274582404208 C14.509899589993324,7.78777769780642 13.729382635607042,8.568162394808244 12.767011777589287,8.568162394808244 C12.257820847421163,8.568162394808244 11.800408683268836,8.348086107068045 11.481734515414267,7.999587899017914 L8.713058429144267,9.331022988369215 C8.779120992681664,9.515257524920953 8.81681434725255,9.712651671226388 8.81681434725255,9.919105448367283 z",
            event: 'smell:SharedPersistency:pointerdown',
            visibility: "hidden",
            ref: 'body',
            refX: '50%',
            refY: '50%',
            magnet: false
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
            event: 'node:communicationpattern:delete',
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
    smells: [], // list of smells that affects a single node
    isMaximed: true
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
            selector: 'maximize'
        }, {
            tagName: 'path',
            selector: 'singleLayerTeam'
        }],
        setMinimize: function(){
            return this.isMaximed = false; 
        },
        setMaximize: function(){
            return this.isMaximed = true;
        },
        getName: function () {
            return this.attr('label/text');
        },
        setName: function (text) {
            return this.attr('label/text', text || '');
        },
        showIcons: function () {
            if(this.isMaximed){
                this.attr('minimize/visibility', "visible");
            }else
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