import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GraphService } from '../model/graph.service';
import { GraphInvoker } from '../invoker/invoker';

@Component({
  selector: 'app-subtoolbar-navigation',
  templateUrl: './subtoolbar-navigation.component.html',
  styleUrls: ['./subtoolbar-navigation.component.css']
})
export class SubtoolbarNavigationComponent {

  layoutMenuItems: MenuItem[];

  constructor(private graphInvoker: GraphInvoker, private gs: GraphService) {}

  zoomIn() {
      this.graphInvoker.zoomIn();
  }

  zoomOut() {
    this.graphInvoker.zoomOut();
  }

  ngOnInit() {
    this.layoutMenuItems = [
        {
            label: 'Botton-to-top',
            command: () => {
                this.gs.getGraph().applyLayout("BT");
            }
        },
        {
            label: 'Top-to-bottom',
            command: () => {
                this.gs.getGraph().applyLayout("TB");
            }
        },
        {
            label: 'Left-to-right',
            command: () => {
                this.gs.getGraph().applyLayout("LR");
            }
        },
        {
            label: 'Right-to-left',
            command: () => {
                this.gs.getGraph().applyLayout("RL");
            }
        }
    ]
}

}
