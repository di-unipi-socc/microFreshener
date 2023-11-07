import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../../graph/graph.service";

import { environment } from '../../../environments/environment';
import { SessionService } from '../session/session.service';
import { RefineService } from 'src/app/refine/refine.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent implements OnInit {

    modelName: string; // name of the model
    hrefDownload = environment.serverUrl + '/api/export';

    fileMenuItems: MenuItem[];
    @ViewChildren('renameInput') private renameInputList: QueryList<ElementRef>;
    renaming: boolean;
    
    newMenuItem;
    saveMenuItem;
    importMenuItem;
    exportMenuItem;
    refineMenuItem;
    examplesMenuItem;
    logoutMenuItem;

    sessionMenuItems: MenuItem[];

    @Output() onSidebarChange: EventEmitter<{}> = new EventEmitter();
    sidebarStatus;

    constructor(
        private gs: GraphService,
        public dialogService: DialogService,
        public session: SessionService,
        private refineService: RefineService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        ) {
            this.renaming = false;
            this.sidebarStatus = {};
                    // Add 'New' button if admin
        this.newMenuItem = {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            command: () => {
                this.confirmationService.confirm({
                    header: 'New file',
                    icon: 'pi pi-exclamation-triangle',
                    message: 'Are you sure that you want to delete the current work and create a new one?',
                    accept: () => {
                        this.session.newFile();
                        this.updatePostDocumentLoadMenu();
                    }
                });
            }
        };
        this.importMenuItem = {
            label: 'Import',
            icon: 'pi pi-fw pi-download',
            command: () => {
                this.session.import()
                this.updatePostDocumentLoadMenu();
            }
        };
        this.examplesMenuItem = {
            label: 'Examples',
            icon: 'pi pi-fw pi-question-circle',
            items: [
                // examples
                {
                    label: 'Hello world',
                    command: () => {
                        this.session.downloadExample("helloworld");
                        this.updatePostDocumentLoadMenu();
                    }
                },
                {
                    label: 'Case study',
                    command: () => {
                        this.session.downloadExample("case-study-initial");
                        this.updatePostDocumentLoadMenu();
                    }
                },
                {
                    label: 'Case study (refactored)',
                    command: () => {
                        this.session.downloadExample("case-study-refactored");
                        this.updatePostDocumentLoadMenu();
                    }
                },
                {
                    label: 'Sockshop',
                    command: () => {
                        this.session.downloadExample("sockshop");
                        this.updatePostDocumentLoadMenu();
                    }
                },
                {
                    label: 'FTGO',
                    command: () => {
                        this.session.downloadExample("ftgo");
                        this.updatePostDocumentLoadMenu();
                    }
                }
                //end examples
            ]
        };
        this.logoutMenuItem = {
            label: 'Logout',
            icon: 'pi pi-fw pi-times',
            routerLink: "..",
            command: () => {
                this.session.logout();
            }
        }

        // After document load

        this.saveMenuItem = {
            label: 'Save',
            icon: 'pi pi-fw pi-save',
            command: () => {
                if(this.session.isDocumentReady())
                    this.session.save();
            }
        };
        this.exportMenuItem = {
            label: 'Export',
            url: this.hrefDownload,
            icon: 'pi pi-fw pi-upload',
        };
        this.refineMenuItem = {
            label: 'Refine',
            icon: 'pi pi-fw pi-pencil',
            command: () => {
                this.refineService.refine();
            }
        };
    }

    ngOnInit() {
        this.modelName = this.gs.getGraph().getName();
        
        this.updatePreDocumentLoadMenu();

        this.sessionMenuItems = [
            this.logoutMenuItem
        ];
    }

    updatePreDocumentLoadMenu() {
        if(this.session.isAdmin()) {
            this.fileMenuItems = [
                this.newMenuItem,
                this.importMenuItem,
                { separator: true },
                this.examplesMenuItem,
                { separator: true },
                this.logoutMenuItem
            ];
        }

        if(this.session.isTeam()) {
            this.fileMenuItems = [
                this.importMenuItem,
                { separator: true },
                this.logoutMenuItem
            ];
        }
    }

    updatePostDocumentLoadMenu() {
        this.fileMenuItems = [
            this.saveMenuItem,
            { separator: true },
            this.exportMenuItem,
            { separator: true },
            this.refineMenuItem,
            { separator: true },
                this.logoutMenuItem
        ];
    }

    ngAfterViewInit() {
        this.renameInputList.changes.subscribe((list: QueryList<ElementRef>) => {
            if (list.length > 0) {
                list.first.nativeElement.focus();
            }
        });
    }

    sidebarChange(event) {
        this.onSidebarChange.emit(event);
    }

    editName() {
        if(this.session.isAdmin())
            this.renaming = true;
    }

    rename() {
        this.gs.getGraph().setName(this.modelName);
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Renamed correctly', detail: "New name [" + this.gs.getGraph().getName() + "]" });
        this.renaming = false;
    }

    getAvatarLetter() {
        let username = this.session.getTeamName();
        if(username)
            return username.charAt(0).toUpperCase();
        else
            return "?";
    }

    getTooltipText() {
        let username = this.session.getTeamName();
        if(username) {
            return "Logged as " + username;
        } else {
            return "Unable to retrieve username";
        }
    }

}
