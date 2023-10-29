import { Graph } from "../../graph/model/graph";
import { GroupSmellObject, SmellObject } from '../smells/smell';
import { Command, CompositeCommand } from "../../commands/icommand";

export interface Refactoring extends Command {
    getName(): string;
    getDescription(): string;
}

export abstract class RefactoringCommand extends CompositeCommand implements Refactoring {
    
    abstract getName(): string;
    abstract getDescription(): string;

    abstract getRefactoringImplementation(graph: Graph, smell: (SmellObject | GroupSmellObject));

    getCommandsImplementation(graph, smell): Command[] {
        return this.getRefactoringImplementation(graph, smell);
    }

    constructor(graph, smell) {
        super(graph, smell);
    }

}

export abstract class GroupRefactoring extends RefactoringCommand {

    memberRefactorings: Map<joint.shapes.microtosca.Node, Refactoring>;

    abstract getGroupRefactoringImplementation(graph: Graph, smell: GroupSmellObject);

    getRefactoringImplementation(graph: Graph, smell: GroupSmellObject) {
        this.memberRefactorings = new Map<joint.shapes.microtosca.Node, Refactoring>();
        this.getGroupRefactoringImplementation(graph, smell);
    }

    constructor(graph: Graph, smell: GroupSmellObject) {
        super(graph, smell);
    }

    addMemberRefactoring(member: joint.shapes.microtosca.Node, command: Command, name?: string, description?: string) {
        let memberGetName = name ? () => { return name; } : this.getName;
        let memberGetDescription = description ? () => { return description; } : this.getDescription;
        this.memberRefactorings.set(member, new class implements Refactoring {
            getName(): string {
                return memberGetName();
            }
            getDescription(): string {
                return memberGetDescription();
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