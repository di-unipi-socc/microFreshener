export class TeamDetails {

    constructor(
        private readonly team: joint.shapes.microtosca.SquadGroup,
        private readonly nodes: {services: joint.shapes.microtosca.Service[], communicationPatterns: joint.shapes.microtosca.CommunicationPattern[], datastores: joint.shapes.microtosca.Datastore[]},
        private readonly teamInteractions: {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]},
        private readonly edge: joint.shapes.microtosca.Node[]
    ) {}

    getNodes() {
        return this.nodes;
    }

    getTeamInteractions() {
        return this.teamInteractions;
    }

    getTeam() {
        return this.team;
    }

    getEdge() {
        return this.edge;
    }
}