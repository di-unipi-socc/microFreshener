import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

//import my component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphEditorComponent } from './graph-editor/graph-editor.component';
import { ModalRefactoringsComponent } from './modal-refactorings/modal-refactorings.component';
import { DialogAnalysisComponent } from './dialog-analysis/dialog-analysis.component';
import { DialogSmellComponent } from './dialog-smell/dialog-smell.component';
import { DialogAddNodeComponent } from './dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from './dialog-add-team/dialog-add-team.component';
import { AppMenuComponent } from './app-menu/app-menu.component';

// Import primeNG modules
import { AccordionModule } from 'primeng/accordion';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/treetable';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogSelectTeamComponent } from './dialog-select-team/dialog-select-team.component';
import { DialogAddLinkComponent } from './dialog-add-link/dialog-add-link.component';
import { DialogRefineComponent } from './dialog-refine/dialog-refine.component';
import { DialogImportComponent } from './dialog-import/dialog-import.component';

@NgModule({
  declarations: [
    AppComponent,
    AppMenuComponent,
    GraphEditorComponent,
    ModalRefactoringsComponent,
    DialogAnalysisComponent,
    DialogSmellComponent,
    DialogAddNodeComponent,
    DialogAddNodeComponent,
    DialogAddTeamComponent,
    DialogSelectTeamComponent,
    DialogAddLinkComponent,
    DialogRefineComponent,
    DialogImportComponent,
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
    DialogModule,
    FileUploadModule,
    TreeModule,
    TreeTableModule,
    MessagesModule,
    MessageModule,
    ToolbarModule,
    OverlayPanelModule,
    MenuModule,
    SplitButtonModule,
    ProgressSpinnerModule,
    MenubarModule,
    PanelModule,
    InputTextareaModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ToastModule,
    SelectButtonModule,
    PickListModule,
    CardModule,
    InputSwitchModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [ // entry componets used in DymanimcModal of PimeNg
    DialogAnalysisComponent,
    DialogSmellComponent,
    DialogAddNodeComponent,
    DialogAddTeamComponent,
    DialogSelectTeamComponent,
    DialogAddLinkComponent,
    DialogRefineComponent,
    DialogImportComponent,
  ]
})
export class AppModule { }
