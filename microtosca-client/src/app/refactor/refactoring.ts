import { Command } from '../invoker/icommand';
import { IgnoreOnceCommand, AddMessageRouterCommand, AddMessageBrokerCommand, AddCircuitBreakerCommand, AddServiceDiscoveryCommand, UseTimeoutCommand, MergeServicesCommand, SplitDatabaseCommand, AddDataManagerCommand, IgnoreAlwaysCommand, AddApiGatewayCommand, MoveDatabaseIntoTeamCommand } from "./refactoring-command"

export class Refactoring {
    name: string
    description: String
    refactoringCommand: Command

    constructor(name: string, command: Command) {
        this.name = name;
        this.refactoringCommand = command;
    }

    getDescription() {
        return "ciao ciao a tutti";
    }

    getName() {
        return this.name;
    }

    getCommand() {
        return this.refactoringCommand;
    }
}

export class IgnoreOnceRefactoring extends Refactoring {
    constructor(command: IgnoreOnceCommand) {
        super("Ignore Once", command)
    }
}

export class IgnoreAlwaysRefactoring extends Refactoring {
    constructor(command: IgnoreAlwaysCommand) {
        super("Ignore Always", command)
    }
}

export class AddMessageRouterRefactoring extends Refactoring {

    constructor(command: AddMessageRouterCommand) {
        super("Add Message Router", command)
    }
}

export class AddApiGatewayRefactoring extends Refactoring {

    constructor(command: AddApiGatewayCommand) {
        super("Add Api Gateway", command)
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

export class SplitDatabaseRefactoring extends Refactoring {

    constructor(command: SplitDatabaseCommand) {
        super("Split Database", command)
    }
}

export class AddDataManagerRefactoring extends Refactoring {

    constructor(command: AddDataManagerCommand) {
        super("Add Database Manager", command)
    }
}


export class MoveDatabaseIntoTeamRefactoring extends Refactoring{
    constructor(command: MoveDatabaseIntoTeamCommand) {
        super("Move Database", command)
    }
}