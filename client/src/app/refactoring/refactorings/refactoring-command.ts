import { Command, CompositeCommand } from "../../commands/icommand";

export interface Refactoring extends Command {
    getName(): string;
    getDescription(): string;
}

export abstract class GroupRefactoring implements Refactoring {

    abstract getName(): string;
    abstract getDescription(): string;
    abstract execute(): void;
    abstract unexecute(): void;

    private memberRefactorings: Map<joint.shapes.microtosca.Node, Refactoring>;

    constructor() {
        this.memberRefactorings = new Map<joint.shapes.microtosca.Node, Refactoring>();
    }

    addMemberRefactoring(member: joint.shapes.microtosca.Node, command: Command, name: string, description: string) {
        this.memberRefactorings.set(member, new class implements Refactoring {
            getName(): string {
                return name;
            }
            getDescription(): string {
                return description;
            }
            execute() {
                command.execute();
            }
            unexecute() {
                command.unexecute();
            };
        });
    }

    getMemberRefactorings(): Map<joint.shapes.microtosca.Node, Refactoring> {
        return this.memberRefactorings;
    }
}