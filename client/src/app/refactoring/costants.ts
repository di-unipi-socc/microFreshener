export enum SMELL_NAMES {
    SMELL_ENDPOINT_BASED_SERVICE_INTERACTION = "Endpoint-based-service-interaction",
    SMELL_WOBBLY_SERVICE_INTERACTION_SMELL = "Wobbly-service-interaction",
    SMELL_SHARED_PERSISTENCY = "Shared-persistency",
    SMELL_NO_API_GATEWAY = "No-api-gateway",
    SMELL_SINGLE_LAYER_TEAMS = "Single-layer-teams",
    SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER = "Multiple-services-in-one-container"
}


export enum REFACTORING_NAMES {
  REFACTORING_ADD_SERVICE_DISCOVERY = 'Add-service-discovery',
  REFACTORING_ADD_MESSAGE_ROUTER = 'Add-message-router',
  REFACTORING_ADD_MESSAGE_BROKER = 'Add-message-broker',
  REFACTORING_ADD_CIRCUIT_BREAKER = 'Add-circuit-breaker',
  REFACTORING_USE_TIMEOUT = "Use-timeout",
  REFACTORING_MERGE_SERVICES = "Merge-service",
  REFACTORING_SPLIT_DATASTORE = "Split-Datastore",
  REFACTORING_ADD_DATA_MANAGER = "Add-data-manager",
  REFACTORING_ADD_API_GATEWAY = "Add-api-gateway",
  REFACTORING_SPLIT_TEAMS_BY_SERVICE = "Split-teams-by-service"
}