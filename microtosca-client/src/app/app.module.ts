import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

// Import primeNG modules
import {AccordionModule} from 'primeng/accordion';
import {MessageService} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';

//import d3js component
import { D3Service, D3_DIRECTIVES} from './d3';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { GraphEditorComponent } from './graph-editor/graph-editor.component';
import { GraphNodeComponent } from './graph-node/graph-node.component';
import { GraphLinkComponent } from './graph-link/graph-link.component';
import { NodeListComponent } from './node-list/node-list.component';
import { AddNodeComponent } from './add-node/add-node.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ...D3_DIRECTIVES,
    MenuEditComponent,
    GraphEditorComponent,
    GraphNodeComponent,
    GraphLinkComponent,
    NodeListComponent,
    AddNodeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AccordionModule,
    DynamicDialogModule,
    DropdownModule,
    InputTextModule
    
  ],
  providers: [
    D3Service
    // MessageService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NodeListComponent,
    AddNodeComponent
  ]
})
export class AppModule { }
