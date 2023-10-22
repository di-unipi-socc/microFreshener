import { Command } from "./icommand";
import { Injectable } from '@angular/core';
import { AnalyserService } from '../refactoring/analyser.service';
import { Refactoring } from '../refactoring/refactoring-command';
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GraphInvoker {
    undoStack: Command[];
    redoStack: Command[];

    // This Observable will be used to subscribe to the "do" events.
    private invokeSubject: Subject<void> = new Subject<void>();
    private observableInvocation: Observable<void> = this.invokeSubject.asObservable();

    constructor(private as: AnalyserService) {
        this.undoStack = [];
        this.redoStack = [];
    }

    executeCommand(command: Command) {
        command.execute();
        // clear the smell after executing a refactoringcommand
        if (command instanceof RefactoringCommand)
            this.as.clearSmells()
        this.undoStack.push(command);

        this.invokeSubject.next();
    }

    undo() {
        if (this.undoStack.length <= 0) {
            return
        }
        let command = this.undoStack.pop()
        command.unexecute();
        this.redoStack.push(command);

        this.invokeSubject.next();
    }

    redo() {
        if (this.redoStack.length <= 0) {
            return
        }
        let command = this.redoStack.pop()
        command.execute();
        this.undoStack.push(command);

        this.invokeSubject.next();
    }

    subscribe(observer) {
        return this.observableInvocation.subscribe(observer);
    }

}