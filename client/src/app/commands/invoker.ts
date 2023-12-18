import { Command } from "./icommand";
import { Injectable } from '@angular/core';
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

    async executeCommand(command: Command, silent?: boolean) {
        try {
            command.execute();
            this.undoStack.push(command);
        if(!silent)
            this.invokeSubject.next();
        } catch (e) {
            Promise.reject(e);
        }
    }

    async undo() {
        if (this.undoStack.length <= 0) {
            return Promise.reject("No commands to undo.");
        }
        try {
            let command = this.undoStack.pop()
            command.unexecute();
            this.redoStack.push(command);
            this.invokeSubject.next();
        } catch(e) {
            Promise.reject(e);
        }
    }

    async redo() {
        if (this.redoStack.length <= 0) {
            return Promise.reject("No commands to redo.");
        }
        try {
            let command = this.redoStack.pop()
            command.execute();
            this.undoStack.push(command);
            this.invokeSubject.next();
        } catch(e) {
            Promise.reject(e);
        }
    }

    subscribe(observer) {
        return this.observableInvocation.subscribe(observer);
    }

    isUndoPossible() {
        return this.undoStack.length > 0;
    }

    isRedoPossible() {
        return this.redoStack.length > 0;
    }

}