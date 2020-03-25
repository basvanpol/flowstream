import { FlowVM } from '../../../models/flow';
import { Action } from '@ngrx/store';

export const SAVE_FLOW = 'SAVE_FLOW';
export const SAVE_FLOW_RESULT = 'SAVE_FLOW_RESULT';
export const DELETE_FLOW = 'DELETE_FLOW';
export const DELETE_FLOW_RESULT = 'DELETE_FLOW_RESULT';
export const RETRIEVE_FLOWS = 'RETRIEVE_FLOWS';
export const RETRIEVE_FLOWS_SUCCESS = 'RETRIEVE_FLOWS_SUCCESS';
export const RETRIEVE_FLOW_POSTS = 'RETRIEVE_FLOW_POSTS';
export const RETRIEVE_FLOW_POSTS_SUCCESS = 'RETRIEVE_FLOW_POSTS_SUCCESS';
export const FLOW_DATA_ERROR = 'FLOW_DATA_ERROR';
export const GET_INVITE_URL = 'GET_INVITE_URL';
export const GET_INVITE_URL_SUCCESS = 'GET_INVITE_URL_SUCCESS';
export const GET_INVITE_URL_FAIL = 'GET_INVITE_URL_FAIL';

export class SaveFlow implements Action {
    readonly type = SAVE_FLOW;
    constructor(public payload: FlowVM) { }
}
export class SaveFlowResult implements Action {
    readonly type = SAVE_FLOW_RESULT;
    constructor(public payload: FlowVM[]) { }
}
export class DeleteFlow implements Action {
    readonly type = DELETE_FLOW;
    constructor(public payload: number) { }
}
export class DeleteFlowResult implements Action {
    readonly type = DELETE_FLOW_RESULT;
    constructor(public payload: FlowVM[]) { }
}
export class RetrieveFlows implements Action {
    readonly type = RETRIEVE_FLOWS;
}
export class RetrieveFlowsSuccess implements Action {
    readonly type = RETRIEVE_FLOWS_SUCCESS;
    constructor(public payload: FlowVM[]) { }
}
export class RetrieveFlowPosts implements Action {
    readonly type = RETRIEVE_FLOW_POSTS;
    constructor(public payload: number) { }
}
export class RetrieveFlowPostsSuccess implements Action {
    readonly type = RETRIEVE_FLOW_POSTS_SUCCESS;
    constructor(public payload: any) { }
}
export class FlowDataError implements Action {
    readonly type = FLOW_DATA_ERROR;
    constructor(public payload: string) { }
}
export class GetInviteUrl implements Action {
    readonly type = GET_INVITE_URL;
    constructor(public payload: string) { }
}
export class GetInviteUrlSuccess implements Action {
    readonly type = GET_INVITE_URL_SUCCESS;
    constructor(public payload: string) { }
}
export class GetInviteUrlFail implements Action {
    readonly type = GET_INVITE_URL_FAIL;
    constructor(public payload: string) { }
}
export type FlowActions = SaveFlow | SaveFlowResult | DeleteFlow | DeleteFlowResult | RetrieveFlowPosts |
RetrieveFlowPostsSuccess | RetrieveFlows | RetrieveFlowsSuccess | FlowDataError | GetInviteUrl | GetInviteUrlSuccess | GetInviteUrlFail;

