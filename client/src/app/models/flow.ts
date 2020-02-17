export enum FlowViewTypes {
    GRID = 0,
    CATALOGUE = 1,
    TIMELINE = 2,
    LIST = 3
}

export interface FlowVM {
    _id: number;
    title: string;
    // flowViewType: FlowViewTypes.GRID | FlowViewTypes.CATALOGUE | FlowViewTypes.TIMELINE | FlowViewTypes.LIST;
}
