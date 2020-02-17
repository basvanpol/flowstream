import { EntityState } from '@ngrx/entity';
import { flowAdapter } from './../selectors/flow.selectors';

import { FlowVM, FlowViewTypes } from '../../../models/flow';
import * as FlowActions from '../actions/flow.actions';
import { ActionReducer } from '@ngrx/store';

export interface IFlowState extends EntityState<FlowVM> {
    flows: FlowVM[];
    selectedFlow: FlowVM;
}
export const initialState: IFlowState = flowAdapter.getInitialState({
    flows: [],
    selectedFlow: {
        _id: 0,
        title: ''
        // flowViewType: FlowViewTypes.GRID
    }
});

export function FlowReducer (state = initialState, action: FlowActions.FlowActions) {
    switch (action.type) {
        case FlowActions.SAVE_FLOW_RESULT:
        case FlowActions.RETRIEVE_FLOWS_SUCCESS:
        case FlowActions.DELETE_FLOW_RESULT:
            return flowAdapter.addAll(action.payload, state);
        default:
            return state;
    }
};
