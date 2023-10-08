import { Command } from './icommand';
import { Graph } from "../graph/model/graph";
import { NodeCommand } from './node-commands';
import { remove } from 'lodash';


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

export class AddMemberToTeamGroupCommand extends NodeCommand {

    constructor(private team: joint.shapes.microtosca.SquadGroup, private member?: joint.shapes.microtosca.Node) {
        super();
    }

    execute(node?) {
        if(!node) {
            node = this.member;
        }
        this.team.addMember(node);
        this.member = node;
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
        return node;
    }

    unexecute(node?: joint.shapes.microtosca.Node) {
        if(!node)
            node = this.member;
        this.team.removeMember(node);
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
        return node;
    }
}

export class RemoveMemberFromTeamGroupCommand extends NodeCommand {

    constructor(private team: joint.shapes.microtosca.SquadGroup, private member?: joint.shapes.microtosca.Node) {
        super();
    }

    execute(node?) {
        if(!node) {
            node = this.member;
        }
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