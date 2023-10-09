import { Injectable } from '@angular/core';
import { GraphEditorComponent } from '../../editor/graph-editor.component';
import { AddDatastoreCommand, AddMessageBrokerCommand, AddMessageRouterCommand, AddServiceCommand, NodeCommand, RemoveCommunicationPatternCommand, RemoveDatastoreCommand, RemoveNodeCommand, RemoveServiceCommand } from '../../commands/node-commands';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { GraphInvoker } from '../../commands/invoker';
import { SessionService } from '../../core/session/session.service';
import { GraphService } from '../../graph/graph.service';
import { DialogAddNodeComponent } from '../dialog-add-node/dialog-add-node.component';

import { g } from 'jointjs';
import { AddLinkCommand, RemoveLinkCommand } from '../../commands/link-commands';
import { DialogAddLinkComponent } from '../dialog-add-link/dialog-add-link.component';
import { EditorNavigationService } from '../../editor/navigation/navigation.service';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';
import { AddMemberToTeamGroupCommand } from 'src/app/commands/team-commands';

@Injectable({
  providedIn: GraphEditorComponent
})
export class ArchitectureEditingService {

  constructor(
    private graphInvoker: GraphInvoker,
    private graphService: GraphService,
    private navigation: EditorNavigationService,
    private session: SessionService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  addNode(nodeType: string, position?: g.Point, team?: joint.shapes.microtosca.Group) {
    // Ask for node required data
    const ref = this.dialogService.open(DialogAddNodeComponent, {
        header: 'Add Node',
        data: {
            clickPosition: position,
            group: team,
            nodeType: nodeType
        }
    });
    ref.onClose.subscribe((data) => {
        // Create the AddNodeCommand
        if(data) {
          let addNodeCommand: NodeCommand;
          let message: string;
          switch (data.nodeType) {
            case ToolSelectionService.SERVICE:
              addNodeCommand = new AddServiceCommand(this.graphService.getGraph(), data.name, data.position);
              message = `Service ${data.name} added correctly`;
              break;
            case ToolSelectionService.DATASTORE:
              addNodeCommand = new AddDatastoreCommand(this.graphService.getGraph(), data.name, data.position);
              message = `Datastore  ${data.name}  added correctly`;
              break;
            case ToolSelectionService.COMMUNICATION_PATTERN:
              if(data.communicationPatternType === ToolSelectionService.MESSAGE_BROKER){
                addNodeCommand = new AddMessageBrokerCommand(this.graphService.getGraph(), data.name, data.position);
                message += `Message Broker ${data.name} added correctly`;
              }
              else if(data.communicationPatternType === ToolSelectionService.MESSAGE_ROUTER){
                addNodeCommand = new AddMessageRouterCommand(this.graphService.getGraph(), data.name, data.position);
                message += `Message Router ${data.name} added correctly`;
              }
              else
                this.messageService.add({ severity: 'error', summary: `Node type ${data.nodeType} not recognized`});
              break;
            default:
              this.messageService.add({ severity: 'error', summary: `Type of node '${data.nodeType}' not found `});
          }

          // If a team has been specified, atomically add the node into it
          let command;
          if(!team) {
            command = addNodeCommand;
          } else {
            command = new class Command {
              node;
              addMemberCmd;
              execute() {
                this.node = addNodeCommand.execute();
                this.addMemberCmd = new AddMemberToTeamGroupCommand(team, this.node);
                this.addMemberCmd.execute();
              }
              unexecute() {
                this.addMemberCmd.unexecute();
                addNodeCommand.unexecute();
              }
            };
          }
        }
    });
  }

  deleteNode(node) {
    this.confirmationService.confirm({
        message: 'Do you want to delete this node?',
        header: 'Node Deletion Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.graphInvoker.executeCommand(new RemoveNodeCommand(this.graphService.getGraph(), node))
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Node ${node.getName()} not deleted` });
        }
    });
  }

  deleteService(node) {
    this.confirmationService.confirm({
        message: 'Do you want to delete this service?',
        header: 'Node Deletion Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            // this.graphInvoker.executeCommand(new RemoveNodeCommand(this.gs.getGraph(), node))
            this.graphInvoker.executeCommand(new RemoveServiceCommand(this.graphService.getGraph(), node.getName()));
        },
        reject: () => {
            node.hideIcons();
            this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Node ${node.getName()} not deleted` });
        }
    });
  }

  deleteDatastore(node) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this datastore?',
      header: 'Node Deletion Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          // this.graphInvoker.executeCommand(new RemoveNodeCommand(this.gs.getGraph(), node))
          this.graphInvoker.executeCommand(new RemoveDatastoreCommand(this.graphService.getGraph(), node.getName()));
      },
      reject: () => {
          node.hideIcons();
          this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Datastore ${node.getName()} not deleted` });
      }
  });
  }

  removeLink(link: joint.shapes.microtosca.RunTimeLink) {
    console.log("removing link called");
    console.log(this.confirmationService);
    this.confirmationService.confirm({
        message: 'Do you want to delete the link?',
        header: 'Link deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.graphInvoker.executeCommand(new RemoveLinkCommand(this.graphService.getGraph(), link));
            //this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Link not deleted` });
        }
    });

  }

  removeCommunicationPattern(node) {
    this.graphInvoker.executeCommand(new RemoveCommunicationPatternCommand(this.graphService.getGraph(), node.getName()));
  }

  addLink(leftClickSelectedNode, node) {
    console.log("selected, new ->", leftClickSelectedNode, node);
    const ref = this.dialogService.open(DialogAddLinkComponent, {
        data: {
            source: leftClickSelectedNode,
            target: node
        },
        header: 'Add a link',
    });
    ref.onClose.subscribe((data) => {
        if (data) {
            var command = new AddLinkCommand(this.graphService.getGraph(), leftClickSelectedNode.getName(), node.getName(), data.timeout, data.circuit_breaker, data.dynamic_discovery);
            this.graphInvoker.executeCommand(command);
            this.navigation.getPaper().findViewByModel(leftClickSelectedNode).unhighlight();
            console.log("added link");
        }
    });
  }

  reverseLink(link) {
    let source = link.source();
    let target = link.target();
    link.source(target);
    link.target(source);
  }

}