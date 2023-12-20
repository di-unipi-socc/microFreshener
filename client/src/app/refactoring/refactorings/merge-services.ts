import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { MergeServicesCommand } from "src/app/architecture/node-commands";
import { RefactoringPolicy } from "./refactoring-policy";

export class MergeServicesRefactoring implements Refactoring {

    command: MergeServicesCommand;

    constructor(graph: Graph, smell: SmellObject) {
        // Add the new merged service and link it to the datastore
        let databaseUsers = smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
        let position = graph.getPointCloseTo(smell.getLinkBasedCauses()[0].getTargetElement());
        this.command = new MergeServicesCommand(graph, position, ...databaseUsers);
    }

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

}

export class MergeServicesPolicy implements RefactoringPolicy {

    private canRefactoringBePerformed: boolean;

    constructor(private graph: Graph, private smell: SmellObject, private team: joint.shapes.microtosca.SquadGroup) {
        let databaseUsers = smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
        this.canRefactoringBePerformed = databaseUsers.every((node) => this.graph.getTeamOfNode(node) == team);
    }

    isAllowed(): boolean {
        return this.canRefactoringBePerformed
    }

    whyNotAllowed(): string {
        let databaseUsers = this.smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
        let conflicts = databaseUsers.map((node) => this.graph.getTeamOfNode(node)).filter((team) => team != this.team);
        return `You don't have all the required permissions to perform this refactoring. Please ask ${conflicts.map((c) => c.getName()).join(", ")}.`;
    }

}