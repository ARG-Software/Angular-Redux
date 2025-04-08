import { reducer, initialState } from './downtime.reducer';
import {
    GetDowntimeData,
    GetDowntimeDataSuccess,
    GetDowntimeDataSelectBoxesSuccess,
    DowntimeFailure
} from '../actions/downtime.actions';
import { MachiningRequestModelUIFactory, DowntimeDataModelUIFactory } from '../models/downtime.models';
import { generateProductSelectBoxResponseFromApi, generateMachineSelectBoxResponseFromApi } from '../effects/downtime.effects.spec';
import { convertApiDataToSelectBoxes } from '../effects/downtime.effects';

describe('Downtime Reducer', () => {

    const mockedRequest = MachiningRequestModelUIFactory.build();
    const mockedDowntimeData = DowntimeDataModelUIFactory.build();
    const mockedSelectBoxesData = convertApiDataToSelectBoxes(
        [
            generateMachineSelectBoxResponseFromApi(),
            generateProductSelectBoxResponseFromApi()
        ]
    );

    describe('Undefined Action', () => {
        it('should return the default state', () => {

            const action = { type: 'Not defined action' } as any;
            const result = reducer(undefined, action);

            expect(result).toEqual(initialState);
        });
    });

    describe('[Downtime] Get Downtime data for select boxes Success', () => {
        it('should save select boxes data (machine and product)', () => {

            const action = new GetDowntimeDataSelectBoxesSuccess(mockedSelectBoxesData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                machineSelectBox: Object.assign([], initialState.machineSelectBox, action.payload[0]),
                productSelectBox: Object.assign([], initialState.productSelectBox, action.payload[1]),
            });
        });
    });

    describe('[Downtime] Get Downtime Data', () => {
        it('should save requested paging properties', () => {

            const action = new GetDowntimeData(mockedRequest);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                downtimeTableData: {
                    ...initialState.downtimeTableData,
                    RequestedPaging: Object.assign({}, initialState.downtimeTableData.RequestedPaging, action.payload.Paging)
                }
            });
        });
    });

    describe('[Downtime] Get Downtime Data Success', () => {
        it('should return downtime data for chart and table, add a new paging object to CurrentPaging and reset to null the RequestedPaging', () => {

            const action = new GetDowntimeDataSuccess(mockedDowntimeData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                downtimeTableData: {
                    Information: Object.assign([], action.payload.Table.Information),
                    CurrentPaging: Object.assign({}, initialState.downtimeTableData.RequestedPaging),
                    RequestedPaging: null,
                },
                downtimeChartData: Object.assign({}, action.payload.Chart),
            });
        });
    });

    describe('[Downtime] Downtime Failed', () => {
        test('it should return actual state if failure action is dispatched and reset to null the RequestedPaging', () => {

            const action = new DowntimeFailure({});
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                downtimeTableData: {
                    ...initialState.downtimeTableData,
                    RequestedPaging: null,
                }
            });
        });
    });
});
