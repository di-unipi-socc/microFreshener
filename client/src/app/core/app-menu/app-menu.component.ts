import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";
import { DialogAddNodeComponent } from '../../editing/dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../../editing/dialog-add-team/dialog-add-team.component';
import { DialogSelectTeamComponent } from '../../editing/dialog-select-team/dialog-select-team.component';
import { DialogRefineComponent } from '../../editing/dialog-refine/dialog-refine.component';
import { DialogAnalysisComponent } from '../../editing/dialog-analysis/dialog-analysis.component';
import { DialogImportComponent } from '../../editing/dialog-import/dialog-import.component';


import { GraphInvoker } from "../../editing/invoker/invoker";
import { AddTeamGroupCommand } from '../../editing/invoker/graph-command';
import { AnalyserService } from '../../editing/analyser/analyser.service';

import { environment } from '../../../environments/environment';
import { EditingMenuItems } from '../../editing/editing-menu-items';
import { AppMenuItems } from './app-menu-items';
import { FileService } from '../file/file.service';
import { UserRole } from '../user-role';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent implements OnInit {

    menubar: MenuItem[];
    modelName: string; // name of the model
    coreMenubar: MenuItem[];

    hrefDownload = environment.serverUrl + '/api/export';

    constructor(private gs: GraphService, public dialogService: DialogService, private fileService: FileService, private messageService: MessageService, private confirmationService: ConfirmationService, private editingMenuItems: EditingMenuItems) {

        this.coreMenubar = [
            {
                label: "File",
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            fileService.newFile();
                        }
                    },
                    {
                        label: 'Save',
                        icon: 'pi pi-fw pi-save',
                        command: () => {
                            fileService.save();
                        }
                    },
                    { separator: true },
                    {
                        label: 'Import',
                        icon: 'pi pi-fw pi-download',
                        command: () => {
                            fileService.import()
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
                                    fileService.downloadExample("helloworld");
                                }
                            },
                            {
                                label: 'Case study',
                                command: () => {
                                    fileService.downloadExample("case-study-initial");
                                }
                            },
                            {
                                label: 'Case study (refactored)',
                                command: () => {
                                    fileService.downloadExample("case-study-refactored");
                                }
                            },
                            {
                                label: 'Sockshop',
                                command: () => {
                                    fileService.downloadExample("sockshop");
                                }
                            },
                            {
                                label: 'FTGO',
                                command: () => {
                                    fileService.downloadExample("ftgo");
                                }
                            }
                            //end examples
                        ]
                    },
                ],

            }
        ];
    }

    ngOnInit() {
        this.modelName = this.gs.getGraph().getName();
        this.menubar = this.coreMenubar;
        this.fileService.roleChoice.subscribe((role) => {
            this.setMenuForRole(role);
        })
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
