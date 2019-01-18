import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private palette: go.Palette = new go.Palette();


  @ViewChild('paletteEdit')
  private paletteRef: ElementRef;

  constructor() {
    const $ = go.GraphObject.make;
    this.palette = new go.Palette();

    this.palette.nodeTemplate =
      $(go.Node, "Horizontal",
        $(go.Shape,
          { width: 14, height: 14, fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text", "color"))
    );

    // the list of data to show in the Palette
    this.palette.model.nodeDataArray = [
      { key: "C", color: "cyan" },
      { key: "LC", color: "lightcyan" },
      { key: "A", color: "aquamarine" },
      { key: "T", color: "turquoise" },
      { key: "PB", color: "powderblue" },
      { key: "LB", color: "lightblue" },
      { key: "LSB", color: "lightskyblue" },
      { key: "DSB", color: "deepskyblue" }
    ];
  }

  ngOnInit() {
    //this.palette.div = this.paletteRef.nativeElement;
    //console.log("initialized menu bar");
  }

}
