import { Graph } from "src/app/graph/model/graph";
import { RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smell";
import { Command, Sequentiable } from "src/app/commands/icommand";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { AddDatastoreCommand } from "src/app/architecture/node-commands";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";

export class SplitTeamsSharedDatastoreRefactoring extends RefactoringCommand {

    constructor(graph: Graph,smell: GroupSmellObject) {
        super(graph, smell);
    }

    getRefactoringImplementation(graph, smell): Command[] {
        let team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
        let cmds: Command[] = [];
        cmds = smell.getLinkBasedCauses().map(link => {
            let databaseName = (<joint.shapes.microtosca.Service> link.getTargetElement()).getName();
            let service = <joint.shapes.microtosca.Service> link.getSourceElement();
            let newDatabaseName = `${service.getName()}'s ${databaseName}`;
            return Sequentiable.of(new RemoveLinkCommand(graph, link))
                .then(new AddDatastoreCommand(graph, newDatabaseName).then(new AddMemberToTeamGroupCommand(team)))
                .then(new AddLinkCommand(graph, service.getName(), newDatabaseName));
        });
        
        return cmds;
    }


    getName() {
        return "Split datastores";
    }

    getDescription() {
        return "Replace the interactions to external datastores with an internal datastore split.";
    }

}