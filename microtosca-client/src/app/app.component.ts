import { Component, ViewChild, ElementRef } from '@angular/core';
import { D3Service} from './d3';
import {ForceDirectedGraph} from './d3'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ciao microtosca-client';

  constructor() {

  }
}
