import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";
import { RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smell";
import { Graph } from "src/app/graph/model/graph";
import { Command } from "src/app/commands/icommand";
import * as joint from "jointjs";

export class ChangeNodeOwnershipToMostCoupledRefactoring extends RefactoringCommand {

    team: joint.shapes.microtosca.SquadGroup;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super(graph, smell);
        this.team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
    }

    getRefactoringImplementation(graph: Graph, smell): Command[] {
        let cmds: Command[] = [];
        let team: joint.shapes.microtosca.SquadGroup = smell.getGroup();
        let NO_TEAM = new joint.shapes.microtosca.SquadGroup();
        smell.getNodeBasedCauses().forEach((n) => {
            let teamCount: Map<joint.shapes.microtosca.SquadGroup, number> = graph.getConnectedLinks(n)
                                  .map((link) => {
                                        let source = <joint.shapes.microtosca.Node> link.getSourceElement();
                                        let sourceTeam;
                                        if(source) {
                                            console.debug("getting source team")
                                            sourceTeam = graph.getTeamOfNode(source);
                                        }
                                        let target = <joint.shapes.microtosca.Node> link.getTargetElement();
                                        let targetTeam;
                                        if(target) {
                                            console.debug("getting target team")
                                            targetTeam = graph.getTeamOfNode(target);
                                        }
                                        console.debug("source - target - link", (<joint.shapes.microtosca.Node> link.getSourceElement()).getName(), (<joint.shapes.microtosca.Node> link.getTargetElement()).getName(), link)
                                        console.debug("sourceTeam - targetTeam", sourceTeam, targetTeam);
                                        return sourceTeam !== team ? sourceTeam : targetTeam;
                                    })
                                  .filter((t) => t)
                                  .reduce(((map, t) => {console.debug("updating with data of team", t); map.has(t) ? map.set(t, map.get(t)+1) : map.set(t, 1); return map; }), new Map<joint.shapes.microtosca.SquadGroup, number>());
            let maxCount = Math.max(...Array.from(teamCount.values()));
            let maxTeams = Array.from(teamCount).filter(([t, count]) => count == maxCount).map(([t, c]) => t);
            let newTeam = maxTeams.length == 1 ? maxTeams[0] : NO_TEAM;
            console.debug("teamCount is", teamCount);
            console.debug("newTeam", newTeam);
            console.debug("teams are", maxTeams);
            if(newTeam != NO_TEAM) {
                console.debug("!= NO_TEAM")
                cmds.push(new RemoveMemberFromTeamGroupCommand(team, n));
                cmds.push(new AddMemberToTeamGroupCommand(newTeam, n));
            }
        });
        return cmds;
    }

    getName() {
        return "Change ownership";
    }

    getDescription() {
        return `Change ownership of the nodes.`;
    }

}