import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";
import { DialogAddNodeComponent } from '../../editing/dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../../editing/dialog-add-team/dialog-add-team.component';
import { DialogSelectTeamComponent } from '../../editing/dialog-select-team/dialog-select-team.component';
import { DialogRefineComponent } from '../../editing/dialog-refine/dialog-refine.component';
import { DialogAnalysisComponent } from '../../editing/dialog-analysis/dialog-analysis.component';
import { DialogImportComponent } from '../../editing/dialog-import/dialog-import.component';
import { DialogSelectRoleComponent } from '../../editing/dialog-select-role/dialog-select-role.component';

import { GraphInvoker } from "../../editing/invoker/invoker";
import { AddTeamGroupCommand } from '../../editing/invoker/graph-command';
import { AnalyserService } from '../../editing/analyser/analyser.service';

import { environment } from '../../../environments/environment';
import { EditingMenuItems } from '../../editing/editing-menu-items';
import { AppMenuItems } from './app-menu-items';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css'],
    providers: [DialogService] // , ConfirmationService]
})
export class AppMenuComponent implements OnInit {

    menubar: MenuItem[];
    modelName: string; // name of the model
    coreMenubar: MenuItem[];

    hrefDownload = environment.serverUrl + '/api/export';

    constructor(private graphInvoker: GraphInvoker, private as: AnalyserService, private gs: GraphService, public dialogService: DialogService, private messageService: MessageService, private confirmationService: ConfirmationService, private editingMenuItems: EditingMenuItems) {

        this.coreMenubar = [
            {
                label: "File",
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            this.newFile();
                        }
                    },
                    {
                        label: 'Save',
                        icon: 'pi pi-fw pi-save',
                        command: () => {
                            this.save();
                        }
                    },
                    { separator: true },
                    {
                        label: 'Import',
                        icon: 'pi pi-fw pi-upload',
                        command: () => {
                            this.import()
                        }
                    },
                    {
                        label: 'Export',
                        url: this.hrefDownload,
                        icon: 'pi pi-fw pi-download',
                    },
                    { separator: true },
                    {
                        label: 'Examples',
                        icon: 'pi pi-fw pi-download',
                        items: [
                            // examples
                            {
                                label: 'Hello world',
                                command: () => {
                                    this.downloadExample("helloworld");
                                }
                            },
                            {
                                label: 'Case study',
                                command: () => {
                                    this.downloadExample("case-study-initial");
                                }
                            },
                            {
                                label: 'Case study (refactored)',
                                command: () => {
                                    this.downloadExample("case-study-refactored");
                                }
                            },
                            {
                                label: 'Sockshop',
                                command: () => {
                                    this.downloadExample("sockshop");
                                }
                            },
                            {
                                label: 'FTGO',
                                command: () => {
                                    this.downloadExample("ftgo");
                                }
                            }
                            //end examples
                        ]
                    },
                ],

            }
        ];

        this.menubar = this.coreMenubar;
    }

    ngOnInit() {
        this.modelName = this.gs.getGraph().getName();
    }

    newFile() {
        this.confirmationService.confirm({
            header: 'New file',
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to delete the current work and create a new one?',
            accept: () => {
                this.gs.getGraph().clearGraph();
            }
        });
    }

    rename() {
        this.gs.getGraph().setName(this.modelName);
        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Renamed correctly', detail: "New name [" + this.gs.getGraph().getName() + "]" });
    }

    save() {
        this.gs.uploadGraph().subscribe(res => {
            if (res.msg)
                this.messageService.add({ severity: 'success', detail: res.msg, summary: 'Saved' });
        });
    }

    downloadExample(name: string) {
        this.gs.downloadExample(name)
            .subscribe((data) => {
                this.gs.getGraph().builtFromJSON(data);
                this.gs.getGraph().applyLayout("LR");
                this.messageService.add({ severity: 'success', summary: 'Loaded example', detail: `Example ${name} ` });
            });
    }

    import() {
        const ref = this.dialogService.open(DialogImportComponent, {
            header: 'Import MicroTosca',
            width: '70%'
        });
        ref.onClose.subscribe((data) => {
            if (data.msg) {
                console.log(data);
                this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
                this.selectRole();
            }
        });

    }

    private TEAM_MEMBER_ROLE: string = "team";
    private PRODUCT_OWNER_ROLE: string = "po";

    selectRole() {
        const ref = this.dialogService.open(DialogSelectRoleComponent, {
            header: 'Select your role',
            width: '50%'
        });
        ref.onClose.subscribe((data) => {
            console.log("The user declared " + data.role);
            this.setMenuForRole(data.role);
        });
    }

    setMenuForRole(role: string) {
        let isPO = role == this.PRODUCT_OWNER_ROLE;
        let isTeamMember = role == this.TEAM_MEMBER_ROLE;
        
        let separator = { separator: true };
        
        this.menubar = Array.prototype.concat(
            this.coreMenubar,
            separator,
            this.editingMenuItems.getAppMenuItems(this.dialogService)
        );
    }

}
