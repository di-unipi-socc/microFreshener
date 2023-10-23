
export interface Command {
    execute: () => void
    unexecute: () => void
}

export abstract class SequentiableCommand implements Command {

    abstract execute();
    abstract unexecute();

    then(next: Command): Command {
        let action = () => {this.execute()};
        let revert = () => {this.unexecute()};
        return new class implements Command {
            execute() {
                action();
                next.execute();
            }
            unexecute() {
                next.unexecute();
                revert();
            }
        };
    }
}