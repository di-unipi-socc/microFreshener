import {Node} from './node';

export interface Graph {
    // getNodes():Node[];

    addService(name:string):void;
    removeService():void;

    addDatabase(name:string):void;
    removeDatabase():void;

    addCommunicationPattern(name:string, type:string):void;
    removeCommunicationPattern():void;

    addRunTimeInteraction(source:Node, target:Node);
    // addDeploymentTimeInteration():void;
}