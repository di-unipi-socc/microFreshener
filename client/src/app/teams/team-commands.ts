import { Command, CompositeCommand, ElementCommand, Sequentiable } from '../commands/icommand';
import { Graph } from "../graph/model/graph";
import { NodeCommand } from '../architecture/node-commands';

export abstract class TeamCommand extends ElementCommand<joint.shapes.microtosca.SquadGroup> {}

export class AddTeamGroupCommand extends TeamCommand {

    graph: Graph;
    team_name: string;

    constructor(graph: Graph, team_name: string) {
        super();
        this.graph = graph;
        this.team_name = team_name;
    }

    execute() {
        let team = this.graph.addTeamGroup(this.team_name);
        this.set(team);
    }

    unexecute() {
        this.get().remove();
        //let team = this.graph.getGroup(this.team_name);
        //team.remove();
    }

}

export class AddMemberToTeamGroupCommand extends NodeCommand<joint.shapes.microtosca.Node> {

    constructor(private team: joint.shapes.microtosca.SquadGroup, node?: joint.shapes.microtosca.Node) {
        super();
        this.set(node);
    }

    execute() {
        this.team.addMember(this.get());
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

    unexecute() {
        this.team.removeMember(this.get());
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

}

export class RemoveMemberFromTeamGroupCommand extends NodeCommand<joint.shapes.microtosca.Node> {

    constructor(private team: joint.shapes.microtosca.SquadGroup, node?: joint.shapes.microtosca.Node) {
        super();
        this.set(node);
    }

    execute() {
        this.team.removeMember(this.get());
        this.team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

    unexecute() {
        this.team.addMember(this.get());
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

export class AddManyMembersToTeamGroupCommand extends TeamCommand {

    command: Command;

    constructor(private members: joint.shapes.microtosca.Node[], team?: joint.shapes.microtosca.SquadGroup) {
        super(team);
    }

    execute() {
        let team = this.get();
        console.log("adding members to team", this.members, team);
        this.command = CompositeCommand.of(this.members.map((n) => new AddMemberToTeamGroupCommand(team, n)));
        this.command.execute();
    }
    unexecute() {
        this.command.unexecute();
    }

}

export class MergeTeamsCommand extends CompositeCommand {

    command;

    constructor(graph: Graph, newTeamName: string, ...teams: joint.shapes.microtosca.SquadGroup[]) {
        super(graph, newTeamName, teams);
    }

    getCommandsImplementation(graph, newTeamName, teams): Command[] {
        let cmds = [];
        teams.forEach((team) => cmds.push(new RemoveTeamGroupCommand(graph, team)));
        let members: joint.shapes.microtosca.Node[] = teams.flatMap((t) => <joint.shapes.microtosca.Node> t.getMembers());
        console.log("members joining are ", members.map((n) => n.getName()))
        cmds.push(new AddTeamGroupCommand(graph, newTeamName).then(new AddManyMembersToTeamGroupCommand(members)));
        return cmds;
    }
}