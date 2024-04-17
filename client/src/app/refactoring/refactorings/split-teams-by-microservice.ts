import * as joint from "jointjs";
import { AddDatastoreCommand } from "src/app/architecture/nodes/node-commands";
import { Command, CompositeCommand, Sequentiable } from "src/app/commands/icommand";
import { Graph } from "src/app/graph/model/graph";
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";
import { GroupSmell } from "../smells/smell";
import { GroupRefactoring } from "./refactoring-command";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/interacts-with-links/interaction-with-commands";

export class SplitTeamsByMicroserviceRefactoring implements GroupRefactoring {
    
    command: Command;

    private datastoreUsedInItsTeam(graph: Graph, datastore: joint.shapes.microtosca.Datastore): boolean {
        let datastoreTeam = graph.getTeamOfNode(datastore);
        return graph.getIngoingLinks(datastore)
                .map(link => graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()) == datastoreTeam)
                .reduce((acc, curr) => acc || curr, false);
    }

    constructor(graph: Graph, smell: GroupSmell) {
        let sourceTeam = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
        let cmds: Command[] = [];
        smell.getLinkBasedCauses().forEach(link => {
            let service = <joint.shapes.microtosca.Service> link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node> link.getTargetElement();
            if(graph.isDatastore(targetNode) && this.datastoreUsedInItsTeam(graph, <joint.shapes.microtosca.Datastore> targetNode)) {
                // Service in one team -> Datastore in another team which is used internally
                let databaseName = (<joint.shapes.microtosca.Service> link.getTargetElement()).getName();
                let newDatabaseName = `${service.getName()}'s ${databaseName}`;
                let splitDatastore = Sequentiable.of(new RemoveLinkCommand(graph, link))
                    .then(new AddDatastoreCommand(graph, newDatabaseName, graph.getPointCloseTo(service)).bind(new AddMemberToTeamGroupCommand(sourceTeam)))
                    .then(new AddRunTimeLinkCommand(graph, service.getName(), newDatabaseName));
                // Add to global command and single nodes
                cmds.push(splitDatastore);
            } else {
                console.debug("SLT - Communication pattern found");
                let targetTeam = <joint.shapes.microtosca.SquadGroup> graph.getTeamOfNode(targetNode);
                let moveTarget = new RemoveMemberFromTeamGroupCommand(targetTeam, targetNode)
                                .bind(new AddMemberToTeamGroupCommand(sourceTeam));
                cmds.push(moveTarget);
            }
        });
        this.command = CompositeCommand.of(cmds);
    }

    getName(): string {
        return "Split teams by microservice";
    }
    getDescription(): string {
        return "Split non-service nodes to the teams where they are used by services."
    }
    execute(): void {
        this.command.execute();
    }
    unexecute(): void {
        this.command.unexecute();
    }


    
}