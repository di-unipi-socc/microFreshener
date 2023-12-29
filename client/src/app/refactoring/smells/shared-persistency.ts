import { NodeSmell } from "./smell";

export class SharedPersistencySmellObject extends NodeSmell {
    
    private constructor() { super(); }

    getName(): string {
        return "Shared persistency";
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Node>link.getSourceElement();
            let target = <joint.shapes.microtosca.Node>link.getTargetElement();
            descr += `${source.getName()} is not the only service interacting with ${target.getName()}.\n`;
        })
        return descr;
    }
    
    
}