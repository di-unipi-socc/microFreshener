import { Graph } from "src/app/graph/model/graph";
import { Command } from "../../commands/icommand";
import { SmellObject } from "../smells/smell";

export interface Refactoring extends Command {
    getName(): string;
    getDescription(): string;
}

export abstract class GroupRefactoring implements Refactoring {

    abstract getName(): string;
    abstract getDescription(): string;
    abstract execute(): void;
    abstract unexecute(): void;

    private memberRefactorings: Map<joint.shapes.microtosca.Node, Refactoring[]>;

    constructor() {
        this.memberRefactorings = new Map<joint.shapes.microtosca.Node, Refactoring[]>();
    }

    addMemberRefactoring(member: joint.shapes.microtosca.Node, command: Command, name: string, description: string) {
        if(!this.memberRefactorings.has(member)) {
            this.memberRefactorings.set(member, []);
        }
        this.memberRefactorings.get(member).push(new class implements Refactoring {
            getName(): string {
                return name;
            }
            getDescription(): string {
                return description;
            }
            execute() {
                command.execute();
            }
            unexecute() {
                command.unexecute();
            };
        });
    }

    getMemberRefactorings(): Map<joint.shapes.microtosca.Node, Refactoring[]> {
        return this.memberRefactorings;
    }
}

export abstract class RefactoringBuilder {
    protected graph: Graph;
    protected smell: SmellObject;
    protected team: joint.shapes.microtosca.SquadGroup;

    setGraph(graph: Graph) {
        this.graph = graph;
        return this;
    }

    setSmell(smell: SmellObject) {
        this.smell = smell;
        return this;
    }

    setTeam(team: joint.shapes.microtosca.SquadGroup) {
        this.team = team;
        return this;
    }

    abstract build(): Refactoring;
}