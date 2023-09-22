import { Component } from '@angular/core';
import { GraphInvoker } from '../invoker/invoker';

@Component({
  selector: 'app-toolbar-items-undo',
  templateUrl: './toolbar-items-undo.component.html',
  styleUrls: ['./toolbar-items-undo.component.css']
})
export class ToolbarItemsUndoComponent {

  constructor(private graphInvoker: GraphInvoker) {}

  undo() {
    this.graphInvoker.undo();
  }

  redo() {
    this.graphInvoker.redo();
  }

}
