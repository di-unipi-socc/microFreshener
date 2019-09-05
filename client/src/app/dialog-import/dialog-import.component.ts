import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { GraphService } from '../graph.service';


@Component({
  selector: 'app-dialog-import',
  templateUrl: './dialog-import.component.html',
  styleUrls: ['./dialog-import.component.css']
})
export class DialogImportComponent implements OnInit {

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    

  }

  save() {
    this.ref.close();
  }

}
