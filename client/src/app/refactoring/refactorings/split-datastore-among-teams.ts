import { Graph } from "src/app/graph/model/graph";
import { GroupRefactoring } from "./refactoring-command";
import { GroupSmell } from "../smells/smell";
import { AddDatastoreCommand } from "src/app/architecture/nodes/node-commands";
import { CompositeCommand, Sequentiable } from "src/app/commands/icommand";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";
import { ChangeLinkTargetCommand } from "src/app/architecture/interacts-with-links/interaction-with-commands";

export class SplitDatastoreAmongTeamsRefactoring extends GroupRefactoring {

    command: CompositeCommand;

    constructor(graph: Graph, smell: GroupSmell) {
        super();
        let cmds = [];
        smell.getLinkBasedCauses().filter((link) => graph.isDatastore(link.getTargetElement())).forEach((link) => {
            // Add the whole-team command as a split of each involved datastore in the users' team
            let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
            let sourceTeam = graph.getTeamOfNode(sourceNode);
            let newDatastoreName = "DB " + sourceNode.getName();
            let addDatastoreInServiceTeamCommand = Sequentiable.of(new AddDatastoreCommand(graph, newDatastoreName, graph.getPointCloseTo(sourceNode)).bind(new AddMemberToTeamGroupCommand(sourceTeam)))
                                                    .then(new ChangeLinkTargetCommand(graph, link, newDatastoreName));
            cmds.push(addDatastoreInServiceTeamCommand);
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
        return "Split datastore";
    }

    getDescription() {
        return "Split datastore.";
    }
}