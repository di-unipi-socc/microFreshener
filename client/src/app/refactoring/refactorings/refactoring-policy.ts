import { Refactoring } from "./refactoring-command";

export interface RefactoringPolicy {
    isAllowed(): boolean;
    whyNotAllowed(): string;
    getRefactoringName(): string;
}

export abstract class RefactoringTeamPolicy {

    private canRefactoringBePerformed = undefined;

    constructor(protected team: joint.shapes.microtosca.SquadGroup) {}

    abstract check(): boolean;
    abstract reason(): string;

    isAllowed() {
        if(this.canRefactoringBePerformed == undefined) {
            this.canRefactoringBePerformed = this.check();
        }
        return this.canRefactoringBePerformed;
    }

    whyNotAllowed() {
        if(this.canRefactoringBePerformed !== undefined && !this.canRefactoringBePerformed)
            return this.reason();
    }

    abstract getRefactoringName(): string;

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