import { Command } from "../icommand";

export interface Invoker {
    executeCommand(command: Command): void;
    undo(): void;
    redo(): void;
}
