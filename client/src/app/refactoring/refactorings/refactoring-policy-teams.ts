import { Graph } from "src/app/graph/model/graph";
import { Smell } from "../smells/smell";

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

export class SomeInteractionsFromTeamPolicy extends RefactoringTeamPolicy {

    constructor(
        private requiredInteractionsNumber: number,
        team: joint.shapes.microtosca.SquadGroup,
        private refactoringName: string,
        private graph: Graph,
        private smell: Smell,
        reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string
    ) {
        super(team);
        if(reason) {
            this.reason = () => reason(smell.getLinkBasedCauses());
        }
    }

    getRefactoringName(): string {
        return this.refactoringName;
    }

    check(): boolean {
        let sources = this.smell.getLinkBasedCauses()
                         .map((link) => (link.getSourceElement()))
                         .filter((e) => this.graph.isNode(e) && (this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> e) == this.team));
        return Array.from(new Set(sources)).length >= this.requiredInteractionsNumber;
    }

    reason(): string {
        let conflicts = this.smell.getLinkBasedCauses()
                                  .map((link) => (link.getSourceElement()))
                                  .filter((e) => this.graph.isNode(e))
                                  .map((n) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> n))
                                  .filter((t) => t != this.team);
        let conflictingTeamNames = Array.from(new Set(conflicts)).map((t) => t.getName());
        return `You don't own at least ${this.requiredInteractionsNumber} nodes needed to perform this refactoring. Please ask ${conflictingTeamNames.join(", ")}.`;
    }

}

export class AnyInteractionFromTeamPolicy extends SomeInteractionsFromTeamPolicy {

    constructor(team: joint.shapes.microtosca.SquadGroup, refactoringName: string, graph: Graph, smell: Smell, reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string) {
        super(1, team, refactoringName, graph, smell, reason);
    }

}

export class AnyTeamInternalInteractionPolicy extends RefactoringTeamPolicy {

    constructor(
        team: joint.shapes.microtosca.SquadGroup,
        private refactoringName: string,
        private graph: Graph,
        private smell: Smell,
        reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string
    ) {
        super(team);
        if(reason) {
            this.reason = () => reason(smell.getLinkBasedCauses());
        }
    }

    getRefactoringName(): string {
        return this.refactoringName;
    }

    check(): boolean {
        return this.smell.getLinkBasedCauses()
                         .map((link) => [link.getSourceElement(), link.getTargetElement()])
                         .filter(([s,t]) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> s) == this.team && this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> t) == this.team)
                         .length > 0;
    }

    reason(): string {
        let conflicts = this.smell.getLinkBasedCauses()
                                  .flatMap((link) => [this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()), this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement())])
                                  .filter(t => t != this.team);
        let conflictingTeamNames = Array.from(new Set(conflicts)).map((t) => t.getName());
        return `You can apply this refactoring among your team only. Please contact ${conflictingTeamNames.join(", ")}.`;
    }

}