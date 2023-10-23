import { Command } from '../commands/icommand';
import { Graph } from "../graph/model/graph";
import { NodeCommand } from '../architecture/node-commands';


export class AddTeamGroupCommand implements Command {

    graph: Graph;
    team_name: string;

    constructor(graph: Graph, team_name: string) {
        this.graph = graph;
        this.team_name = team_name;
    }

    execute() {
        this.graph.addTeamGroup(this.team_name);
    }

    unexecute() {
        let team = this.graph.getGroup(this.team_name);
        team.remove();
    }

}

export class AddMemberToTeamGroupCommand extends NodeCommand<joint.shapes.microtosca.Node> {

    constructor(private team: joint.shapes.microtosca.SquadGroup, node?: joint.shapes.microtosca.Node) {
        super();
        this.node = node;
    }

    execute() {
        this.team.addMember(this.node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

    unexecute() {
        this.team.removeMember(this.node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

}

export class RemoveMemberFromTeamGroupCommand extends NodeCommand<joint.shapes.microtosca.Node> {

    constructor(private team: joint.shapes.microtosca.SquadGroup, node?: joint.shapes.microtosca.Node) {
        super();
        this.node = node;
    }

    execute() {
        this.team.removeMember(this.node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

    unexecute() {
        this.team.addMember(this.node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }
    
}

export class RemoveTeamGroupCommand implements Command {

    removeMemberCommands: RemoveMemberFromTeamGroupCommand[];

    constructor(
        private graph: Graph,
        private team: joint.shapes.microtosca.SquadGroup
    ) {}

    execute() {
        this.removeMemberCommands = [];
        this.team.getMembers().map((member) => new RemoveMemberFromTeamGroupCommand(this.team, member))
        .forEach((command) => {
            this.removeMemberCommands.push(command);
            command.execute();
        });
        this.team = this.team.remove();
    }

    unexecute() {
        this.graph.addCell(this.team);
        this.removeMemberCommands.forEach((command) => command.unexecute());
    }
}