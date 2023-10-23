export interface Command {
    execute: () => void
    unexecute: () => void
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
        return new Sequentiable<T>(command);
    }

    then<U extends Command>(next: U): Sequentiable<U> {
        let action = () => {this.execute()};
        let revert = () => {this.unexecute()};

        let newCommand = Sequentiable.of(next);

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