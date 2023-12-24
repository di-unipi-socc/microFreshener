import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { MergeServicesCommand } from "src/app/architecture/node-commands";
import { RefactoringPolicy } from "./refactoring-policy";


export class MergeServicesTeamPolicy implements RefactoringPolicy {

    private canRefactoringBePerformed: boolean;

    constructor(private graph: Graph, private smell: SmellObject, private team: joint.shapes.microtosca.SquadGroup) {
        let databaseUsers = smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
        this.canRefactoringBePerformed = databaseUsers.filter((node) => this.graph.getTeamOfNode(node) == team).length > 1;
    }

    isAllowed(): boolean {
        return this.canRefactoringBePerformed
    }

    whyNotAllowed(): string {
        if(!this.canRefactoringBePerformed) {
            let databaseUsers = this.smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
            let conflicts = databaseUsers.map((node) => this.graph.getTeamOfNode(node)).filter((team) => team != this.team);
            return `You don't have all the required permissions to perform this refactoring. Please ask ${conflicts.map((c) => c.getName()).join(", ")}.`;
        }
    }

}

export class MergeServicesRefactoring implements Refactoring {

    command: MergeServicesCommand;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Merge services";
    }

    getDescription() {
        return "Merge the services accessing the same datastore.";
    }

    static builder() {
        return new class Builder {

            private graph: Graph;
            private smell: SmellObject;
            private team: joint.shapes.microtosca.SquadGroup;
            
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

            build(): MergeServicesRefactoring {
                // Add the new merged service and link it to the datastore
                let databaseUsers = this.smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
                if(this.team)
                    databaseUsers = databaseUsers.filter((node) => this.graph.getTeamOfNode(node) == this.team);
                let position = this.graph.getPointCloseTo(this.smell.getLinkBasedCauses()[0].getTargetElement());
                let command = new MergeServicesCommand(this.graph, position, ...databaseUsers);
                let refactoring = new MergeServicesRefactoring();
                refactoring.command = command;
                return refactoring;
            }

        }
    }
}