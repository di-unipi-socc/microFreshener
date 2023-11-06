import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';

@Injectable({
  providedIn: 'root'
})
export class EditorNavigationService {

  private paper: joint.dia.Paper;

  private readonly FIT_CONTENT_PADDING = 150;

  constructor(
    private graphService: GraphService
  ) {}

  // Paper

  initPaper(element): joint.dia.Paper {
    this.paper = new joint.dia.Paper({
      el: element,
      model: this.graphService.getGraph(),
      preventContextMenu: true,
      width: '100%',
      height: '100%',
      background: { color: 'light' },
      multiLinks: true,
      clickThreshold: 1,
      // restrictTranslate: true,
      gridSize: 1,
      defaultLink: new joint.shapes.microtosca.RunTimeLink(),
      linkPinning: false, // do not allow link without a target node
      validateMagnet: function (cellView, magnet) {
          //return false;
          return magnet.getAttribute('magnet') !== 'false';
      },
      validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
          var sourceId = cellViewS.model.id;
          var targetId = cellViewT.model.id;
          if (sourceId && targetId && sourceId === targetId) // avoid self loop
              return false;
          else
              return true;
          // return sourceId === targetId;
          // return (end === 'target' ? cellViewT : cellViewS) instanceof joint.dia.ElementView;
      },
    });
    return this.paper;
  }

  getPaper() {
    return this.paper;
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
    let canvas = document.getElementsByTagName('app-graph-editor')[0];
    let offsetX = canvas.clientWidth/2;
    let offsetY = canvas.clientHeight/2;
    let origin = this.paper.options.origin;
    let sf = this.paper.scale().sx;
    let x = (offsetX-origin.x)/sf;
    let y = (offsetY-origin.y)/sf;
    this.zoom(x, y, offsetX, offsetY, 1);
  }

  zoomOut() {
    let canvas = document.getElementsByTagName('app-graph-editor')[0];
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
    this.paper.scaleContentToFit({ padding: padding });
  }

}