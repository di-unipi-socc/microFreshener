import {Component} from '@angular/core';
import {GraphService} from "./graph.service";
import {MessageService} from 'primeng/api';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MicroTosca Analyser';

  display:boolean = false;

  items: MenuItem[];

  constructor(private gs: GraphService, private messageService: MessageService) { 
    this.items = [
      {
          label: 'File',
          icon: 'pi pi-fw pi-pencil',
          items: [
              {label: 'Save', icon:"pi pi-save", command: (event) => {
                  this.upload();
              }},
              {label: 'Export', icon: 'pi pi-download', url: "http://127.0.0.1:8000/v2/graph/export/"},
              {label: 'Import', icon: 'pi pi-upload', command:(event) =>{
                // <p-fileUpload mode="basic" 
                //                     name="graph" 
                //                     url="http://127.0.0.1:8000/v2/graph/import/" 
                //                     accept=".json"
                //                     (onUpload)="onUpload($event)"
                //                     chooseLabel="Import">
                //     </p-fileUpload>
              }}
            
          ]
      },
      {
        label: 'Account',
        icon: 'pi pi-fw pi-user',
        items: [
            {label: 'Detail', icon:"pi pi-user"},
            {label: 'Log out', icon: 'pi pi-sign-out'},
        ]
      }
  ];
   }

  upload(){
    this.gs.uploadGraph()
      .subscribe(data => {
        this.closeSidebar();
        console.log(data);
        this.messageService.add({severity:'success', summary:'Saved correctly', detail:''});
      });
  }

  onUpload(event) {
    console.log("upload handler");
    this.download();
    console.log("updated graph locally");
  }

  download(){
    this.gs.downloadGraph()
    .subscribe((data) => {
      this.closeSidebar();
      console.log(data);
      this.gs.getGraph().builtFromJSON(data);
      this.gs.getGraph().applyLayout("LR");
      this.messageService.add({severity:'success', summary:'Graph dowloaded correclty', detail:''});
    });
  }
  
  closeSidebar(){
     this.display = false;
  }
}
