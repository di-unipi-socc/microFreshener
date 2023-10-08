import { Command } from './icommand';
import { Graph } from "../graph/model/graph";


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

export class AddMemberToTeamGroupCommand {

    constructor(private team: joint.shapes.microtosca.SquadGroup, private node: joint.shapes.microtosca.Node) {}

    execute() {
        this.team.addMember(this.node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

    unexecute() {
        this.team.removeMember(this.node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }
}

export class RemoveMemberFromTeamGroupCommand {

    constructor(private team: joint.shapes.microtosca.SquadGroup, private member?: joint.shapes.microtosca.Node) {}

    execute(node?) {
        if(!node) {
            node = this.member;
        }
        console.log("Removing node from team", node, this.team.getName());
        this.team.removeMember(node);
        this.member = node;
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
        return node;
    }

    unexecute(node?: joint.shapes.microtosca.Node) {
        if(!node)
            node = this.member;
        this.team.addMember(node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
        return node;
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
        this.team.remove();
    }

    unexecute() {
        this.graph.addTeamGroup(this.team.getName());
        this.removeMemberCommands.forEach((command) => command.unexecute());
    }
}