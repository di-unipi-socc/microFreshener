import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";

import { environment } from '../../../environments/environment';
import { FileService } from '../file/file.service';
import { UserRole } from '../user-role';
import { SessionService } from '../session/session.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent implements OnInit {

    modelName: string; // name of the model
    filemenu: MenuItem[];

    role: string;

    @ViewChildren('renameInput') private renameInputList: QueryList<ElementRef>;
    renaming: boolean;

    hrefDownload = environment.serverUrl + '/api/export';

    constructor(
        private gs: GraphService,
        public dialogService: DialogService,
        private fileService: FileService,
        public session: SessionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        ) {
            this.renaming = false;
    }

    ngOnInit() {
        this.modelName = this.gs.getGraph().getName();
        this.filemenu = [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                command: () => {
                    this.confirmationService.confirm({
                        header: 'New file',
                        icon: 'pi pi-exclamation-triangle',
                        message: 'Are you sure that you want to delete the current work and create a new one?',
                        accept: () => {
                            this.fileService.newFile();
                        }
                    });
                }
            },
            {
                label: 'Save',
                icon: 'pi pi-fw pi-save',
                command: () => {
                    this.fileService.save();
                }
            },
            { separator: true },
            {
                label: 'Import',
                icon: 'pi pi-fw pi-download',
                command: () => {
                    this.fileService.import()
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
                            this.fileService.downloadExample("helloworld");
                        }
                    },
                    {
                        label: 'Case study',
                        command: () => {
                            this.fileService.downloadExample("case-study-initial");
                        }
                    },
                    {
                        label: 'Case study (refactored)',
                        command: () => {
                            this.fileService.downloadExample("case-study-refactored");
                        }
                    },
                    {
                        label: 'Sockshop',
                        command: () => {
                            this.fileService.downloadExample("sockshop");
                        }
                    },
                    {
                        label: 'FTGO',
                        command: () => {
                            this.fileService.downloadExample("ftgo");
                        }
                    }
                    //end examples
                ]
            }
        ];

        this.fileService.roleChoice.subscribe((role) => {
            switch(role) {
                case UserRole.TEAM:
                    this.role = "tm";
                    break;
                case UserRole.ADMIN:
                    this.role = "po";
                    break;
            }
        });
    }

    ngAfterViewInit() {
        this.renameInputList.changes.subscribe((list: QueryList<ElementRef>) => {
            if (list.length > 0) {
                console.log(list);
                list.first.nativeElement.focus();
            }
        });
    }

    editName() {
        this.renaming = true;
    }

    rename() {
        this.gs.getGraph().setName(this.modelName);
        console.log("Renaming to " + this.modelName);
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
