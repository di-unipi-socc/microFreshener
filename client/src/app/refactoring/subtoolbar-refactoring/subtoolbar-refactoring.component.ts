import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AnalyserService } from '../analyser.service';
import { DialogAnalysisComponent } from '../dialog-analysis/dialog-analysis.component';
import { GraphService } from '../../graph/graph.service';
import { SessionService } from 'src/app/core/session/session.service';
import { UserRole } from 'src/app/core/user-role';
import { GraphInvoker } from 'src/app/commands/invoker';
import { Subscription } from 'rxjs';
import { TeamsService } from 'src/app/teams/teams.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subtoolbar-refactoring',
  templateUrl: './subtoolbar-refactoring.component.html',
  styleUrls: ['./subtoolbar-refactoring.component.css']
})
export class SubtoolbarRefactoringComponent {

    monitorToggled: boolean;
    smellsNumber: number;

    private invokerSubscription: Subscription;
    private options;

    constructor(
        private dialogService: DialogService,
        private as: AnalyserService,
        private teams: TeamsService,
        private commands: GraphInvoker,
        private session: SessionService,
        private gs: GraphService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.options = {};
    }

    monitor() {
        if(this.monitorToggled) {
            this.startMonitoring();
        } else {
            this.stopMonitoring();
            this.smellsNumber = 0;
        }
    }

    async startMonitoring() {
        const ref = this.dialogService.open(DialogAnalysisComponent, {
            header: 'Check the principles to analyse',
            width: '70%',
            draggable: true
        });
        ref.onClose.subscribe((data) => {
            if (data?.selected_smells) {
                this.options.smells = data.selected_smells;
                if(this.session.getRole() == UserRole.TEAM) {
                    let teamName = this.session.getTeamName();
                    this.options.team = this.teams.getTeam(teamName);
                }

                let analyseGraph = () => {
                    this.gs.uploadGraph(this.options.team)
                            .subscribe(data => {
                                this.as.runRemoteAnalysis(this.options.smells)
                                    .subscribe(data => {
                                        this.as.showSmells();
                                        //this.messageService.add({ severity: 'success', summary: "Analysis performed correctly", detail: `Found ${this.smellsNumber} smells` });
                                    });
                            });
                };
                this.invokerSubscription = this.commands.subscribe(analyseGraph);
                analyseGraph();
                this.messageService.add({ severity: 'success', summary: "Smells analysis started", detail: `Smells analysis is now active.` });
            } else {
                this.monitorToggled = false;
            }
        });
    }

    async stopMonitoring() {
        this.invokerSubscription?.unsubscribe();
        this.as.clearSmells();
        this.messageService.add({ severity: 'success', summary: "Smells analysis stopped", detail: `Smells analysis is not active anymore.` });
    }

}
