import { Graph } from "../../graph/model/graph";
import { SmellObject } from '../smell';
import { Command, CompositeCommand } from "../../commands/icommand";

export interface Refactoring extends Command {
    getName(): string;
    getDescription(): string;
}

export abstract class RefactoringCommand extends CompositeCommand {
    
    abstract getRefactoringImplementation(graph: Graph, smell: SmellObject);

    getCommandsImplementation(graph, smell): Command[] {
        return this.getRefactoringImplementation(graph, smell);
    }

    constructor(graph, smell) {
        super(graph, smell);
    }

}