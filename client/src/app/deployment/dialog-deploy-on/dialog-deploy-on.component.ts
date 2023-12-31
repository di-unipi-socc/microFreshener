import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeploymentService } from '../deployment.service';

@Component({
  selector: 'app-dialog-deploy-on',
  templateUrl: './dialog-deploy-on.component.html',
  styleUrls: ['./dialog-deploy-on.component.css']
})
export class DialogDeployOnComponent {

  computes;
  selectedCompute;

  deployingNode: joint.shapes.microtosca.Node;

  constructor(
    private deployments: DeploymentService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.computes = this.deployments.getComputes().map((compute) => { return {name: compute.getName(), value: compute} });
    this.deployingNode = this.config.data.deploying;
  }

  save() {
    this.ref.close({ "deploying": this.deployingNode, "compute": this.selectedCompute.value});
  }

}
