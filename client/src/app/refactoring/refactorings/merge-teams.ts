import * as joint from "jointjs";
import { Command } from "src/app/commands/icommand";
import { Graph } from "src/app/graph/model/graph";
import { MergeTeamsCommand } from "src/app/teams/team-commands";
import { GroupSmell } from "../smells/smell";
import { GroupRefactoring } from "./refactoring-command";

export class MergeTeamsRefactoring extends GroupRefactoring {
    
    command: Command;

    constructor(graph: Graph, smell: GroupSmell) {
        super();
        let teams = new Set<joint.shapes.microtosca.SquadGroup>(smell.getLinkBasedCauses().flatMap(link => [graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()), graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement())]));
        let mergedTeamName = Array.from(teams).map(team => team.getName()).join(" + ");
        this.command = new MergeTeamsCommand(graph, mergedTeamName, ...teams);
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