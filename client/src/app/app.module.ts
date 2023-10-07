import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

//import my component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphEditorComponent } from './editor/graph-editor.component';
import { ModalRefactoringsComponent } from './refactoring/modal-refactorings/modal-refactorings.component';
import { DialogAnalysisComponent } from './refactoring/dialog-analysis/dialog-analysis.component';
import { DialogSmellComponent } from './refactoring/dialog-smell/dialog-smell.component';
import { DialogAddNodeComponent } from './architecture/dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from './teams/dialog-add-team/dialog-add-team.component';
import { AppMenuComponent } from './core/app-menu/app-menu.component';
import { SubtoolbarArchitectureComponent } from './architecture/subtoolbar-architecture/subtoolbar-architecture.component';
import { SubtoolbarUndoComponent } from './commands/subtoolbar-undo/subtoolbar-undo.component';
import { SubtoolbarNavigationComponent } from './editor/subtoolbar-navigation/subtoolbar-navigation.component';
import { SubtoolbarViewComponent } from './editor/subtoolbar-view/subtoolbar-view.component';


// Import primeNG modules
import { AccordionModule } from 'primeng/accordion';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { StyleClassModule } from 'primeng/styleclass';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';

// Import dialog components
import { DialogAddLinkComponent } from './architecture/dialog-add-link/dialog-add-link.component';
import { DialogRefineComponent } from './refactoring/dialog-refine/dialog-refine.component';
import { DialogImportComponent } from './core/dialog-import/dialog-import.component';
import { SubtoolbarRefactoringComponent } from './refactoring/subtoolbar-refactoring/subtoolbar-refactoring.component';
import { SubtoolbarTeamsComponent } from './teams/subtoolbar-teams-management/subtoolbar-teams-management.component';
import { LoginPageComponent } from './core/login-page/login-page.component';
import { EditorPageComponent } from './core/editor-page/editor-page.component';
import { SubtoolbarFromTeamNavigationComponent } from './teams/subtoolbar-from-team-navigation/subtoolbar-from-team-navigation.component';
import { SidebarIncomingTeamsComponent } from './teams/sidebar-incoming-teams/sidebar-incoming-teams.component';

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
    DialogAddLinkComponent,
    DialogRefineComponent,
    DialogImportComponent,
    SubtoolbarArchitectureComponent,
    SubtoolbarUndoComponent,
    SubtoolbarNavigationComponent,
    SubtoolbarViewComponent,
    SubtoolbarRefactoringComponent,
    SubtoolbarTeamsComponent,
    LoginPageComponent,
    EditorPageComponent,
    SubtoolbarFromTeamNavigationComponent,
    SidebarIncomingTeamsComponent,
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
    TabMenuModule,
    PanelModule,
    InputTextareaModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ToastModule,
    SelectButtonModule,
    PickListModule,
    CardModule,
    InputSwitchModule,
    DividerModule,
    StyleClassModule,
    ToggleButtonModule,
    AvatarModule,
    TagModule,
    MultiSelectModule
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [ // entry components used in DynamicModal of PrimeNg
    DialogAnalysisComponent,
    DialogSmellComponent,
    DialogAddNodeComponent,
    DialogAddTeamComponent,
    DialogAddLinkComponent,
    DialogRefineComponent,
    DialogImportComponent,
  ]
})
export class AppModule { }
