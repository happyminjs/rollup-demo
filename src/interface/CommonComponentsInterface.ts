export interface QRCodeInterface{
    sidebarNode: HTMLElement;
    houseId?: string;
    agentAreaNode?: HTMLElement;
}

export interface Res{
    code?: number | string;
    message?: string;
    data?: any;
}