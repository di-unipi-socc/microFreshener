import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { environment } from '../../environments/environment';
import { GraphService } from "../graph.service";
@Component({
  selector: 'app-dialog-import',
  templateUrl: './dialog-import.component.html',
  styleUrls: ['./dialog-import.component.css']
})
export class DialogImportComponent implements OnInit {

  urlUpload: string;

  constructor(private gs: GraphService, public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.urlUpload = environment.serverUrl + '/api/import';
  }


  onUpload(event) {
    var name = "";
    event.files.forEach(element => {
      name += ` ${element.name}`;
    });

    this.gs.dowloadGraph()
      .subscribe((data) => {
        console.log(data);
        this.gs.getGraph().builtFromJSON(data);
        this.gs.getGraph().applyLayout("LR");
        this.ref.close({ "msg": `${name} file uploaded correctly` });
      });
  }

}
