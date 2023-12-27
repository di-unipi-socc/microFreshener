import { Refactoring } from "./refactoring-command";

export interface RefactoringPolicy {
    isAllowed(): boolean;
    whyNotAllowed(): string;
    getRefactoringName(): string;
}

export class NotAllowedRefactoring implements Refactoring {

    constructor(private policy: RefactoringPolicy) {
        if(policy.isAllowed()) {
            throw new Error("This refactoring shouldn't be created.");
        }
    }

    execute(): void {
        throw new Error("This refactoring shouldn't be executed.");
    }

    unexecute(): void {
        throw new Error("This refactoring shouldn't be executed.");
    }

    getName(): string {
        return this.policy.getRefactoringName();
    }

    getDescription(): string {
        return this.policy.whyNotAllowed();
    }

}