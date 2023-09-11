import { SmellObject, EndpointBasedServiceInteractionSmellObject, WobblyServiceInteractionSmellObject, NoApiGatewaySmellObject, MultipleServicesInOneContainerSmellObject } from '../analyser/smell';
import * as joint from 'jointjs';

export class Node extends joint.dia.Element {
    name: string;
    smells: SmellObject[];        // list of smells that affects a single node
    ignoreSmells: SmellObject[];

    constructor(name: string, attributes?: any, options?: any) {
        super(attributes, options);
        this.smells = [];
        this.ignoreSmells = [];
        this.set("size", { width: 80, height: 80 })
        this.set("markup", [{
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: "path",
            selector: "delete"
        },{
            tagName: 'circle',
            selector: 'body',
        }]);
    
        this.set("attrs", {
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 15,
                fill: '#333333',
                text: 'caio',
            },
            delete: {
                d: "M 40 30 L 35 25 L 30 30 L 25 25 L 30 20 L 25 15 L 30 10 L 35 15 L 40 10 L 45 15 L 40 20 L 45 25 L 40 30 Z",
                event: 'node:delete:pointerdown',
                visibility: "visible",
                ref: 'body',
                refX: '-30%',
                refY: '-30%',
                refWidth: '5%',
                refHeight: '5%',
                fill: '#F78686',
                magnet: false
            },
        });
        this.setName(name);
    }

    setBodyMarkup(markup){
        this.set
    }

    defaults(): Backbone.ObjectHash {
        return joint.util.deepSupplement({}, joint.shapes.basic.Rect.prototype.defaults);
    }

    ignoreOnce(smell: SmellObject) {
        this.hideSmell(smell);
    }
    ignoreAlways(smell: SmellObject) {
        this.hideSmell(smell);
        this.attributes.ignoreSmells.push(smell);
    }
    undoIgnoreAlways(smell: SmellObject) {
        this.showSmell(smell);
        this.attributes.ignoreSmells = this.attributes.ignoreSmells.filter(function (sm) {
            return sm.getName() != smell.getName();
        });
    }
    getIgnoredSmells() {
        return this.attributes.ignoreSmells;
    }
    getName() {
        return this.attr('label/text');
    }
    setName(text) {
        return this.attr('label/text', text || '');
    }
    getSmells() {
        return this.attributes.smells;
    }
    getSmell(name: string) {
        return this.attributes.smells.find(smell => {
            return name === smell.name;
        });
    }
    showIcons() {
        this.attr('delete/visibility', 'visible')
    }
    hideIcons() {
        this.attr('delete/visibility', 'hidden')
    }
    resetSmells() {
        this.attributes.smells = [];
        this.attr('EndpointBasedServiceInteraction/visibility', 'hidden');
        this.attr('wsi/visibility', 'hidden');
        this.attr('NoApiGateway/visibility', 'hidden');
        this.attr('MultipleServicesInOneContainer/visibility', 'hidden');
    }
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
        else if (smell instanceof MultipleServicesInOneContainerSmellObject) {
            this.attr("MultipleServicesInOneContainer/visibility", 'hidden')
        }
    }
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
        else if (smell instanceof MultipleServicesInOneContainerSmellObject) {
            this.attr("MultipleServicesInOneContainer/visibility", 'visible')
        }
    }
    addSmell(smell: SmellObject) {
        this.attributes.smells.push(smell);
        if (smell instanceof EndpointBasedServiceInteractionSmellObject)
            this.attr('EndpointBasedServiceInteraction/visibility', 'visible');
        else if (smell instanceof WobblyServiceInteractionSmellObject)
            this.attr('wsi/visibility', 'visible');
        else if (smell instanceof NoApiGatewaySmellObject)
            this.attr('NoApiGateway/visibility', 'visible');
        else if (smell instanceof MultipleServicesInOneContainerSmellObject)
            this.attr("MultipleServicesInOneContainer/visibility", 'visible')
    }
}

export class Service extends Node {
    constructor(name: string, attributes?: any, options?: any) {
        super(name, attributes, options);
        this.attr({
            body: {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
                strokeWidth: 8,
                stroke: '#74F2CE',
                fill: 'none',
                magnet: true
            }
        });
    }
    defaults(): Backbone.ObjectHash {
        return joint.util.deepSupplement({}, super.defaults())
    }
}

export class Datastore extends Node {
    constructor(name: string, attributes?: any, options?: any) {
        super(name, attributes, options);
        this.attr({
            body:{
            refWidth: '100%',
            refHeight: '100%',
            fill: 'white',
            stroke: '#F4A259',
            strokeWidth: 8,
            rx: 10,
            ry: 10,
            magnet: true
            }
        });
    }
    // defaults(): Backbone.ObjectHash {
    //     return joint.util.deepSupplement({}, super.defaults())
    // }
}

export class Compute extends Node {
    constructor(name: string, attributes?: any, options?: any) {
        super(name, attributes, options);
        this.attr({
            body: {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
                strokeWidth: 8,
                stroke: '#74F2CE',
                fill: 'none',
                magnet: true
            }
        });
    }
    defaults(): Backbone.ObjectHash {
        return joint.util.deepSupplement({}, super.defaults())
    }
}