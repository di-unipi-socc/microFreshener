import { Injectable } from '@angular/core';
import { GraphEditorComponent } from '../graph-editor.component';
import { RemoveDatastoreCommand, RemoveNodeCommand, RemoveServiceCommand } from '../../commands/node-commands';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Invoker } from '../../commands/invoker/iinvoker';
import { SessionService } from '../../core/session/session.service';
import { GraphService } from '../../graph/graph.service';
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from '../../commands/team-commands';
import { DialogAddNodeComponent } from '../dialog-add-node/dialog-add-node.component';
import { UserRole } from '../../core/user-role';

import { g } from 'jointjs';
import { AddLinkCommand, RemoveLinkCommand } from '../../commands/link-commands';
import { DialogAddLinkComponent } from '../dialog-add-link/dialog-add-link.component';

@Injectable({
  providedIn: GraphEditorComponent
})
export class GraphEditingService {

  private paper: joint.dia.Paper = undefined;
  private graphInvoker: Invoker = undefined;

  constructor(
    private graph: GraphService,
    private session: SessionService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  start(paper, invoker) {
    this.paper = paper;
    this.graphInvoker = invoker;
  }

  addNode(nodeType: string, position?: g.Point, group?: joint.shapes.microtosca.Group) {
    // Team members add nodes to their team by default
    if(!group && this.session.getRole() == UserRole.TEAM) {
        group = this.graph.getGraph().findGroupByName(this.session.getName());
    }
    // Create the AddNodeCommand and execute it
    const ref = this.dialogService.open(DialogAddNodeComponent, {
        header: 'Add Node',
        height: '50%',
        data: {
            clickPosition: position,
            group: group,
            nodeType: nodeType
        }
    });
    ref.onClose.subscribe((data) => {
        this.graphInvoker.executeCommand(data.command);
    });
  }

  deleteSelected(leftClickSelectedNode) {
    if (leftClickSelectedNode) {
        var node = leftClickSelectedNode;
        this.confirmationService.confirm({
            message: 'Do you want to delete this node?',
            header: 'Node Deletion Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.graphInvoker.executeCommand(new RemoveNodeCommand(this.graph.getGraph(), node))
                this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Node ${node.getName()} not deleted` });
            }
        });
    }
  }

  deleteService(node) {
    this.confirmationService.confirm({
        message: 'Do you want to delete this service?',
        header: 'Node Deletion Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            // this.graphInvoker.executeCommand(new RemoveNodeCommand(this.gs.getGraph(), node))
            this.graphInvoker.executeCommand(new RemoveServiceCommand(this.graph.getGraph(), node.getName()));
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
          this.graphInvoker.executeCommand(new RemoveDatastoreCommand(this.graph.getGraph(), node.getName()));
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
            this.graphInvoker.executeCommand(new RemoveLinkCommand(this.graph.getGraph(), link));
            //this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Link not deleted` });
        }
    });

  }

  addLink(leftClickSelectedNode, node) {
    console.log("selected, new ->", leftClickSelectedNode, node);
    const ref = this.dialogService.open(DialogAddLinkComponent, {
        data: {
            source: leftClickSelectedNode,
            target: node
        },
        header: 'Add a link',
        width: '50%'
    });
    ref.onClose.subscribe((data) => {
        if (data) {
            var command = new AddLinkCommand(this.graph.getGraph(), leftClickSelectedNode.getName(), node.getName(), data.timeout, data.circuit_breaker, data.dynamic_discovery);
            this.graphInvoker.executeCommand(command);
            this.paper.findViewByModel(leftClickSelectedNode).unhighlight();
            console.log("added link");
        }
    });
  }
}