import { Component } from '@angular/core';
import { Invoker } from '../invoker';

@Component({
  selector: 'app-subtoolbar-undo',
  templateUrl: './subtoolbar-undo.component.html',
  styleUrls: ['./subtoolbar-undo.component.css']
})
export class SubtoolbarUndoComponent {

  canUndo: boolean;
  canRedo: boolean;

  constructor(public graphInvoker: Invoker) {
    this.canUndo = false;
    this.canRedo = false;
    graphInvoker.subscribe(() => {
      this.canUndo = graphInvoker.isUndoPossible();
      this.canRedo = graphInvoker.isRedoPossible();
    });
  }

  undo() {
    this.graphInvoker.undo();
  }

  redo() {
    this.graphInvoker.redo();
  }

}
