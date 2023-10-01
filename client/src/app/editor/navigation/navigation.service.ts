import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  paper: joint.dia.Paper;

  constructor() { }

  // Navigation

  getPaper() {
    return this.paper;
  }

  setPaper(paper: joint.dia.Paper) {
    this.paper = paper;
  }

  fitContent(padding?: number) {
    if(!padding){
      padding = 150;
    }
    this.paper.scaleContentToFit({padding: padding});
  }

  zoomIn() {
    let canvas = document.getElementById('jointjsgraph');
    let offsetX = canvas.clientWidth/2;
    let offsetY = canvas.clientHeight/2;
    let origin = this.paper.options.origin;
    let sf = this.paper.scale().sx;
    let x = (offsetX-origin.x)/sf;
    let y = (offsetY-origin.y)/sf;
    this.zoom(x, y, offsetX, offsetY, 1);
  }

  zoomOut() {
    let canvas = document.getElementById('jointjsgraph');
    let offsetX = canvas.clientWidth/2;
    let offsetY = canvas.clientHeight/2;
    let origin = this.paper.options.origin;
    let sf = this.paper.scale().sx;
    let x = (offsetX-origin.x)/sf;
    let y = (offsetY-origin.y)/sf;
    this.zoom(x, y, offsetX, offsetY, -1);
  }

  zoom(x, y, offsetX, offsetY, delta) {
    //console.log("zooming with: x%d,y%d,ox%d,oy%d", x, y, offsetX, offsetY);
    let oldscale = this.paper.scale().sx;
    let newscale = oldscale + 0.2 * delta * oldscale
    let minscale = 0.2;
    let maxscale = 5;

    if (newscale > minscale && newscale < maxscale) {
      this.paper.scale(newscale, newscale, 0, 0);
      this.paper.translate(-x*newscale+offsetX, -y*newscale+offsetY);
    }
}

}
