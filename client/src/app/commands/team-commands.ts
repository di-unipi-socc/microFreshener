import { Command } from './icommand';
import { Graph } from "../graph/model/graph";
import { NodeCommand } from './node-commands';


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
        var team = this.graph.getGroup(this.team_name);
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
