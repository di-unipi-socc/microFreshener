import * as joint from "jointjs";
import { Command } from "src/app/commands/icommand";
import { Graph } from "src/app/graph/model/graph";
import { MergeTeamsCommand } from "src/app/teams-management/team-commands";
import { GroupSmellObject } from "../smells/smell";
import { GroupRefactoring } from "./refactoring-command";

export class MergeTeamsRefactoring extends GroupRefactoring {
    
    command: Command;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super();
        let teams = new Set<joint.shapes.microtosca.SquadGroup>(smell.getLinkBasedCauses().flatMap(link => [graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()), graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement())]));
        let mergedTeamName = Array.from(teams).map(team => team.getName()).join(" + ");
        this.command = new MergeTeamsCommand(graph, mergedTeamName, ...teams);
        // Add granular merge teams
        smell.getLinkBasedCauses().forEach(link => {
            let sourceTeam = graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement());
            let targetTeam = graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement());
            let mergeTeamsCommand = new MergeTeamsCommand(graph, `${sourceTeam.getName()} + ${targetTeam.getName()}`, sourceTeam, targetTeam);
            let name = `Merge ${sourceTeam.getName()} and ${targetTeam.getName()}`;
            let description = `Merge ${sourceTeam.getName()} and ${targetTeam.getName()}`;
            let member = sourceTeam == smell.getGroup() ? <joint.shapes.microtosca.Node> link.getSourceElement() : <joint.shapes.microtosca.Node> link.getTargetElement();
            this.addMemberRefactoring(member, mergeTeamsCommand, name, description);
        });
    }

    getName(): string {
        return "Merge teams";
    }
    getDescription(): string {
        return "Merge teams operating in the same bounded context."
    }
    execute(): void {
        this.command.execute();
    }
    unexecute(): void {
        this.command.unexecute();
    }


    
}