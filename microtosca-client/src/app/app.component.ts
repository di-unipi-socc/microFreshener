import { Component } from '@angular/core';
import { GraphService } from "./graph.service";
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { DialogAnalysisComponent } from './dialog-analysis/dialog-analysis.component';
import { MenuItem } from 'primeng/api';
import { AnalyserService } from './analyser.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DialogService]
})
export class AppComponent {
  title = 'MicroTosca Analyser';

  display: boolean = false;

  items: MenuItem[];
  layouts:MenuItem[];
  examples:MenuItem[];


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
      {label: 'Hello world', command: () => {
        this.downloadExample("helloworld");
      }},
      {label: 'Extra', command: () => {
        this.downloadExample("extra");
      }},
      {label: 'Extra (agent)', command: () => {
        this.downloadExample("extra-agent");
      }},
      {label: 'Sockshop', command: () => {
        this.downloadExample("sockshop");
      }},
  ];
  }

  analyse() {
    const ref = this.dialogService.open(DialogAnalysisComponent, {
      header: 'Check the principles to analyse',
      width: '70%'
    });
    ref.onClose.subscribe((data) => {
      this._showSmells()
      this.messageService.add({ severity: 'success', summary: "Analysis performed correctly" , detail:data});
    });
  }

  _showSmells(){
    this.as.analysednodes.forEach((anode)=>{
        let n = this.gs.getGraph().getNode(anode.name);
        anode.getSmells().forEach((smell)=>{
          n.addSmell(smell);
        })
      })

      console.log(this.as.analysedgroups);

    this.as.analysedgroups.forEach((agroup)=>{
        let g = this.gs.getGraph().getGroup(agroup.name);
        agroup.getSmells().forEach((smell)=>{
          console.log(smell)
          smell.getNodeBasedCauses().forEach(node=>{
            node.addSmell(smell);
            console.log("ADDED SMELL TO NODE OF GROUP");
            console.log(smell);

          })
          g.addSmell(smell);
        })
      })    
  }

  upload() {
    this.gs.uploadGraph()
      .subscribe(data => {
        this.closeSidebar();
        this.messageService.add({ severity: 'success', summary: 'Saved correctly', detail: '' });
      });
  }

  onUpload(event) {
    console.log("upload handler");
    this.download();
    console.log("updated graph locally");
  }

  download() {
    this.gs.downloadGraph()
      .subscribe((data) => {
        this.closeSidebar();
        console.log(data);
        this.gs.getGraph().builtFromJSON(data);
        this.gs.getGraph().applyLayout("LR");
        this.messageService.add({ severity: 'success', summary: 'Graph dowloaded correclty', detail: '' });
      });
  }

  closeSidebar() {
    this.display = false;
  }

  downloadExample(name:string){
    this.gs.downloadExample(name)
    .subscribe((data) => {
      this.gs.getGraph().builtFromJSON(data);
      this.gs.getGraph().applyLayout("LR");
      this.messageService.add({severity:'success', summary:`Graph ${name} loaded`});
    });
  }

}
