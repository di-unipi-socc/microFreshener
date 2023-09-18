import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { AppMenuItems } from '../core/app-menu/app-menu-items';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../editing/model/graph.service";
import { DialogAddNodeComponent } from '../editing/dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../teams/dialog-add-team/dialog-add-team.component';
import { DialogSelectTeamComponent } from '../teams//dialog-select-team/dialog-select-team.component';
import { DialogRefineComponent } from '../refactoring/dialog-refine/dialog-refine.component';
import { DialogAnalysisComponent } from '../refactoring/dialog-analysis/dialog-analysis.component';

import { GraphInvoker } from "../editing/invoker/invoker";
import { AddTeamGroupCommand } from '../editing/invoker/graph-command';
import { AnalyserService } from '../refactoring/analyser/analyser.service';

@Injectable({
    providedIn: 'root'
})
export class EditingMenuItems implements AppMenuItems {

    constructor(private graphInvoker: GraphInvoker, private as: AnalyserService, private gs: GraphService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    }

    private dialogService: DialogService;

    getAppMenuItems(dialogService: DialogService): MenuItem[] {
        this.dialogService = dialogService;
        return [
            {
                icon: 'pi pi-fw pi-cog',
                items: [
                        {
                            label: 'All',
                            command: () => {
                                this.maximizeTeam()
                            }
                        },
                        {
                            label: 'By teams',
                            command: () => {
                                this.minimizeTeam()
                            }
                        },
                        {
                            label: 'One team',
                            command: () => {
                                this.showOneTeam();
                            }
                        }
                ]
            },
            {
                label: 'node',
                icon: 'pi pi-fw pi-circle-off',
                command: () => {
                    this.addNode();
                }
            },
            {
                label: 'team',
                icon: 'pi pi-fw pi-users',
                command: () => {
                    this.addTeam();
                }
            },
            {
                label: 'undo',
                icon: "pi pi-fw pi-undo",
                command: () => {
                    this.graphInvoker.undo();
                }
            },
            {
                label: 'redo',
                icon: "pi pi-fw pi-replay",
                command: () => {
                    this.graphInvoker.redo();
                }
            },
            { separator: true },
            {
                label: "View",
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'layout',
                        icon: "pi pi-fw pi-sitemap",
                        items: [
                            {
                                label: 'Botton-to-top',
                                command: () => {
                                    this.gs.getGraph().applyLayout("BT");
                                }
                            },
                            {
                                label: 'Top-to-bottom',
                                command: () => {
                                    this.gs.getGraph().applyLayout("TB");
                                }
                            },
                            {
                                label: 'Left-to-right',
                                command: () => {
                                    this.gs.getGraph().applyLayout("LR");
                                }
                            },
                            {
                                label: 'Right-to-left',
                                command: () => {
                                    this.gs.getGraph().applyLayout("RL");
                                }
                            },
                        ]
                    }
                ]
            },
            { separator: true },
            {
                label: " Actions",
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        icon: "pi pi-fw pi-search",
                        label: 'Analyse',
                        command: () => {
                            this.analyse();
                        }
                    },
                    { separator: true },
                    {
                        icon: "pi pi-fw pi-refresh",
                        label: 'Refine',
                        command: () => {
                            this.refine()
                        }
                    }

                ]
            }
        ];
    }

    addNode() {
        const ref = this.dialogService.open(DialogAddNodeComponent, {
            header: 'Add Node',
            width: '50%'
        });
        ref.onClose.subscribe((data) => {
            this.graphInvoker.executeCommand(data.command);
        });
    }

    addTeam() {
        const ref = this.dialogService.open(DialogAddTeamComponent, {
            header: 'Add Team',
            width: '50%',
        });
        ref.onClose.subscribe((data) => {
            this.graphInvoker.executeCommand(new AddTeamGroupCommand(this.gs.getGraph(), data.name));
            this.messageService.add({ severity: 'success', summary: `Team ${data.name} inserted correctly` });
        });
    }

    maximizeTeam() {
        this.gs.getGraph().maximizeAllTeam();
        this.messageService.add({ severity: 'success', summary: ` All graph visualized` });
    }

    minimizeTeam() {
        this.gs.getGraph().minimizeAllTeam();
        this.messageService.add({ severity: 'success', summary: ` All team minimized` });
    }

    showOneTeam() {
        const ref = this.dialogService.open(DialogSelectTeamComponent, {
            header: 'Select a Team',
            width: '50%',
        });
        ref.onClose.subscribe((data) => {
            if (data.show) {
                var team = data.team;
                this.gs.getGraph().showOnlyTeam(team);
                this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} shown` });
            }
        });
    }

    refine() {
        const ref = this.dialogService.open(DialogRefineComponent, {
            header: 'Refine the model',
            width: '70%'
        });
        ref.onClose.subscribe((data) => {

        });
    }

    analyse() {
        const ref = this.dialogService.open(DialogAnalysisComponent, {
            header: 'Check the principles to analyse',
            width: '70%'
        });
        ref.onClose.subscribe((data) => {
            if (data.selected_smells) {
                var smells = data.selected_smells;
                this.gs.uploadGraph()
                    .subscribe(data => {
                        this.as.runRemoteAnalysis(smells)
                            .subscribe(data => {
                                this.as.showSmells();
                                var num = this.as.getNumSmells()
                                this.messageService.add({ severity: 'success', summary: "Analysis performed correctly", detail: `Found ${num} smells` });
                            });
                    });
            }

        });
    }
}