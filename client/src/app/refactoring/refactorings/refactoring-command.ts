import { Graph } from "src/app/graph/model/graph";
import { Command } from "../../commands/icommand";
import { Smell } from "../smells/smell";

export interface Refactoring extends Command {
    getName(): string;
    getDescription(): string;
}

export abstract class GroupRefactoring implements Refactoring {

    abstract getName(): string;
    abstract getDescription(): string;
    abstract execute(): void;
    abstract unexecute(): void;

}

export abstract class RefactoringBuilder {
    protected graph: Graph;
    protected smell: Smell;
    protected team: joint.shapes.microtosca.SquadGroup;
    protected node: joint.shapes.microtosca.Node;

    setGraph(graph: Graph) {
        this.graph = graph;
        return this;
    }

    setSmell(smell: Smell) {
        this.smell = smell;
        return this;
    }

    setTeam(team: joint.shapes.microtosca.SquadGroup) {
        this.team = team;
        return this;
    }

    setNode(node: joint.shapes.microtosca.Node) {
        this.node = node;
        return this;
    }

    abstract build(): Refactoring;
}