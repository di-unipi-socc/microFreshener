import { Component } from '@angular/core';
import { DialogRefineComponent } from '../dialog-refine/dialog-refine.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AnalyserService } from '../analyser/analyser.service';
import { DialogAnalysisComponent } from '../dialog-analysis/dialog-analysis.component';
import { MenuItem, MessageService } from 'primeng/api';
import { GraphService } from 'src/app/editing/model/graph.service';

@Component({
  selector: 'app-toolbar-items-refactoring',
  templateUrl: './toolbar-items-refactoring.component.html',
  styleUrls: ['./toolbar-items-refactoring.component.css']
})
export class ToolbarItemsRefactoringComponent {

    menuitems: MenuItem[] = [
        {
            icon: "pi pi-fw pi-search",
            label: 'Analyse',
            command: () => {
                this.analyse();
            }
        },
        {
            icon: "pi pi-fw pi-refresh",
            label: 'Refine',
            command: () => {
                this.refine()
            }
        }
    ];

    constructor(private dialogService: DialogService,  private as: AnalyserService,  private messageService: MessageService, private gs: GraphService) {}

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
