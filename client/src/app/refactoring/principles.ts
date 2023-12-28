export interface SmellRequest {
    id?: number;
    name?: string;
    descrition?: string;
}

export interface PrincipleRequest {
    id?: number;
    name?: string;
    smells?: SmellRequest[];
}