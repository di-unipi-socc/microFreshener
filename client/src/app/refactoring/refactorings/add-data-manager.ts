import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { AddServiceCommand } from "src/app/architecture/node-commands";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand } from "src/app/commands/icommand";

export class AddDataManagerRefactoring implements Refactoring {

    cmd: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        let databaseManagerName = "DB manager";
        cmds.push(new AddServiceCommand(graph, databaseManagerName));
        smell.getLinkBasedCauses().forEach(link => {
            cmds.push(new AddLinkCommand(graph, (<joint.shapes.microtosca.Node> link.getSourceElement()).getName(), databaseManagerName));
            cmds.push(new RemoveLinkCommand(graph, link));
        });
    }

    execute() {
        this.cmd.execute();
    }

    unexecute() {
        this.cmd.unexecute();
    }

    getName() {
        return "Add data manager";
    }

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}