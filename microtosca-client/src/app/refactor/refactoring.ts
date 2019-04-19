import { Command } from '../invoker/icommand';
import { AddMessageRouterCommand, AddMessageBrokerCommand, AddCircuitBreakerCommand, AddServiceDiscoveryCommand, UseTimeoutCommand, MergeServicesCommand } from "./refactoringCommand"

export class Refactoring {
    name: string
    refactoringCommand: Command

    constructor(name: string, command: Command) {
        console.log("Creagin ",name);
        this.name = name;
        this.refactoringCommand = command;
    }

    getName(){
        return this.name;
    }

    getCommand(){
        return this.refactoringCommand;
    }
}

export class AddMessageRouterRefactoring extends Refactoring {

    constructor(command: AddMessageRouterCommand) {
        super("Add Message Router", command)
    }
}

export class AddMessageBrokerRefactoring extends Refactoring {

    constructor(command: AddMessageBrokerCommand) {
        super("Add Message Broker", command)
    }

}

export class AddServiceDiscoveryRefactoring extends Refactoring {

    constructor(command: AddServiceDiscoveryCommand) {
        super("Add Service Discovery", command)
    }
}

export class AddCircuitBreakerRefactoring extends Refactoring {

    constructor(command: AddCircuitBreakerCommand) {

        super("Add Circui Breaker", command)
    }
}

export class UseTimeoutRefactoring extends Refactoring {

    constructor(command: UseTimeoutCommand) {
        super("Use timeout", command)
    }
}

export class MergeServicesRefactoring extends Refactoring {

    constructor(command: MergeServicesCommand) {
        super("Merge Services", command)
    }
}
