import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { MergeServicesCommand } from "src/app/architecture/nodes/node-commands";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";
import { ElementCommand } from "src/app/commands/icommand";


export class MergeServicesRefactoring implements Refactoring {

    command: ElementCommand<joint.shapes.microtosca.Service>;

    public static readonly NAME = "Merge services";

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return MergeServicesRefactoring.NAME;
    }

    getDescription() {
        return "Merge the services accessing the same datastore.";
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {

            constructor() {
                super();
            }

            build(): MergeServicesRefactoring {
                // Add the new merged service and link it to the datastore
                let databaseUsers = this.smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
                if(this.team) {
                    databaseUsers = databaseUsers.filter((node) => this.graph.getTeamOfNode(node) == this.team);
                }
                let position = this.graph.getPointCloseTo(this.smell.getLinkBasedCauses()[0].getTargetElement());
                let command: ElementCommand<joint.shapes.microtosca.Service> = new MergeServicesCommand(this.graph, position, ...databaseUsers);
                let refactoring = new MergeServicesRefactoring();
                refactoring.command = command;
                if(this.team) {
                    refactoring.command = refactoring.command.bind(new AddMemberToTeamGroupCommand<joint.shapes.microtosca.Service>(this.team));
                    let oldGetDescription = refactoring.getDescription;
                    refactoring.getDescription = () => `${oldGetDescription()}\nRestricted to ${this.team.getName()}'s nodes only.`;
                }
                return refactoring;
            }

        }
    }
}