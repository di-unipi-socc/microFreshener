export interface Graph {
    
    addService(name:string):void;
    removeService():void;

    addDatabase(name:string):void;
    removeDatabase():void;

    addCommunicationPattern(name:string, type:string):void;
    removeCommunicationPattern():void;
}