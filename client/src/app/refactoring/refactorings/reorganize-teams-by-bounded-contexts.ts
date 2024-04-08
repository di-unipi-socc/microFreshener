import { Graph } from "src/app/graph/model/graph";
import { GroupRefactoring } from "./refactoring-command";
import { GroupSmell } from "../smells/smell";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";

export class ReorganizeTeamsByBoundedContextsRefactoring implements GroupRefactoring {

    command: CompositeCommand;

    constructor(graph: Graph, smell: GroupSmell) {
        let cmds = [];
        smell.getLinkBasedCauses().forEach((link) => {
            let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
            let sourceTeam = graph.getTeamOfNode(sourceNode);
            let targetNode = <joint.shapes.microtosca.Node> link.getTargetElement();
            let targetTeam = graph.getTeamOfNode(targetNode);
            let changeSourceOwnership = new RemoveMemberFromTeamGroupCommand(sourceTeam, sourceNode)
                                        .bind(new AddMemberToTeamGroupCommand(targetTeam, sourceNode));
            cmds.push(changeSourceOwnership);
        });
        this.command = CompositeCommand.of(cmds);
    }

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Reorganize teams by bounded context";
    }

    getDescription() {
        return "Move the whole bounded context into the team borders.";
    }
}