import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";

import { environment } from '../../../environments/environment';
import { EditingMenuItems } from '../../editing/editing-menu-items';
import { FileService } from '../file/file.service';
import { UserRole } from '../user-role';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent implements OnInit {

    menubar: MenuItem[];
    filemenu: MenuItem[];
    modelName: string; // name of the model
    coreMenubar: MenuItem[];

    hrefDownload = environment.serverUrl + '/api/export';

    constructor(private gs: GraphService, public dialogService: DialogService, private fileService: FileService, private messageService: MessageService, private confirmationService: ConfirmationService, private editingMenuItems: EditingMenuItems) {
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

        this.coreMenubar = [];

        this.fileService.roleChoice.subscribe((role) => {
            this.setMenuForRole(role);
        })
    }

    rename() {
        this.gs.getGraph().setName(this.modelName);
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Renamed correctly', detail: "New name [" + this.gs.getGraph().getName() + "]" });
    }

    setMenuForRole(role: UserRole) {
        /*let isPO = role == UserRoles.PRODUCT_OWNER;
        let isTeamMember = role == UserRoles.TEAM_MEMBER;*/
        
        const separator = { separator: true };
        
        this.menubar = Array.prototype.concat(
            this.coreMenubar,
            separator,
            this.editingMenuItems.getAppMenuItems(this.dialogService)
        );
    }

}
