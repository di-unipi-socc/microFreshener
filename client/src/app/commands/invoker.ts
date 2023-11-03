import { Command } from "./icommand";
import { Injectable } from '@angular/core';
import { AnalyserService } from '../refactoring/analyser.service';
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

    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    executeCommand(command: Command, silent?: boolean) {
        command.execute();
        this.undoStack.push(command);
        if(!silent)
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