import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { AddServiceCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand } from "src/app/commands/icommand";
import { RefactoringPolicy } from "./refactoring-policy";

export class AddDataManagerRefactoring implements Refactoring {

    command: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        let databaseManagerName = "DB manager";
        let dbManagerPosition = graph.getPointCloseTo(smell.getLinkBasedCauses()[0]?.getTargetElement());
        cmds.push(new AddServiceCommand(graph, databaseManagerName, dbManagerPosition));
        smell.getLinkBasedCauses().forEach(link => {
            cmds.push(new AddRunTimeLinkCommand(graph, (<joint.shapes.microtosca.Node> link.getSourceElement()).getName(), databaseManagerName));
            cmds.push(new RemoveLinkCommand(graph, link));
        });
        cmds.push(new AddRunTimeLinkCommand(graph, databaseManagerName, (<joint.shapes.microtosca.Datastore> smell.getLinkBasedCauses()[0].getTargetElement()).getName()));
        this.command = CompositeCommand.of(cmds);
    }

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Add data manager";
    }

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}