import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";

import { environment } from '../../../environments/environment';
import { SessionService } from '../session/session.service';
import { SidebarEvent } from './sidebar-event';

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
    
    sessionMenuItems: MenuItem[];

    @Output() onSidebarChange: EventEmitter<SidebarEvent> = new EventEmitter();
    sidebarStatus;

    constructor(
        private gs: GraphService,
        public dialogService: DialogService,
        public session: SessionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        ) {
            this.renaming = false;
            this.sidebarStatus = {
                viewIncomingTeams: false
            };
    }

    ngOnInit() {
        this.modelName = this.gs.getGraph().getName();
        this.fileMenuItems = [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                command: () => {
                    this.confirmationService.confirm({
                        header: 'New file',
                        icon: 'pi pi-exclamation-triangle',
                        message: 'Are you sure that you want to delete the current work and create a new one?',
                        accept: () => {
                            this.session.newFile();
                        }
                    });
                }
            },
            {
                label: 'Save',
                icon: 'pi pi-fw pi-save',
                command: () => {
                    this.session.save();
                }
            },
            { separator: true },
            {
                label: 'Import',
                icon: 'pi pi-fw pi-download',
                command: () => {
                    this.session.import()
                }
            },
            {
                label: 'Export',
                url: this.hrefDownload,
                icon: 'pi pi-fw pi-upload',
            },
            { separator: true },
            {
                label: 'Examples',
                icon: 'pi pi-fw pi-question-circle',
                items: [
                    // examples
                    {
                        label: 'Hello world',
                        command: () => {
                            this.session.downloadExample("helloworld");
                        }
                    },
                    {
                        label: 'Case study',
                        command: () => {
                            this.session.downloadExample("case-study-initial");
                        }
                    },
                    {
                        label: 'Case study (refactored)',
                        command: () => {
                            this.session.downloadExample("case-study-refactored");
                        }
                    },
                    {
                        label: 'Sockshop',
                        command: () => {
                            this.session.downloadExample("sockshop");
                        }
                    },
                    {
                        label: 'FTGO',
                        command: () => {
                            this.session.downloadExample("ftgo");
                        }
                    }
                    //end examples
                ]
            }
        ];

        this.sessionMenuItems = [
            {
                label: 'Logout',
                routerLink: "..",
                command: () => {
                    this.session.logout();
                }
            }
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
        this.sidebarStatus[event.name] = event.visible;
        this.onSidebarChange.emit(this.sidebarStatus);
    }

    editName() {
        this.renaming = true;
    }

    rename() {
        this.gs.getGraph().setName(this.modelName);
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Renamed correctly', detail: "New name [" + this.gs.getGraph().getName() + "]" });
        this.renaming = false;
    }

    getAvatarLetter() {
        let username = this.session.getName();
        if(username)
            return username.charAt(0).toUpperCase();
        else
            return "?";
    }

    getTooltipText() {
        let username = this.session.getName();
        if(username) {
            return "Logged as " + username;
        } else {
            return "Unable to retrieve username";
        }
    }

}
