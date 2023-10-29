import { Graph } from "src/app/graph/model/graph";
import { RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smells/smell";
import { Command } from "src/app/commands/icommand";
import * as joint from "jointjs";
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";

export class ChangeServiceOwnershipRefactoring extends RefactoringCommand {

    team: joint.shapes.microtosca.SquadGroup;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super(graph, smell);
        this.team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
    }

    getRefactoringImplementation(graph, smell): Command[] {
        let cmds: Command[] = [];
        let moveTo = new Map<joint.shapes.microtosca.Node, joint.shapes.microtosca.SquadGroup>();
        let NO_TEAM = new joint.shapes.microtosca.SquadGroup();
        smell.getLinkBasedCauses().forEach(link => {
            // The services interacting with one team are moved to that team
            // The services interacting with more than one team are just removed from the team of the smell
            let service = <joint.shapes.microtosca.Service>link.getSourceElement();
            let newTeam = moveTo.get(service);
            if(!newTeam) {
                let datastore = <joint.shapes.microtosca.Datastore>link.getTargetElement();
                let squadOfDatastore = <joint.shapes.microtosca.SquadGroup> graph.getTeamOfNode(datastore);
                moveTo.set(service, squadOfDatastore);
            } else {
                if(newTeam != NO_TEAM)
                    moveTo.set(service, NO_TEAM);
            }
        });

        // Add commands to execute
        moveTo.forEach((team, service) => {
            cmds.push(new RemoveMemberFromTeamGroupCommand(team, service));
            if(team != NO_TEAM) {
                cmds.push(new AddMemberToTeamGroupCommand(team, service));
            }
        });

        return cmds;
    }

    getName() {
        return "Change services ownership";
    }

    getDescription() {
        return `Move services out of this team's responsibility. Datastore's team is chosen when possible.`;
    }
}