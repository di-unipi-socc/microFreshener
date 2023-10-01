import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorNavigationService {

  private paper: joint.dia.Paper;

  private readonly FIT_CONTENT_PADDING = 150;

  constructor() { }

  // Paper

  setPaper(paper: joint.dia.Paper) {
    this.paper = paper;
  }

  // Move
  mousewheel
  move(dx: number, dy: number) {
    this.paper.translate(dx, dy);
  }

  // Zoom

  zoom(x, y, offsetX, offsetY, delta) {
    let oldscale = this.paper.scale().sx;
    let newscale = oldscale + 0.2 * delta * oldscale
    let minscale = 0.2;
    let maxscale = 5;

    if (newscale > minscale && newscale < maxscale) {
      this.paper.scale(newscale, newscale, 0, 0);
      this.paper.translate(-x*newscale+offsetX, -y*newscale+offsetY);
    }
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

  fitContent(padding?: number) {
    if(!padding){
      padding = this.FIT_CONTENT_PADDING;
    }
    this.paper.scaleContentToFit({padding: padding});
  }

}