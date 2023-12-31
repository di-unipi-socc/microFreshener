import { Refactoring } from "./refactoring-command";

export interface RefactoringPolicy {
    isAllowed(): boolean;
    whyNotAllowed(): string;
    getRefactoringName(): string;
}

export class NeverAllowedRefactoringPolicy implements RefactoringPolicy {

    constructor(private refactoringName: string, private reason: string) {}

    isAllowed(): boolean {
        return false;
    }
    whyNotAllowed(): string {
        return this.reason;
    }
    getRefactoringName(): string {
        return this.refactoringName;
    }
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

export class AlwaysAllowedRefactoringPolicy implements RefactoringPolicy {

    constructor(private refactoringName?: string) {}

    isAllowed(): boolean {
        return true;
    }
    whyNotAllowed(): string {
        throw new Error("This refactoring is always allowed.");
    }
    getRefactoringName(): string {
        if(this.refactoringName)
            return this.refactoringName;
        else
            throw Error("Undefined name");
    }
}