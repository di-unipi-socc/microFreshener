import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { DialogSmellComponent } from '../dialog-smell/dialog-smell.component';
import { GraphService } from "../graph.service";
import { SmellObject } from '../analyser/smell';
import { DialogAddNodeComponent } from '../dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';


import { GraphInvoker } from "../invoker/invoker";
import { RemoveNodeCommand, AddLinkCommand, RemoveLinkCommand, AddTeamGroupCommand, AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand, RemoveServiceCommand, RemoveDatastoreCommand, RemoveCommunicationPatternCommand } from '../invoker/graph-command';
import { DialogAddLinkComponent } from '../dialog-add-link/dialog-add-link.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app-menu.component.html',
    styleUrls: ['./app-menu.component.css'],
    providers: [DialogService, ConfirmationService]
})
export class AppMenuComponent implements OnInit {

    menubar: MenuItem[];

    constructor(private graphInvoker: GraphInvoker, private gs: GraphService, public dialogService: DialogService, private messageService: MessageService, private confirmationService: ConfirmationService) {

        this.menubar = [
            {
                label: "File",
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            console.log("NEW FILE");
                        }
                    },
                    {
                        label: 'Rename',
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            console.log("Renaming");
                        }
                    },
                    {
                        label: 'Save',
                        icon: 'pi pi-fw pi-save',
                        command: () => {
                            this.gs.uploadGraph()
                                .subscribe(json_model => {
                                    this.messageService.add({ severity: 'success', summary: json_model['name'] + " saved correctly", detail: '' });
                                });
                        }
                    },
                    {
                        label: 'Examples',
                        icon: 'pi pi-fw pi-download',
                        items: [
                            {

                                label: "gg",
                                command: () => {
                                }
                            }


                        ]
                    },
                    {
                        label: 'Import',
                        icon: 'pi pi-fw pi-upload',
                        command: () => {

                        }
                    },
                    {
                        label: 'Export',
                        icon: 'pi pi-fw pi-download',
                        command: () => {

                        }
                    }
                ],

            },
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
                                icon: 'pi pi-fw pi-upload',
                            },
                            {
                                label: 'team',
                                icon: 'pi pi-fw pi-upload',
                            },
                        ]
                    },
                    {
                        label: 'undo',
                        icon: "pi pi-fw pi-redo",
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
                        label: 'Team',
                        command: () => {
                        }
                    },
                ]
            },
            {
                label: " Actions",
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        icon: "pi pi-fw pi-search",
                        label: 'Analyse',
                        command: () => {
                            this.gs.getGraph().applyLayout("BT");
                        }
                    },
                    {
                        icon: "pi pi-fw pi-refresh",
                        label: 'Refine',
                        command: () => {
                            this.gs.getGraph().applyLayout("BT");
                        }
                    }

                ]
            }
        ];
    }

    ngOnInit() {

    }
}
