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
    console.error("The zoomIn has to be set by the owner of the Paper object.");
  }

  zoomOut() {
    console.error("The zoomOut has to be set by the owner of the Paper object.");
  }

}
