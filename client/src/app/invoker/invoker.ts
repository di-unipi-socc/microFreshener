import { Command } from "./icommand";
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class GraphInvoker {
    undoStack: Command[];
    redoStack: Command[];

    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    executeCommand(command: Command) {
        command.execute();
        this.undoStack.push(command);
    }

    undo() {
        if (this.undoStack.length <= 0) {
            return
        }
        let command = this.undoStack.pop()
        command.unexecute();
        this.redoStack.push(command);
    }

    redo() {
        if (this.redoStack.length <= 0) {
            return
        }
        let command = this.redoStack.pop()
        command.execute();
        this.undoStack.push(command);
    }

}