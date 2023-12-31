import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { AddServiceCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand, ElementCommand } from "src/app/commands/icommand";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";

export class AddDataManagerRefactoring implements Refactoring {

    public static readonly NAME = "Add data manager";

    command: CompositeCommand;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Add data manager";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {
            build(): AddDataManagerRefactoring {
                let cmds = [];
                let links = this.smell.getLinkBasedCauses();
                let databaseManagerName = "DB manager";
                let dbManagerPosition = this.graph.getPointCloseTo(this.smell.getLinkBasedCauses()[0]?.getTargetElement());
                let addServiceInTeamIfAny: ElementCommand<joint.shapes.microtosca.Service> = new AddServiceCommand(this.graph, databaseManagerName, dbManagerPosition);
                if(this.team) addServiceInTeamIfAny = addServiceInTeamIfAny.bind(new AddMemberToTeamGroupCommand(this.team));
                cmds.push(addServiceInTeamIfAny);
                if(this.team) links = links.filter((l) => this.graph.getTeamOfNode((<joint.shapes.microtosca.Node> l.getSourceElement())) == this.team);
                links.forEach(link => {
                    cmds.push(new AddRunTimeLinkCommand(this.graph, (<joint.shapes.microtosca.Node> link.getSourceElement()).getName(), databaseManagerName));
                    cmds.push(new RemoveLinkCommand(this.graph, link));
                });
                cmds.push(new AddRunTimeLinkCommand(this.graph, databaseManagerName, (<joint.shapes.microtosca.Datastore> this.smell.getLinkBasedCauses()[0].getTargetElement()).getName()));
                let command = CompositeCommand.of(cmds);
                let refactoring = new AddDataManagerRefactoring();
                refactoring.command = command;
                let sharedDatastores = new Set(links.map((link) => <joint.shapes.microtosca.Node>link.getTargetElement()));
                refactoring.getDescription = () => {
                    return "Add a DB manager where needed before " + Array.from(sharedDatastores).map((d) => d?.getName()).join(", ") + ".";
                }
                return refactoring;
            }
        }
    }

}
