import {Component} from '@angular/core';
import {ForceDirectedGraph} from './d3'
import {GraphService} from "./graph.service";
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MicroTosca Analyser';

  display:boolean = false;

  constructor(private gs: GraphService, private messageService: MessageService) {  }

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
      this.gs.graph = ForceDirectedGraph.fromJSON(data);
      this.messageService.add({severity:'success', summary:'Graph dowloaded correclty', detail:''});
    });
  }
  
  closeSidebar(){
     this.display = false;
  }
}
