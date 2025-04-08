import { reducer, initialState, convertShiftGraphicListTodownTimeRecordChartDataModel } from './overview.reducers';
import * as ApiModels from '../../../api/models/apimodels';
import {
    GetDownTimeChartSuccess,
    GetMachineOperationTableSuccess,
    OverviewFailure
} from '../actions/overview.actions';

import {
    generateMachineOperationResponseFromApi,
    generateDowntimeRecordResponseFromApi
} from '../effects/overview.effects.spec';

describe('Statistics Reducer', () => {

    const mockedShiftGraphicData: ApiModels.IShiftGraphicDto[] = generateDowntimeRecordResponseFromApi();
    const mockedRequestTableModel: ApiModels.IMachineOperationsDto[] = generateMachineOperationResponseFromApi();

    describe('Undefined Action', () => {
        it('should return the default state', () => {

            const action = { type: 'Not defined action' } as any;
            const result = reducer(undefined, action);

            expect(result).toEqual(initialState);
        });
    });

    describe('[Overview] Overview Failed', () => {
        it('should return the default state', () => {

            const action = new OverviewFailure({});
            const result = reducer(undefined, action);

            expect(result).toEqual(initialState);
        });
    });

    describe('[Overview] Get DownTime Chart Success', () => {
       it('should return downtime chart data when action GetDownTimeChartSuccess is dispatched', () => {

            const action = new GetDownTimeChartSuccess(mockedShiftGraphicData);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                downTimeRecordChartData: convertShiftGraphicListTodownTimeRecordChartDataModel(action.payload)
            });
        });
    });

    describe('[Overview] Get Machine Operation Table Success', () => {
        it('should return machine operation table data when action GetMachineOperationTable is dispatched', () => {

            const action = new GetMachineOperationTableSuccess(mockedRequestTableModel);
            const result = reducer(initialState, action);

            expect(result).toEqual({
                ...initialState,
                machineOperationTableData: action.payload
            });
        });
    });

});
