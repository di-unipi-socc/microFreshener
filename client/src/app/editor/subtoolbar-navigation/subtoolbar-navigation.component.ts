import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GraphService } from '../../graph/graph.service';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-subtoolbar-navigation',
  templateUrl: './subtoolbar-navigation.component.html',
  styleUrls: ['./subtoolbar-navigation.component.css']
})
export class SubtoolbarNavigationComponent {

  layoutMenuItems: MenuItem[];

  constructor(private gs: GraphService, private navigation: NavigationService) {}

  zoomIn() {
      this.navigation.zoomIn();
  }

  zoomOut() {
    this.navigation.zoomOut();
  }

  zoomReset() {
    this.navigation.fitContent();
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
