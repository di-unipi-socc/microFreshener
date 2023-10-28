import { GroupSmellObject } from "../smell";

export class NoApiGatewaySmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.Group) {
        super("NoAPiGatewaySmell", group);
    }

    getDescription(){
        let msg = "The node "
        this.getNodeBasedCauses().forEach(node=>{
            msg+= ` ${node.getName()}`
        })
        msg += " is accessed by external users without an Api Gateway."
        return msg;
    }
}