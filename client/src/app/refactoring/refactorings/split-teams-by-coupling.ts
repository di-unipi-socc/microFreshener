import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";
import { GroupSmellObject } from "../smells/smell";
import { Graph } from "src/app/graph/model/graph";
import * as joint from "jointjs";
import { Command, CompositeCommand } from "src/app/commands/icommand";
import { GroupRefactoring, Refactoring } from "./refactoring-command";

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
            if(newTeam != NO_TEAM) {
                //console.debug("!= NO_TEAM")
                let moveNodeCommand = new RemoveMemberFromTeamGroupCommand(team, n)
                                    .then(new AddMemberToTeamGroupCommand(newTeam));
                this.command = moveNodeCommand;
                this.addMemberRefactoring(n, moveNodeCommand);
            }
        });
        this.command = CompositeCommand.of(cmds);
    }
    addMemberRefactoring(member: joint.shapes.microtosca.Node, command: Command, name?: string, description?: string): void {
        throw new Error("Method not implemented.");
    }
    getMemberRefactorings(): Map<joint.shapes.microtosca.Node, Refactoring> {
        throw new Error("Method not implemented.");
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