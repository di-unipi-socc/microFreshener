import { Command, ElementCommand, Sequentiable } from '../commands/icommand';
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
        this.set(this.graph.addTeamGroup(this.team_name));
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

export class MergeTeamsCommand implements Command {

    newTeamName: string;
    team: joint.shapes.microtosca.SquadGroup;
    teams: joint.shapes.microtosca.SquadGroup[];

    command;

    constructor(private graph: Graph, newTeamName: string, team: joint.shapes.microtosca.SquadGroup, ...teams: joint.shapes.microtosca.SquadGroup[]) {
        this.newTeamName = newTeamName;
        this.team = team;
        this.teams = teams;
        this.command = this.getCommandImplementation()
    }

    getCommandImplementation() {
        let removeTeamsCommand = this.teams.map((team) => Sequentiable.of(new RemoveTeamGroupCommand(this.graph, team)))
                                            .reduce(((cmd, current) => cmd.then(current)), Sequentiable.of(new RemoveTeamGroupCommand(this.graph, this.team)));
        let members = this.teams.flatMap((t) => t.getMembers());
        let createTeamThenAddMembers = new AddTeamGroupCommand(this.graph, this.newTeamName).then(new class extends TeamCommand {
            addMemberCmds: Command[];
            execute() {
                let team = this.get();
                this.addMemberCmds = members.map((n) => new AddMemberToTeamGroupCommand(team, n));
                this.addMemberCmds.forEach((cmd) => {
                    cmd.execute();
                });
            }
            unexecute() {
                this.addMemberCmds.forEach((cmd) => {
                    cmd.unexecute();
                })
            }
        });
        return removeTeamsCommand.then(createTeamThenAddMembers);
    }

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

}