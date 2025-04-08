import { reducer, initialState } from './process-detail.reducer';
import {
    GetProcessDetailData,
    GetProcessDetailDataSuccess,
    GetProcessDetailDataSelectBoxesSuccess,
    ProcessDetailFailure
} from '../actions/process-detail.actions';
import { ProcessDetailDataModelUIFactory } from '../models/process-detail.models';
import { MachiningRequestModelUIFactory } from '../models/downtime.models';
import { generateMachineSelectBoxResponseFromApi } from '../effects/downtime.effects.spec';
import { convertApiDataToSelectBox } from '../effects/process-detail.effects';

describe('Process Detail Reducer', () => {

    const mockedRequest = MachiningRequestModelUIFactory.build();
    const mockedProcessDetailData = ProcessDetailDataModelUIFactory.build();
    const mockedSelectBoxData = convertApiDataToSelectBox(
        generateMachineSelectBoxResponseFromApi()
    );

    describe('Undefined Action', () => {
        it('should return the default state', () => {

            const action = { type: 'Not defined action' } as any;
            const result = reducer(undefined, action);

            expect(result).toEqual(initialState);
        });
    });

    describe('[Process Detail] Get process detail data for select boxes Success', () => {
        it('should save select boxes data product', () => {

            const action = new GetProcessDetailDataSelectBoxesSuccess(mockedSelectBoxData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                machineSelectBox: Object.assign([], initialState.machineSelectBox, action.payload),
            });
        });
    });

    describe('[Process Detail] Get Process Detail Data', () => {
        it('should save requested paging properties', () => {

            const action = new GetProcessDetailData(mockedRequest);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                processDetailTableData: {
                    ...initialState.processDetailTableData,
                    RequestedPaging: Object.assign({}, initialState.processDetailTableData.RequestedPaging, action.payload.Paging)
                }
            });
        });
    });

    describe('[Process Detail] Get Process Detail Data Success', () => {
        it('should return downtime data for chart and table, add a new paging object to CurrentPaging and reset to null the RequestedPaging', () => {

            const action = new GetProcessDetailDataSuccess(mockedProcessDetailData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                processDetailTableData: {
                    Information: Object.assign([], action.payload.Table.Information),
                    CurrentPaging: Object.assign({}, initialState.processDetailTableData.RequestedPaging),
                    RequestedPaging: null,
                },
                processDetailChartData: Object.assign([], action.payload.Chart)
            });
        });
    });

    describe('[Process Detail] Process detail failed', () => {
        test('it should return actual state if failure action is dispatched and reset to null the RequestedPaging', () => {

            const action = new ProcessDetailFailure({});
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                processDetailTableData: {
                    ...initialState.processDetailTableData,
                    RequestedPaging: null,
                }
            });
        });
    });
});
