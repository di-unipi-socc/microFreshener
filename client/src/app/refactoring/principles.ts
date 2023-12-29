export interface SmellRequest {
    id?: number;
    name?: string;
    description?: string;
}

export interface PrincipleRequest {
    id?: number;
    name?: string;
    smells?: SmellRequest[];
}