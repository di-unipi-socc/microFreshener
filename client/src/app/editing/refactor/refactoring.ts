import { Command } from '../invoker/icommand';
import { IgnoreOnceCommand, AddMessageRouterCommand, AddMessageBrokerCommand, AddCircuitBreakerCommand, AddServiceDiscoveryCommand, UseTimeoutCommand, MergeServicesCommand, SplitDatastoreCommand, AddDataManagerCommand, IgnoreAlwaysCommand, AddApiGatewayCommand, MoveDatastoreIntoTeamCommand, AddDataManagerIntoTeamCommand, MoveServiceIntoTeamCommand } from "./refactoring-command"

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

export class SplitDatastoreRefactoring extends Refactoring {

    constructor(command: SplitDatastoreCommand) {
        super("Split Datastore", command)
    }
}

export class AddDataManagerRefactoring extends Refactoring {

    constructor(command: AddDataManagerCommand) {
        super("Add Datastore Manager", command)
    }
}


export class MoveDatastoreIntoTeamRefactoring extends Refactoring{
    constructor(command: MoveDatastoreIntoTeamCommand) {
        super("Move Datastore", command)
    }
}


export class MoveserviceIntoTeamRefactoring extends Refactoring{
    constructor(command: MoveServiceIntoTeamCommand) {
        super("Move Service", command)
    }
}

export class AddDataManagerIntoTeamRefactoring  extends Refactoring{
    constructor(command: AddDataManagerIntoTeamCommand) {
        super("Add data Manager", command)
    }
}