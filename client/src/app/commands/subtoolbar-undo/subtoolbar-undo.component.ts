import { Component } from '@angular/core';
import { CommandInvoker } from '../invoker/invoker';

@Component({
  selector: 'app-subtoolbar-undo',
  templateUrl: './subtoolbar-undo.component.html',
  styleUrls: ['./subtoolbar-undo.component.css']
})
export class SubtoolbarUndoComponent {

  constructor(private graphInvoker: CommandInvoker) {}

  undo() {
    this.graphInvoker.undo();
  }

  redo() {
    this.graphInvoker.redo();
  }

}
