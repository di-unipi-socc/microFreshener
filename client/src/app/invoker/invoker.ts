import { Command } from "./icommand";
import { Injectable } from '@angular/core';
import { AnalyserService } from '../analyser.service';
import { RefactoringCommand } from '../refactor/refactoring-command';

@Injectable({
    providedIn: 'root'
})
export class GraphInvoker {
    undoStack: Command[];
    redoStack: Command[];

    constructor(private as: AnalyserService) {
        this.undoStack = [];
        this.redoStack = [];
    }

    executeCommand(command: Command) {
        command.execute();
        // clera the smell after executing a refactoringcommnad
        if (command instanceof RefactoringCommand)
            this.as.clearSmells()
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