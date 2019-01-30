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

  }

  ngOnInit() {
    //this.palette.div = this.paletteRef.nativeElement;
    //console.log("initialized menu bar");
  }

}
