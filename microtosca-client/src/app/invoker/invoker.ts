import { Command } from "./icommand";

export class GraphInvoker {
    undoStack: Command[];
    redoStack: Command[];


    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    executeCommand(refactoring: Command) {
        refactoring.execute();
        this.undoStack.push(refactoring);
    }

    undo() {
        if (this.undoStack.length <= 0) {
            return
        }
        let refactoring = this.undoStack.pop()
        refactoring.unexecute();
        this.redoStack.push(refactoring);
    }

    redo() {
        if (this.redoStack.length <= 0) {
            return
        }
        let refactoring = this.redoStack.pop()
        refactoring.execute();
        this.undoStack.push(refactoring);
    }

}