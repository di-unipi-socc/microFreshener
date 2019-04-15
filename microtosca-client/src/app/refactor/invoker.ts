import {IRefactoring} from "./irefactoring";

export class RefactoringsInvoker{
    undoStack: IRefactoring[];
    redoStack: IRefactoring[];


    constructor(){
        this.undoStack = [];
        this.redoStack = [];
    }

    executeRefactoring(refactoring: IRefactoring){
        refactoring.execute();
        this.undoStack.push(refactoring);
    }

    undo(){
        console.log("start undo");
        console.log(this.undoStack);
        if( this.undoStack.length <= 0){
            return
        }
        console.log("undoind an operation");
        let refactoring = this.undoStack.pop()
        refactoring.unexecute();
        this.redoStack.push(refactoring);
    }

    redo(){
        if( this.redoStack.length <= 0){
            return
        }

        let refactoring = this.redoStack.pop()
        refactoring.execute();
        this.undoStack.push(refactoring);
    }
  
}