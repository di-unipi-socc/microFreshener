import { Graph } from "src/app/graph/model/graph";
import { RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smells/smell";
import { Command } from "src/app/commands/icommand";
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";

export class ChangeDatastoreOwnershipRefactoring extends RefactoringCommand {

    team: joint.shapes.microtosca.SquadGroup;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super(graph, smell);
    }

    getRefactoringImplementation(graph, smell): Command[] {
        let team = <joint.shapes.microtosca.SquadGroup>smell.getGroup();
        let cmds: Command[] = [];
        smell.getLinkBasedCauses().forEach(link => {
            let datastore = <joint.shapes.microtosca.Datastore>link.getTargetElement();
            let squadOfDatastore = <joint.shapes.microtosca.SquadGroup> graph.getTeamOfNode(datastore);
            cmds.push(new RemoveMemberFromTeamGroupCommand(squadOfDatastore, datastore).then(new AddMemberToTeamGroupCommand(team)));
        });

        return cmds;
    }

    getName() {
        return "Change datastores ownership";
    }

    getDescription() {
        return `Move datastores under this service team's responsibility.`;
    }
}
