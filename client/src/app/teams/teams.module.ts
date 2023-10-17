import { NgModule } from "@angular/core";
import { TeamsAnalyticsService as TeamAnalyticsService } from "./team-analytics/teams-analytics.service";
import { TeamsService } from "./teams.service";
import { TeamEditingService } from "./team-editing/team-editing.service";
import { TeamVisualizationService } from "./team-visualization/team-visualization.service";
import { DialogAddTeamComponent } from "./dialog-add-team/dialog-add-team.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SubtoolbarFromTeamNavigationComponent } from "./subtoolbar-from-team-navigation/subtoolbar-from-team-navigation.component";
import { SidebarIncomingTeamsComponent } from "./sidebar-incoming-teams/sidebar-incoming-teams.component";
import { SidebarTeamDetailsComponent } from "./sidebar-team-details/sidebar-team-details.component";
import { SidebarTeamsRelationsComponent } from "./sidebar-teams-relations/sidebar-teams-relations.component";
import { SidebarModule } from "primeng/sidebar";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { BrowserModule } from "@angular/platform-browser";
import { ChartModule } from "primeng/chart";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { StyleClassModule } from "primeng/styleclass";
import { ToggleButtonModule } from "primeng/togglebutton";
import { SubtoolbarTeamsComponent } from "./subtoolbar-teams-management/subtoolbar-teams-management.component";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
    declarations: [
        DialogAddTeamComponent,
        SubtoolbarFromTeamNavigationComponent,
        SidebarIncomingTeamsComponent,
        SidebarTeamDetailsComponent,
        SidebarTeamsRelationsComponent,
        SubtoolbarTeamsComponent
    ],
    exports: [
        DialogAddTeamComponent,
        SubtoolbarFromTeamNavigationComponent,
        SidebarIncomingTeamsComponent,
        SidebarTeamDetailsComponent,
        SidebarTeamsRelationsComponent,
        SubtoolbarTeamsComponent
    ],
    imports: [
        FormsModule,
        ButtonModule,
        SidebarModule,
        CardModule,
        TagModule,
        BrowserModule,
        DynamicDialogModule,
        ChartModule,
        ToggleButtonModule,
        StyleClassModule,
        MultiSelectModule,
        InputTextModule,
        TooltipModule
    ],
    providers: [
        TeamsService,
        TeamEditingService,
        TeamVisualizationService,
        TeamAnalyticsService
    ]
 })
 export class TeamsModule{}