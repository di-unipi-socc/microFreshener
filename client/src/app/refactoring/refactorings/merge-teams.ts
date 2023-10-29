import { Graph } from "src/app/graph/model/graph";
import { RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smells/smell";
import { Command } from "src/app/commands/icommand";
import { MergeTeamsCommand } from "src/app/teams/team-commands";
import * as _ from "lodash";

export class MergeTeamsRefactoring extends RefactoringCommand {

    getRefactoringImplementation(graph: Graph, smell: GroupSmellObject): Command[] {
        let nodeBasedCauses = smell.getNodeBasedCauses();
        let linkBasedCauses = smell.getLinkBasedCauses();
        let links;
        if(nodeBasedCauses.length > 0 && linkBasedCauses.length == 0) {
            links = nodeBasedCauses.flatMap((node) => graph.getConnectedLinks(node));
        } else {
            links = linkBasedCauses;
        }
        let teams: joint.shapes.microtosca.SquadGroup[] = _.uniq(links.flatMap((link) => [link.getSourceElement(), link.getTargetElement()])
                         .map((n: joint.shapes.microtosca.Node) => graph.getTeamOfNode(n))
                         .filter((t) => t));
        console.log("teams are:", teams.map((t) => t.getName()));
        let thisTeam = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
        let name = "Merged " + thisTeam.getName();
        return [new MergeTeamsCommand(graph, name, ...teams)];
    }

    getName(): string {
        return "Merge teams";
    }

    getDescription(): string {
        return "Merge all the teams involved.";
    }

}

