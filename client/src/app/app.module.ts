import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

//import my component
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphEditorComponent } from './editing/graph-editor/graph-editor.component';
import { ModalRefactoringsComponent } from './refactoring/modal-refactorings/modal-refactorings.component';
import { DialogAnalysisComponent } from './refactoring/dialog-analysis/dialog-analysis.component';
import { DialogSmellComponent } from './refactoring/dialog-smell/dialog-smell.component';
import { DialogAddNodeComponent } from './editing/dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from './teams/dialog-add-team/dialog-add-team.component';
import { AppMenuComponent } from './core/app-menu/app-menu.component';
import { SubtoolbarArchitectureComponent } from './editing/subtoolbar-architecture/subtoolbar-architecture.component';
import { SubtoolbarUndoComponent } from './editing/subtoolbar-undo/subtoolbar-undo.component';
import { SubtoolbarNavigationComponent } from './editing/subtoolbar-navigation/subtoolbar-navigation.component';
import { SubtoolbarViewComponent } from './editing/subtoolbar-view/subtoolbar-view.component';


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

// Import dialog components
import { DialogSelectTeamComponent } from './teams/dialog-select-team/dialog-select-team.component';
import { DialogAddLinkComponent } from './editing/dialog-add-link/dialog-add-link.component';
import { DialogRefineComponent } from './refactoring/dialog-refine/dialog-refine.component';
import { DialogImportComponent } from './core/dialog-import/dialog-import.component';
import { DialogSelectRoleComponent } from './core/dialog-select-role/dialog-select-role.component';
import { SubtoolbarRefactoringComponent } from './refactoring/subtoolbar-refactoring/subtoolbar-refactoring.component';
import { SubtoolbarTeamsComponent } from './teams/toolbar-items-teams/subtoolbar-teams.component';
import { LoginPageComponent } from './core/login-page/login-page.component';
import { EditorPageComponent } from './core/editor-page/editor-page.component';

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
    DialogSelectRoleComponent,
    SubtoolbarArchitectureComponent,
    SubtoolbarUndoComponent,
    SubtoolbarNavigationComponent,
    SubtoolbarViewComponent,
    SubtoolbarRefactoringComponent,
    SubtoolbarTeamsComponent,
    LoginPageComponent,
    EditorPageComponent,
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
    AvatarModule
  ],
  providers: [
    DialogService,
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
    DialogSelectRoleComponent
  ]
})
export class AppModule { }
