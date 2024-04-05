export interface Command {
    execute: () => void
    unexecute: () => void
}

export class CompositeCommand implements Command {

    private constructor(private commands: Command[]) {}

    execute() {
        this.commands.forEach(command => command.execute());
    }

    unexecute() {
        this.commands.slice().reverse().forEach(command => command.unexecute());
    }

    static of(commands: Command[]): CompositeCommand {
        return new CompositeCommand(commands);
    }

}

export class Sequentiable<T extends Command> implements Command {

    protected constructor(private command?: T) {}

    execute() {
        this.command.execute();
    }
    
    unexecute() {
        this.command.unexecute();
    }

    static of<T extends Command>(command: T): Sequentiable<T> {
        if(command instanceof Sequentiable)
            return new Sequentiable<T>(command.command);
        return new Sequentiable<T>(command);
    }

    then<C extends Command>(next: (C | Sequentiable<C>)): Sequentiable<C> {
        let action = () => {this.execute()};
        let revert = () => {this.unexecute()};

        let newCommand;
        if(next instanceof Sequentiable) {
            newCommand = next;
        } else {
            newCommand = Sequentiable.of(next);
        }
        
        return new class extends Sequentiable<C> {
            execute(): void {
                action();
                newCommand.execute();
            }

            unexecute(): void {
                newCommand.unexecute();
                revert();
            }
        };
    };
}

export abstract class ElementCommand<T extends joint.shapes.microtosca.Root> implements Command {
    
    abstract execute();
    abstract unexecute();

    protected element: T;

    set(element: T) {
        this.element = element;
    }

    get(): T {
        return this.element;
    }

    constructor(element?: T) {
        this.element = element;
    }

    bind<U extends joint.shapes.microtosca.Root>(next: ElementCommand<U>): ElementCommand<U> {
        let action = () => {this.execute()};
        let revert = () => {this.unexecute()};
        let get = (): T => {return this.get()};
        return new class extends ElementCommand<U> {

            constructor() {
                super(<U> <unknown>get());
            }

            execute(): void {
                action();
                next.set(<U> <unknown>get());
                next.execute();
            }

            unexecute(): void {
                next.unexecute();
                revert();
            }
        };
    }
}