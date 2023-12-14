import * as joint from "jointjs";
import { RemoveLinkCommand, AddRunTimeLinkCommand } from "src/app/architecture/link-commands";
import { AddDatastoreCommand } from "src/app/architecture/node-commands";
import { Command, CompositeCommand, Sequentiable } from "src/app/commands/icommand";
import { Graph } from "src/app/graph/model/graph";
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from "src/app/teams/team-commands";
import { GroupSmellObject } from "../smells/smell";
import { GroupRefactoring } from "./refactoring-command";

export class SplitTeamsByService extends GroupRefactoring {
    
    command: Command;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super();
        let team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
        let cmds: Command[] = [];
        smell.getLinkBasedCauses().forEach(link => {
            let service = <joint.shapes.microtosca.Service> link.getSourceElement();
            let targetNode = link.getTargetElement();
            if(graph.isDatastore(targetNode)) {
                let datastore = <joint.shapes.microtosca.Datastore> targetNode;
                // Service in one team -> Datastore in another team
                let databaseName = (<joint.shapes.microtosca.Service> link.getTargetElement()).getName();
                let newDatabaseName = `${service.getName()}'s ${databaseName}`;
                let splitDatastore = Sequentiable.of(new RemoveLinkCommand(graph, link))
                    .then(new AddDatastoreCommand(graph, newDatabaseName, graph.getPointCloseTo(service)).bind(new AddMemberToTeamGroupCommand(team)))
                    .then(new AddRunTimeLinkCommand(graph, service.getName(), newDatabaseName));
                // Add to global command and single nodes
                cmds.push(splitDatastore);
                let name = this.getName();
                let datastoreTeam = graph.getTeamOfNode(datastore);
                let description = `Split datastore among ${team.getName()} and ${datastoreTeam.getName()}`;
                this.addMemberRefactoring(service, splitDatastore, name, description);
                this.addMemberRefactoring(datastore, splitDatastore, name, description);
            } else if(graph.isCommunicationPattern) {
                console.debug("SLT - Communication pattern found");
                // Service in one team -> Communication pattern in another team which is not used by any service of its team
                let communicationPattern = <joint.shapes.microtosca.CommunicationPattern> targetNode;
                let communicationPatternTeam = <joint.shapes.microtosca.SquadGroup> graph.getTeamOfNode(communicationPattern);
                let moveCommunicationPattern = new RemoveMemberFromTeamGroupCommand(communicationPatternTeam, communicationPattern)
                                                .bind(new AddMemberToTeamGroupCommand(team));
                // Add to global command and single nodes
                cmds.push(moveCommunicationPattern);
                let name = this.getName();
                let description = `Split datastore among ${team.getName()} and ${communicationPatternTeam.getName()}`;
                this.addMemberRefactoring(service, moveCommunicationPattern, name, description);
                this.addMemberRefactoring(communicationPattern, moveCommunicationPattern, name, description);
            }
        });
        this.command = CompositeCommand.of(cmds);
    }

    getName(): string {
        return "Split teams by service";
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