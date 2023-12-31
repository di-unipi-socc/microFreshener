import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EditorNavigationService } from '../navigation.service';

@Component({
  selector: 'app-subtoolbar-navigation',
  templateUrl: './subtoolbar-navigation.component.html',
  styleUrls: ['./subtoolbar-navigation.component.css']
})
export class SubtoolbarNavigationComponent {

  layoutMenuItems: MenuItem[];

  constructor(private navigation: EditorNavigationService) {}

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
                this.navigation.applyLayout("BT");
            }
        },
        {
            label: 'Top-to-bottom',
            command: () => {
                this.navigation.applyLayout("TB");
            }
        },
        {
            label: 'Left-to-right',
            command: () => {
                this.navigation.applyLayout("LR");
            }
        },
        {
            label: 'Right-to-left',
            command: () => {
                this.navigation.applyLayout("RL");
            }
        }
    ]
}

}
