import { reducer, initialState } from './oee.reducer';
import {
    GetOeeData,
    GetOeeDataSuccess,
    GetOeeDataSelectBoxesSuccess,
    OeeFailure
} from '../actions/oee.actions';
import { OeeDataModelUIFactory } from '../models/oee.models';
import { MachiningRequestModelUIFactory } from '../models/downtime.models';
import { generateProductSelectBoxResponseFromApi, generateMachineSelectBoxResponseFromApi } from '../effects/downtime.effects.spec';
import { convertApiDataToSelectBoxes } from '../effects/downtime.effects';

describe('Oee Reducer', () => {

    const mockedRequest = MachiningRequestModelUIFactory.build();
    const mockedOeeData = OeeDataModelUIFactory.build();
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

    describe('[Oee] Get Oee data for select boxes Success', () => {
        it('should save select boxes data (machine and product)', () => {

            const action = new GetOeeDataSelectBoxesSuccess(mockedSelectBoxesData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                machineSelectBox: Object.assign([], initialState.machineSelectBox, action.payload[0]),
                productSelectBox: Object.assign([], initialState.productSelectBox, action.payload[1]),
            });
        });
    });

    describe('[OEE] Get Oee Data', () => {
        it('should save requested paging properties', () => {

            const action = new GetOeeData(mockedRequest);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                oeeTableData: {
                    ...initialState.oeeTableData,
                    RequestedPaging: Object.assign({}, initialState.oeeTableData.RequestedPaging, action.payload.Paging)
                }
            });
        });
    });

    describe('[OEE] Get Oee Data Success', () => {
        it('should return oee data for chart and table, add a new paging object to CurrentPaging and reset to null the RequestedPaging', () => {

            const action = new GetOeeDataSuccess(mockedOeeData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                oeeTableData: {
                    Information: Object.assign([], action.payload.Table.Information),
                    CurrentPaging: Object.assign({}, initialState.oeeTableData.RequestedPaging),
                    RequestedPaging: null,
                },
                oeeChartData: Object.assign([], action.payload.Chart),
            });
       });
    });

    describe('[OEE] Oee Failed', () => {
        test('it should return actual state if failure action is dispatched and reset to null the RequestedPaging', () => {

            const action = new OeeFailure({});
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                oeeTableData: {
                    ...initialState.oeeTableData,
                    RequestedPaging: null,
                }
            });
        });
    });
});
