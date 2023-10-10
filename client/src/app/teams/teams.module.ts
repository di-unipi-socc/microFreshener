import { NgModule } from "@angular/core";
import { TeamsAnalyticsService as TeamAnalyticsService } from "./team-analytics/teams-analytics.service";
import { TeamsService } from "./teams.service";
import { TeamEditingService } from "./team-editing/team-editing.service";
import { TeamVisualizationService } from "./team-visualization/team-visualization.service";

@NgModule({
    declarations: [],
    imports: [],
    providers: [TeamsService, TeamEditingService, TeamVisualizationService,  TeamAnalyticsService]
 })
 export class TeamsModule{}