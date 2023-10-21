import * as joint from 'jointjs';
import { g } from 'jointjs';
import './microtosca';

export class Graph extends joint.dia.Graph {
    name: string;

    public static readonly TEAM_PADDING: number = 40;
    //public ticker: EventEmitter<Number> = new EventEmitter();

    constructor(name: string) {
        super();
        this.name = name;
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getNode(name: string | joint.dia.Element): joint.shapes.microtosca.Node {
        for (let node of this.getElements()) {
            if ((<joint.shapes.microtosca.Node>node).getName() == name)
                return <joint.shapes.microtosca.Node>node;
        }
        return null;
    }

    getGroup(name: string): joint.shapes.microtosca.Group {
        return this.getGroups().find(group => group.getName() == name);
    }

    getRoots(): joint.shapes.microtosca.Root[] {
        return <joint.shapes.microtosca.Root[]>this.getElements();
    }

    /**Return all the nodes in the graph  */
    getNodes(): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getElements().filter(node => this.isNode(node));
    }

    /**Return all the group in the graph  */
    getGroups(): joint.shapes.microtosca.Group[] {
        return <joint.shapes.microtosca.Group[]>this.getElements().filter(node => this.isGroup(node));
    }

    findTeamByName(name: string): joint.shapes.microtosca.SquadGroup {
        return this.getTeamGroups().find(team => name === team.getName());
    }

    findNodeByName(name: string): joint.shapes.microtosca.Node {
        return this.getNodes().find(node => name === node.getName());
    }

    findGroupByName(name: string): joint.shapes.microtosca.Group {
        return this.getGroups().find(group => name === group.getName());
    }

    findRootByName(name: string): joint.shapes.microtosca.Root {
        return this.getRoots().find(element => name === element.getName());
    }

    removeNode(name: string) {
        return this.getNode(name).remove();
    }

    getLinks(): joint.shapes.microtosca.RunTimeLink[] {
        return <joint.shapes.microtosca.RunTimeLink[]>super.getLinks().filter(link => !this.isGroup(link.getSourceElement()));
    }

    getLinkFromSourceToTarget(source: joint.shapes.microtosca.Node, target: joint.shapes.microtosca.Node): joint.shapes.microtosca.RunTimeLink {
        return (<joint.shapes.microtosca.RunTimeLink[]>super.getLinks()).find(link => {
            var s: string = (<joint.shapes.microtosca.Node>link.getSourceElement()).getName();
            var t: string = (<joint.shapes.microtosca.Node>link.getTargetElement()).getName();
            return s === source.getName() && t === target.getName();
        });
    }

    getServices(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isService(node));
    }

    getComputes(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isCompute(node))
    }

    getDatastore(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isDatastore(node));
    }

    getCommunicationPattern(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isCommunicationPattern(node));
    }

    getEdgeGroups(): joint.shapes.microtosca.EdgeGroup[] {
        return <joint.shapes.microtosca.EdgeGroup[]>this.getGroups().filter(group => this.isEdgeGroup(group));
    }

    getTeamGroups(): joint.shapes.microtosca.SquadGroup[] {
        return <joint.shapes.microtosca.SquadGroup[]>this.getGroups().filter(group => this.isTeamGroup(group));
    }

    getTeam(name: string): joint.shapes.microtosca.SquadGroup {
        return <joint.shapes.microtosca.SquadGroup>this.getTeamGroups().find(group => group.getName() === name);

    }

    getNeighbors(node: joint.shapes.microtosca.Node, opt?: joint.dia.Graph.ConnectionOptions): joint.shapes.microtosca.Root[] {
        let neighbors = super.getNeighbors(node, opt);
        return <joint.shapes.microtosca.Root[]>neighbors;
    }

    getFrontierOfATeam(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Node[] {
        let frontier: joint.shapes.microtosca.Node[] = [];
        team.getMembers().forEach(node => {
            this.getNeighbors(node).forEach(neigh => {
                if (!neigh.isEmbeddedIn(team)) {
                    if (!frontier.find(el => el.id === neigh.id)) {
                        frontier.push(neigh);
                    }
                }
            });
        });
        return frontier;
    }

    getOutboundNeighbors(node: joint.shapes.microtosca.Node): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getNeighbors(node, { outbound: true });
    }

    getInboundNeighbors(client: joint.shapes.microtosca.Node): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getNeighbors(client, { inbound: true });
    }

    getOutgoingLinks(node: joint.shapes.microtosca.Node) {
        return <joint.shapes.microtosca.RunTimeLink[]>this.getConnectedLinks(node, { outbound: true });
    }

    getIngoingLinks(node: joint.shapes.microtosca.Node) {
        return <joint.shapes.microtosca.RunTimeLink[]>(this.getConnectedLinks(node, { inbound: true }));
    }

    getOutgoingLinksOfATeamFrontier(team: joint.shapes.microtosca.SquadGroup) {
        return this.getFrontierOfATeam(team)
                          .map((fnode) => this.getIngoingLinks(fnode) // Map frontier nodes to their ingoing links
                                              .filter(link => link.getSourceElement().isEmbeddedIn(team))) // filter by the interesting ones
                          // put everything in one (iterable) array
                          .reduce((others: joint.shapes.microtosca.RunTimeLink[], links: joint.shapes.microtosca.RunTimeLink[]) => others.concat(links), []);
    }

    getIngoingLinksOfATeamFrontier(team: joint.shapes.microtosca.SquadGroup) {
        return this.getFrontierOfATeam(team)
                          .map((fnode) => this.getOutgoingLinks(fnode) // Map frontier nodes to their ingoing links
                                              .filter(link => link.getTargetElement().isEmbeddedIn(team))) // filter by the interesting ones
                          // put everything in one (iterable) array
                          .reduce((others: joint.shapes.microtosca.RunTimeLink[], links: joint.shapes.microtosca.RunTimeLink[]) => others.concat(links), []);
    }

    addTeamGroup(name: string): joint.shapes.microtosca.SquadGroup {
        let g = new joint.shapes.microtosca.SquadGroup();
        g.setName(name);
        g.addTo(this);
        return g;
    }

/*     unembedMemberFromTeamGroup(team:joint.shapes.microtosca.SquadGroup){
        team.getMembers().forEach(node => team.unembed(node));
    } */

    addEdgeGroup(name: string, nodes: joint.shapes.microtosca.Node[]) {
        let g = new joint.shapes.microtosca.EdgeGroup();
        g.setName(name);
        g.setExternalUserName("Ext user"); // default name for the external user node
        g.addTo(this);
        nodes.forEach(node => {
            this.addRunTimeInteraction(g, node);
        });
        return g;
    }

    addNode(node) {
        if (this.isService(node))
            return this.addService(node);
        else if (this.isDatastore(node))
            return this.addDatastore(node);
        else if (this.isMessageBroker(node))
            return this.addMessageBroker(node);
        else if (this.isMessageRouter(node))
            return this.addMessageRouter(node);
        else
            throw new Error(`Node type ${node} not recognized`);
    }

    getCenteredPoint(e: joint.dia.Element, topLeftCorner: g.Point): g.Point {
        let x = topLeftCorner.x;
        let y = topLeftCorner.y;
        let size = e.size();
        let centerX = x-(size.width/2);
        let centerY = y-(size.height/2);
        return new g.Point(centerX, centerY);
    }

    addService(name: string, position?: g.Point, team?: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Service {
        let service = new joint.shapes.microtosca.Service();
        service.setName(name);
        if(position) {
            let center = this.getCenteredPoint(service, position);
            service.position(center.x, center.y);
        }
        service.addTo(this);
        if(team) {
            team.addMember(service);
        }
        return service;
    }

    addCompute(name: string): joint.shapes.microtosca.Compute {
        let compute = new joint.shapes.microtosca.Compute();
        compute.setName(name);
        compute.addTo(this);
        return compute;
    }

    addDatastore(name: string, position?: g.Point, team?: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Datastore {
        let database = new joint.shapes.microtosca.Datastore();
        database.resize(75, 100);
        if(position) {
            let center = this.getCenteredPoint(database, position);
            database.position(center.x, center.y);
        }
        database.topRy('20%');
        database.setName(name);
        database.addTo(this);
        if(team) {
            team.addMember(database);
        }
        return database;
    }

    addCommunicationPattern(name: string, type: string, position?: g.Point, team?: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.CommunicationPattern {
        let cp = new joint.shapes.microtosca.CommunicationPattern();
        console.log(cp);
        cp.setName(name);
        cp.setType(type);
        if(position) {
            let center = this.getCenteredPoint(cp, position);
            cp.position(center.x, center.y);
        }
        cp.addTo(this);
        if(team) {
            team.addMember(cp);
        }
        return cp;
    }


    addMessageRouter(name: string, position?: g.Point): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "MR", position);
    }

    addMessageBroker(name: string, position?: g.Point): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "MB", position);
    }

    addApiGateway(name: string, position?: g.Point): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "ApiGateway", position);
    }

    addServiceDiscovery(name: string, position?: g.Point): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "ServiceDiscovery", position);
    }

    addCircuitBreaker(name: string, position?: g.Point): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "CircuitBreaker", position);
    }

    addRunTimeInteraction(source: joint.shapes.microtosca.Node, target: joint.shapes.microtosca.Node, timedout: boolean = false, with_circuit_breaker: boolean = false, with_dynamic_discovery: boolean = false): joint.shapes.microtosca.RunTimeLink {

        let alredyExistingLink = this.getLinkFromSourceToTarget(source, target);
        if (alredyExistingLink)
            return alredyExistingLink;
        else {
            var link = new joint.shapes.microtosca.RunTimeLink({
                source: { id: source.id },
                target: { id: target.id },
            });
            link.setTimedout(timedout);
            link.setCircuitBreaker(with_circuit_breaker);
            link.setDynamicDiscovery(with_dynamic_discovery);
            this.addCell(link);
            return link;
        }
    }

    addDeploymentTimeInteraction(source: joint.dia.Cell, target: joint.dia.Cell): joint.shapes.standard.Link {
        var link = new joint.shapes.microtosca.DeploymentTimeLink({
            source: { id: source.id },
            target: { id: target.id },
        });
        this.addCell(link);
        return link;
    }

    isNode(node: joint.dia.Cell): boolean {
        return this.isService(node) || this.isDatastore(node) || this.isCommunicationPattern(node) || this.isCompute(node);
    }

    isGroup(group: joint.dia.Cell): boolean {
        return this.isTeamGroup(group) || this.isEdgeGroup(group);
    }

    isTeamGroup(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.SquadGroup";
        // return node instanceof joint.shapes.microtosca.SquadGroup;
    }

    isEdgeGroup(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.EdgeGroup";
        // return node instanceof joint.shapes.microtosca.Group;
    }

    isService(node: joint.dia.Cell): boolean {
        return node.attributes['type'] == "microtosca.Service";
        // return node instanceof joint.shapes.microtosca.Service;
    }

    isCompute(node: joint.dia.Cell): boolean {
        return node.attributes['type'] == 'microtosca.Compute';
    }

    isDatastore(node: joint.dia.Cell): boolean {
        return node.attributes['type'] == "microtosca.Datastore";
        // return node instanceof joint.shapes.microtosca.Datastore;
    }

    isCommunicationPattern(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.CommunicationPattern";
        // return node instanceof joint.shapes.microtosca.CommunicationPattern;
    }

    isMessageBroker(node: joint.shapes.microtosca.Node) {
        //return node instanceof joint.shapes.microtosca.Co;
        // return (<joint.shapes.microtosca.CommunicationPattern>node).getType() == "MB";
   
         return node.attr('type/text')== "MB"; //microtosca.CommunicationPattern";
    }

    isMessageRouter(node: joint.dia.Cell) {
        // return (<joint.shapes.microtosca.CommunicationPattern>node).getType() == "MR";
        //  return node.attributes['type'] == "MR"; //microtosca.CommunicationPattern";
        return node.attr('type/text')=="MR";
    }

    isInteractionLink(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.RunTimeLink";
    }

    getSubgraphFromNodes(nodes: joint.dia.Cell[]) {
        console.log("in getSubgraphFromNodes nodes is " + nodes);
        return this.getSubgraph(nodes, { deep: true });
    }

    showOnlyTeam(team: joint.shapes.microtosca.SquadGroup) {
        this.hideGraph();
        console.log("in showOnlyTeam team is " + team);
        console.log("got members: " + team.getMembers());
        var cells = this.getSubgraphFromNodes(team.getMembers());
        console.log("in showOnlyTeam cells is " + cells);
        cells.forEach(cell => cell.attr("./visibility","visible")); // cell.set("hidden", false));
        this.showTeamBox(team);
        //team.set("hidden", false);
    }

    maximizeTeam(team: joint.shapes.microtosca.SquadGroup) {
        var links = this.getInternalLinksOfTeam(team);
        links.forEach(link =>   link.attr("./visibility", "visible"))
        team.getMembers().forEach(node => {
            node.attr("./visibility", "visible");
            node.resize(70,70);
            node.position(node.get('posXRelTeam'), node.get("posYRelTeam"), { parentRelative: true });
        })
        team.setMaximize();
        team.resize(100, 100);
        team.fitEmbeds({ padding: Graph.TEAM_PADDING })
    }

    minimizeTeam(team: joint.shapes.microtosca.SquadGroup) {
        var links = this.getInternalLinksOfTeam(team);

        links.forEach(link => {
            link.attr("./visibility", "hidden");
        })
        var teamPos = team.position()

        team.getMembers().forEach(node => {
            // node.set('hidden', true);
            node.attr("./visibility", "hidden");
            var point = new joint.g.Point(team.get('position')).difference(node.get('position'))
            node.set('posXRelTeam', point.x);
            node.set('posYRelTeam', point.y);
            node.scale(0, 0, { x: teamPos.x, y: teamPos.y });
        })
        team.setMinimize()
        team.resize(10, 10);
        team.position(teamPos.x, teamPos.y);
        team.fitEmbeds({ padding: Graph.TEAM_PADDING })
    }

    hideTeamBox(team: joint.shapes.microtosca.SquadGroup) {
        //team.attr("./visibility", "hidden");
        team.hide();
    }

    showTeamBox(team: joint.shapes.microtosca.SquadGroup) {
        //team.attr("./visibility", "visible");
        team.show();
        team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    }

    hideAllTeamBoxes() {
        for(let t of this.getTeamGroups()) {
            this.hideTeamBox(t);
        }
    }

    showAllTeamBoxes() {
        for(let t of this.getTeamGroups()) {
            this.showTeamBox(t);
        }
    }

    minimizeAllTeams() {
        this.getTeamGroups().forEach(team => {
            this.minimizeTeam(team);
        })
    }

    maximizeAllTeams() {
        this.showGraph();
        this.getTeamGroups().forEach(team => {
            this.maximizeTeam(team);
        })
    }

    showGraph() {
        super.getCells().forEach(cell => cell.attr("./visibility","visible"));
      //  super.getCells().forEach(cell => cell.set("hidden", false));
    }

    hideGraph() {
        super.getCells().forEach(cell => cell.attr("./visibility", "hidden"));
        //super.getCells().forEach(cell => cell.set("hidden", true));
    }

    showRunTimeLink(link: joint.shapes.microtosca.RunTimeLink) {
        link.attr("./visibility", "visible");
    }

    hideRunTimeLink(link: joint.shapes.microtosca.RunTimeLink) {
        link.attr("./visibility", "hidden");
    }

    getInternalLinksOfTeam(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.RunTimeLink[] {
        var links = [];
        team.getMembers().forEach(node => {
            this.getConnectedLinks(node, { outbound: true }).forEach(link => {
                if (link.getTargetElement().isEmbeddedIn(team)) {
                    links.push(link);
                }
            })
            this.getConnectedLinks(node, { inbound: true }).forEach(link => {
                if (link.getSourceElement().isEmbeddedIn(team)) {
                    links.push(link);
                }
            })
        })
        console.log(links);
        return links;
    }

    isNodeOwnedByTeam(node: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
        return node.isEmbeddedIn(team);
    }

    getTeamOfNode(node: joint.shapes.microtosca.Node): joint.shapes.microtosca.SquadGroup {
        return <joint.shapes.microtosca.SquadGroup>node.getParentCell();
    }

    builtFromJSON(json: string) {
        // var g = new Graph(json['name']);
        this.name = json['name'];
        json['nodes'].forEach(node => {
            if (node.type == "service")
                this.addService(node.name)
            else if (node.type == "compute")
                this.addCompute(node.name)
            else if (node.type == "datastore")
                this.addDatastore(node.name);
            else if (node.type == "messagebroker")
                this.addMessageBroker(node.name);
            else if (node.type == "messagerouter")
                this.addMessageRouter(node.name);
            else
                throw new Error(`Node type of ${node.name} not recognized`);
        });
        json['links'].forEach((link) => {
            // if (link.type == "deploymenttime")
            //     this.addDeploymentTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
            // else if (link.type = "runtime") {
            //     this.addRunTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']), link['timeout'],  link['circuit_breaker'], link['dynamic_discovery'], );
            // }

            if (link.type == "interaction")
                // TODO: Change to add InteractionLink
                this.addRunTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']), link['timeout'], link['circuit_breaker'], link['dynamic_discovery'], );
            else if (link.type == "deployed_on")
                this.addDeploymentTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
            else
                throw new Error(`Link type of ${link.type} not recognized`);

        });
        json['groups'].forEach(group => {
            let group_name = group['name'];
            let group_type = group['type'];
            if (group_type == "edgegroup") {
                let nodes: joint.shapes.microtosca.Node[] = [];
                group.members.forEach(member => {
                    nodes.push(this.getNode(member))
                });
                this.addEdgeGroup(group_name, nodes);
            }
            else if (group_type == "squadgroup") {
                let nodes: joint.shapes.microtosca.Node[] = [];
                group.members.forEach(member => {
                    nodes.push(this.getNode(member))
                });
                var team = this.addTeamGroup(group_name);
                nodes.forEach(node => {
                    let prevTeam = this.getTeamOfNode(node);
                    if(prevTeam)
                        prevTeam.removeMember(node); // only one team per node (last one)
                    team.addMember(node);
                });

            }
            else
                throw new Error(`Group type ${group_type} not recognized`);
        })
    }

    toJSON() {
        var name = this.name == '' ? 'untitled' : this.name;
        var data: Object = { 'name': name, 'nodes': [], 'links': [], 'groups': [] };
        this.getNodes().forEach((node: joint.shapes.microtosca.Node) => {
            var dnode = { 'name': node.getName() };
            if (this.isService(node))
                dnode['type'] = "service";
            else if (this.isCompute(node))
                dnode['type'] = "compute"
            else if (this.isDatastore(node))
                dnode['type'] = "datastore";
            else if (this.isMessageBroker(node))
                dnode['type'] = "messagebroker"
            else if (this.isMessageRouter(node))
                dnode['type'] = "messagerouter"
            else
                throw new Error(`Node type of ${node.getName()} not recognized`);
            data['nodes'].push(dnode);
        })
        // Add links
        this.getLinks().forEach((link: joint.shapes.microtosca.RunTimeLink) => {
            var dlink = {
                'source': (<joint.shapes.microtosca.Node>link.getSourceElement()).getName(),
                'target': (<joint.shapes.microtosca.Node>link.getTargetElement()).getName(),
                'timeout': link.hasTimeout(),
                "dynamic_discovery": link.hasDynamicDiscovery(),
                "circuit_breaker": link.hasCircuitBreaker()

            }
            // if (link instanceof joint.shapes.microtosca.RunTimeLink)
            //     dlink['type'] = "runtime";
            // else if (<any>link instanceof joint.shapes.microtosca.DeploymentTimeLink)
            //     dlink['type'] = "deploymenttime";

            // TODO: Change to Interaction Link
            if (link instanceof joint.shapes.microtosca.RunTimeLink)
                dlink['type'] = "interaction";
            else
                throw new Error(`Link type of ${link} not recognized`);
            data['links'].push(dlink);
        })
        this.getLinks
        // Add EdgeGroups
        this.getEdgeGroups().forEach(node => {
            var edgeGroup = { 'name': node.getName(), 'type': 'edgegroup', "members": [] }; // 'id': node.get('id'),
            let members = [];
            this.getOutboundNeighbors(node).forEach(neigbor => {
                members.push((<joint.shapes.microtosca.Node>neigbor).getName());
            })
            edgeGroup['members'] = members;
            data['groups'].push(edgeGroup)
        });
        // add SquadGroups
        this.getTeamGroups().forEach(group => {
            var squadGroup = { 'name': group.getName(), 'type': 'squadgroup', "members": [] }
            let members = [];
            group.getEmbeddedCells().forEach(cell => {
                members.push((<joint.shapes.microtosca.Node>cell).getName());
            });
            squadGroup['members'] = members;
            data['groups'].push(squadGroup);
        })
        return data;
    }

    clearGraph(){
        this.clear();
        this.addEdgeGroup("adad",[]);
    }

    applyLayout(rankdir: string) {
        var nodeSepator = 50;
        var edgeSepator = 50;
        var rankSeparator = 50;
        var setVertices = false;
        // rankdir: one of "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left))
        switch (rankdir) {
            case "TB": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "TB",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            case "BT": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "BT",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            case "LR": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "LR",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            case "RL": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "RL",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            default: {
                break;
            }
        }

        this.getTeamGroups().forEach((team) => team.fitEmbeds({padding: Graph.TEAM_PADDING}));
    }


}
