import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { GraphService } from "../graph.service";
import { DialogAddNodeComponent } from '../dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';
import { DialogSelectTeamComponent } from '../dialog-select-team/dialog-select-team.component';
import { DialogRefineComponent } from '../dialog-refine/dialog-refine.component';
import { DialogAnalysisComponent } from '../dialog-analysis/dialog-analysis.component';
import { DialogImportComponent } from '../dialog-import/dialog-import.component';

import { GraphInvoker } from "../invoker/invoker";
import { AddTeamGroupCommand } from '../invoker/graph-command';
import { AnalyserService } from '../analyser.service';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css'],
    providers: [DialogService] // , ConfirmationService]
})
export class AppMenuComponent implements OnInit {

    menubar: MenuItem[];
    modelName: string; // name of the model

    hrefDownload = environment.serverUrl + '/api/export';

    constructor(private graphInvoker: GraphInvoker, private as: AnalyserService, private gs: GraphService, public dialogService: DialogService, private messageService: MessageService, private confirmationService: ConfirmationService) {

        this.menubar = [
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

            },
            { separator: true },
            {
                label: "Edit",
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: 'add',
                        icon: 'pi pi-fw pi-plus',
                        items: [
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
                        ]
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



                ]
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
                    },
                    {
                        label: 'Show',
                        icon: "pi pi-fw pi-th-large",
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

    addNode() {
        const ref = this.dialogService.open(DialogAddNodeComponent, {
            header: 'Add Node',
            width: '50%'
        });
        ref.onClose.subscribe((data) => {
            this.graphInvoker.executeCommand(data.command);
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
            header: 'Show a Team',
            width: '50%',
        });
        ref.onClose.subscribe((data) => {
            if (data.show) {
                var team = data.team;
                this.gs.getGraph().showOnlyTeam(team);
                this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} showed` });
            }
        });
    }

    import() {
        const ref = this.dialogService.open(DialogImportComponent, {
            header: 'Import MicroTosca',
            width: '70%'
        });
        ref.onClose.subscribe((data) => {
            if (data.msg)
                this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
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
