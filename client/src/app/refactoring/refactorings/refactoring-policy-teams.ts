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

class SomeLinksFromTeamPolicy extends RefactoringTeamPolicy {

    constructor(
        private minimumRequiredInteractions: number,
        team: joint.shapes.microtosca.SquadGroup,
        private refactoringName: string,
        private graph: Graph,
        private smell: Smell,
        reason?: (links: joint.dia.Link[]) => string
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
        return Array.from(new Set(sources)).length >= this.minimumRequiredInteractions;
    }

    reason(): string {
        let conflicts = this.smell.getLinkBasedCauses()
                                  .map((link) => (link.getSourceElement()))
                                  .filter((e) => this.graph.isNode(e))
                                  .map((n) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> n))
                                  .filter((t) => t != this.team);
        let conflictingTeamNames = Array.from(new Set(conflicts)).map((t) => t ? t.getName() : "some nodes are owned by no team");
        return `You don't own at least ${this.minimumRequiredInteractions} nodes needed to perform this refactoring. Please ask ${conflictingTeamNames.join(", ")}.`;
    }

}

export class SomeInteractionsFromTeamPolicy extends SomeLinksFromTeamPolicy {
    constructor(
        minimumRequiredInteractions: number,
        team: joint.shapes.microtosca.SquadGroup,
        refactoringName: string,
        graph: Graph,
        smell: Smell,
        reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string
    ) {
        super(minimumRequiredInteractions, team, refactoringName, graph, smell, reason);
    }
}

export class AnyInteractionFromTeamPolicy extends SomeInteractionsFromTeamPolicy {
    constructor(team: joint.shapes.microtosca.SquadGroup, refactoringName: string, graph: Graph, smell: Smell, reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string) {
        super(1, team, refactoringName, graph, smell, reason);
    }
}

export class SomeDeploymentsFromTeamPolicy extends SomeLinksFromTeamPolicy {
    constructor(
        minimumRequiredInteractions: number,
        team: joint.shapes.microtosca.SquadGroup,
        refactoringName: string,
        graph: Graph,
        smell: Smell,
        reason?: (links: joint.shapes.microtosca.DeploymentTimeLink[]) => string
    ) {
        super(minimumRequiredInteractions, team, refactoringName, graph, smell, reason);
    }
}

export class AnyDeploymentFromTeamPolicy extends SomeDeploymentsFromTeamPolicy {
    constructor(team: joint.shapes.microtosca.SquadGroup, refactoringName: string, graph: Graph, smell: Smell, reason?: (links: joint.shapes.microtosca.DeploymentTimeLink[]) => string) {
        super(1, team, refactoringName, graph, smell, reason);
    }
}

export class SomeTeamInternalInteractionPolicy extends RefactoringTeamPolicy {

    constructor(
        private minimumRequiredInteractions: number,
        team: joint.shapes.microtosca.SquadGroup,
        private refactoringName: string,
        private graph: Graph,
        private smell: Smell,
        reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string
    ) {
        super(team);
        if(reason) {
            this.reason = () => reason(<joint.shapes.microtosca.RunTimeLink[]> smell.getLinkBasedCauses());
        }
    }

    getRefactoringName(): string {
        return this.refactoringName;
    }

    check(): boolean {
        return this.smell.getLinkBasedCauses()
                         .map((link) => [link.getSourceElement(), link.getTargetElement()])
                         .filter(([s,t]) => (this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> s) == this.team) && (this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> t) == this.team))
                         .length >= this.minimumRequiredInteractions;
    }

    reason(): string {
        let conflicts = this.smell.getLinkBasedCauses()
                                  .flatMap((link) => [this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()), this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement())])
                                  .filter(t => t != this.team);
        let conflictingTeamNames = Array.from(new Set(conflicts)).map((t) => t ? t.getName() : "some nodes are owned by no team");
        return `You can apply this refactoring among your team only. Please contact ${conflictingTeamNames.join(", ")}.`;
    }

}

export class AnyTeamInternalInteractionPolicy extends SomeTeamInternalInteractionPolicy {
    constructor(team: joint.shapes.microtosca.SquadGroup, refactoringName: string, graph: Graph, smell: Smell, reason?: (links: joint.shapes.microtosca.RunTimeLink[]) => string) {
        super(1, team, refactoringName, graph, smell, reason);
    }
}