import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";
import { GroupSmellObject } from "../smells/smell";
import { Graph } from "src/app/graph/model/graph";
import * as joint from "jointjs";
import { Command, CompositeCommand } from "src/app/commands/icommand";
import { GroupRefactoring } from "./refactoring-command";

export class SplitTeamsByCouplingRefactoring extends GroupRefactoring {

    private command: Command;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super();
        let cmds: Command[] = [];
        let team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
        let NO_TEAM = new joint.shapes.microtosca.SquadGroup();
        smell.getNodeBasedCauses().forEach((n) => {
            let teamCount: Map<joint.shapes.microtosca.SquadGroup, number> = graph.getConnectedLinks(n)
                                  .map((link) => {
                                        let source = <joint.shapes.microtosca.Node> link.getSourceElement();
                                        let sourceTeam;
                                        if(source) {
                                            sourceTeam = graph.getTeamOfNode(source);
                                        }
                                        let target = <joint.shapes.microtosca.Node> link.getTargetElement();
                                        let targetTeam;
                                        if(target) {
                                            targetTeam = graph.getTeamOfNode(target);
                                        }
                                        return sourceTeam !== team ? sourceTeam : targetTeam;
                                    })
                                  .filter((t) => t)
                                  .reduce(((map, t) => { map.has(t) ? map.set(t, map.get(t)+1) : map.set(t, 1); return map; }), new Map<joint.shapes.microtosca.SquadGroup, number>());
            let maxCount = Math.max(...Array.from(teamCount.values()));
            let maxTeams = Array.from(teamCount).filter(([t, count]) => count == maxCount).map(([t, c]) => t);
            let newTeam = maxTeams.length == 1 ? maxTeams[0] : NO_TEAM;
            if(newTeam != NO_TEAM) {
                let moveNodeCommand = new RemoveMemberFromTeamGroupCommand(team, n)
                                    .bind(new AddMemberToTeamGroupCommand(newTeam));
                cmds.push(moveNodeCommand);
                let name = this.getName();
                let description = `Let ${newTeam} manage this service`;
                this.addMemberRefactoring(n, moveNodeCommand, name, description);
            }
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
        return "Change ownership";
    }

    getDescription() {
        return `Change ownership of the nodes.`;
    }

}