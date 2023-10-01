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
        var team = this.graph.getGroup(this.team_name);
        team.remove();
    }

}

export class AddMemberToTeamGroupCommand implements Command {

    graph: Graph;
    team_name: string;
    member_name: string;

    constructor(graph: Graph, team_name: string, member_name:string) {
        this.graph = graph;
        this.team_name = team_name;
        this.member_name = member_name;
    }

    execute() {
        var team = this.graph.getGroup(this.team_name)
        var node = this.graph.getNode(this.member_name);
        team.addMember(node);
    }

    unexecute() {
        var team = this.graph.getGroup(this.team_name);
        var node = this.graph.getNode(this.member_name);
        team.removeMember(node);
    }
}


export class RemoveMemberFromTeamGroupCommand implements Command {

    graph: Graph;
    team_name: string;
    member_name: string;

    constructor(graph: Graph, team_name: string, member_name:string) {
        this.graph = graph;
        this.team_name = team_name;
        this.member_name = member_name;
    }

    execute() {
        var team = this.graph.getGroup(this.team_name)
        var node = this.graph.getNode(this.member_name);
        team.removeMember(node);
    }

    unexecute() {
        var team = this.graph.getGroup(this.team_name);
        var node = this.graph.getNode(this.member_name);
        team.addMember(node);
    }   
}