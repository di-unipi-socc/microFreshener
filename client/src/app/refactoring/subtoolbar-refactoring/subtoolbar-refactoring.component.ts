import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AnalyserService } from '../analyser/analyser.service';
import { DialogAnalysisComponent } from '../dialog-analysis/dialog-analysis.component';
import { MenuItem, MessageService } from 'primeng/api';
import { GraphService } from '../../graph/graph.service';
import { SessionService } from 'src/app/core/session/session.service';
import { UserRole } from 'src/app/core/user-role';

@Component({
  selector: 'app-subtoolbar-refactoring',
  templateUrl: './subtoolbar-refactoring.component.html',
  styleUrls: ['./subtoolbar-refactoring.component.css']
})
export class SubtoolbarRefactoringComponent {

    constructor(
        private dialogService: DialogService,
        private as: AnalyserService,
        private session: SessionService,
        private messageService: MessageService,
        private gs: GraphService
    ) {}

    analyse() {
        const ref = this.dialogService.open(DialogAnalysisComponent, {
            header: 'Check the principles to analyse',
            width: '70%'
        });
        ref.onClose.subscribe((data) => {
            if (data.selected_smells) {
                var smells = data.selected_smells;
                
                let team;
                if(this.session.getRole() == UserRole.TEAM) {
                    let teamName = this.session.getName();
                    team = this.gs.getGraph().findGroupByName(teamName);
                }

                this.gs.uploadGraph(team)
                    .subscribe(data => {
                        console.log("uploadGraph response", data);
                        this.as.runRemoteAnalysis(smells, team)
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
