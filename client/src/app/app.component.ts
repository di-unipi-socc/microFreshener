import { Component } from '@angular/core';
import { GraphService } from "./graph.service";
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { DialogAnalysisComponent } from './dialog-analysis/dialog-analysis.component';
import { MenuItem } from 'primeng/api';
import { AnalyserService } from './analyser.service';
import { environment } from '../environments/environment';
import { DialogSelectTeamComponent } from './dialog-select-team/dialog-select-team.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DialogService]
})
export class AppComponent {
  title = 'microFreshener';

  display: boolean = false;

  items: MenuItem[];
  layouts: MenuItem[];
  examples: MenuItem[];

  hrefDownload = environment.serverUrl + '/api/export';

  constructor(private gs: GraphService, private as: AnalyserService, private messageService: MessageService, public dialogService: DialogService) {
    this.items = [
      {
        label: 'Account',
        icon: 'pi pi-fw pi-user',
        items: [
          { label: 'Detail', icon: "pi pi-user" },
          { label: 'Log out', icon: 'pi pi-sign-out' },
        ]
      }
    ];

    this.layouts = [
      // "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left))
      {
        label: 'Botton-to-top', command: () => {
          this.gs.getGraph().applyLayout("BT");
        }
      },
      {
        label: 'Top-to-bottom', command: () => {
          this.gs.getGraph().applyLayout("TB");
        }
      },
      {
        label: 'Left-to-right', command: () => {
          this.gs.getGraph().applyLayout("LR");
        }
      },
      {
        label: 'Right-to-left', command: () => {
          this.gs.getGraph().applyLayout("RL");
        }
      },
    ];

    this.examples = [
      {
        label: 'Hello world', command: () => {
          this.downloadExample("helloworld");
        }
      },
      {
        label: 'Case study', command: () => {
          this.downloadExample("case-study-initial");
        }
      },
      {
        label: 'Case study (refactored)', command: () => {
          this.downloadExample("case-study-refactored");
        }
      },
      {
        label: 'Sockshop', command: () => {
          this.downloadExample("sockshop");
        }
      },
      {
        label: 'FTGO', command: () => {
          this.downloadExample("ftgo");
        }
      },
    ];
  }


  selectTeam() {
    const ref = this.dialogService.open(DialogSelectTeamComponent, {
      header: 'Select Team to visualize',
      width: '80%',
      // height: '50%'
    });
    ref.onClose.subscribe((data) => {
      if (data.show == "team") {
        var team = data.team;
        // this.gs.getGraph().getFrontierOfATeam(team);
        // team.getFrontier();
        this.gs.getGraph().showOnlyTeam(team);
        this.messageService.add({ severity: 'success', summary: ` ${team.getName()} visualized` });
      }
      else if (data.show == "all"){
        this.gs.getGraph().showGraph();
        this.messageService.add({ severity: 'success', summary: ` All graph visualized` });

      }
      else {
        this.messageService.add({ severity: 'error', summary: `No team selected` });

      }
    });

  }
  analyse() {
    const ref = this.dialogService.open(DialogAnalysisComponent, {
      header: 'Check the principles to analyse',
      width: '70%'
    });
    ref.onClose.subscribe((data) => {
      this._showSmells()
      this.messageService.add({ severity: 'success', summary: "Analysis performed correctly", detail: data });
    });
  }

  _showSmells() {
    this.as.analysednodes.forEach((anode) => {
      let n = this.gs.getGraph().getNode(anode.name);
      anode.getSmells().forEach((smell) => {
        n.addSmell(smell);
      })
    })

    this.as.analysedgroups.forEach((agroup) => {
      let g = this.gs.getGraph().getGroup(agroup.name);
      agroup.getSmells().forEach((smell) => {
        // in EdgeGroup the NoApiGateway smell is inseted in the node of the group
        smell.getNodeBasedCauses().forEach(node => {
          node.addSmell(smell);
        })
        g.addSmell(smell);
      })
    })
  }

  save() {
    this.gs.uploadGraph()
      .subscribe(json_model => {
        this.messageService.add({ severity: 'success', summary: json_model['name'] + " saved correclty", detail: '' });
      });
  }


  onUpload(event) {
    console.log(event.files);
     this.download();
  }

  download() {
    this.gs.dowloadGraph()
      .subscribe((data) => {
        this.closeSidebar();
        console.log(data);
        this.gs.getGraph().builtFromJSON(data);
        this.gs.getGraph().applyLayout("LR");
        this.messageService.add({ severity: 'success', summary: 'Graph downloaded correctly', detail: '' });
      });
  }

  closeSidebar() {
    this.display = false;
  }

  downloadExample(name: string) {
    this.gs.downloadExample(name)
      .subscribe((data) => {
        this.gs.getGraph().builtFromJSON(data);
        this.gs.getGraph().applyLayout("LR");
        this.messageService.add({ severity: 'success', summary: `Graph ${name} loaded` });
      });
  }

}
