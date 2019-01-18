import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../d3';

@Component({
  selector: '[linkVisual]',
  templateUrl: './graph-link.component.html',
  styleUrls: ['./graph-link.component.css']
})
export class GraphLinkComponent implements OnInit {

  @Input('linkVisual') link: Link;

  constructor() { }

  ngOnInit() {
    
  }

}
