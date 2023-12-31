import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";
import { GroupSmell } from "../smells/smell";
import { Graph } from "src/app/graph/model/graph";
import * as joint from "jointjs";
import { Command, CompositeCommand, ElementCommand } from "src/app/commands/icommand";
import { GroupRefactoring } from "./refactoring-command";

export class SplitTeamsByCouplingRefactoring extends GroupRefactoring {

    private command: Command;

    constructor(graph: Graph, smell: GroupSmell) {
        super();
        let cmds: Command[] = [];
        let team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
        smell.getNodeBasedCauses().forEach((n) => {
            // Count the # links to other teams as a degree of coupling
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
            // If there are teams with the same degree of coupling, add refactorings
            if(maxTeams.length > 0) {
                // Team-global refactoring: move if only one team is available, else just remove it from the current team
                let moveIfPossibleElseJustRemoveFromTeam: ElementCommand<joint.shapes.microtosca.Node> = new RemoveMemberFromTeamGroupCommand(team, n);
                if(maxTeams.length == 1) {
                    moveIfPossibleElseJustRemoveFromTeam = moveIfPossibleElseJustRemoveFromTeam.bind(new AddMemberToTeamGroupCommand(maxTeams[0]));
                }
                cmds.push(moveIfPossibleElseJustRemoveFromTeam);
                // Node-specific refactoring: add a refactoring for each max-coupled team
                maxTeams.forEach((newTeam) => {
                    let moveNodeCommand = new RemoveMemberFromTeamGroupCommand(team, n)
                                        .bind(new AddMemberToTeamGroupCommand(newTeam));
                    let name = `Change ownership to ${newTeam.getName()}'s`;
                    let description = `Move ${n.getName()} under ${newTeam.getName()}'s ownership`;
                    this.addMemberRefactoring(n, moveNodeCommand, name, description);
                });
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