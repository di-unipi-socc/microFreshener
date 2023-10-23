export interface Command {
    execute: () => void
    unexecute: () => void
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

    constructor(node?: T) {
        this.element = node;
    }

    then<U extends Command>(next: U): Sequentiable<U> {
        let action = () => {this.execute()};
        let revert = () => {this.unexecute()};
        let getNode = () => { return this.get() };

        let newCommand = Sequentiable.of(next);

        newCommand.execute = () => {
            action();
            let element = getNode();
            if(next instanceof ElementCommand)
                next.set(element);
            next.execute();
        }
        newCommand.unexecute = () => {
            next.unexecute();
            revert();
        }
        return newCommand;
    };

}

export class Sequentiable<T extends Command> implements Command {

    private constructor(private command: T) {}

    execute() {
        console.debug("executing", this.command);
        this.command.execute();
    }
    
    unexecute() {
        console.debug("unexecuting", this.command);
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
        if(next instanceof Sequentiable)
            newCommand = next;
        else
            newCommand = Sequentiable.of(next);

        newCommand.execute = () => {
            action();
            next.execute();
        }
        newCommand.unexecute = () => {
            next.unexecute();
            revert();
        }
        
        return newCommand;
    };
}