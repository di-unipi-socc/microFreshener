import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule }    from '@angular/common/http';

//import my component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

// Import primeNG modules
import {AccordionModule} from 'primeng/accordion';
import {MessageService} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {ListboxModule} from 'primeng/listbox';
import {CheckboxModule} from 'primeng/checkbox';

//import d3js component
import { D3Service, D3_DIRECTIVES} from './d3';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { GraphEditorComponent } from './graph-editor/graph-editor.component';
import { GraphNodeComponent } from './graph-node/graph-node.component';
import { GraphLinkComponent } from './graph-link/graph-link.component';
import { AddLinkComponent } from './add-link/add-link.component';
import { AddNodeComponent } from './add-node/add-node.component';
import { ModalRefactoringsComponent } from './modal-refactorings/modal-refactorings.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ...D3_DIRECTIVES,
    MenuEditComponent,
    GraphEditorComponent,
    GraphNodeComponent,
    GraphLinkComponent,
    AddLinkComponent,
    AddNodeComponent,
    ModalRefactoringsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    AccordionModule,
    DynamicDialogModule,
    DropdownModule,
    InputTextModule,
    SidebarModule,
    ButtonModule,
    HttpClientModule,
    ListboxModule,
    CheckboxModule,
    DialogModule
  ],
  providers: [
    D3Service
    // MessageService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddLinkComponent,
    AddNodeComponent
  ]
})
export class AppModule { }
