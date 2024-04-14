import { useState } from 'react';

export const useTableAlgo2State = () => {
    const defaultBooleanArray = new Array(48).fill(false);
    const worksAndShiftsUntilLoaded = new Array(10).fill({ name: '\n\n', shifts: defaultBooleanArray });
    const [get, setState] = useState({currentWorkersAndShifts : worksAndShiftsUntilLoaded, shiftInfo : [], shiftsPerWorkers: []});

    const setCurrentWorkersAndShifts = (value) => {
        setState(prevState => ({
            ...prevState,
            currentWorkersAndShifts: value,
        }));
    };

    const setShiftsInfo = (value) => {
        setState(prevState => ({
            ...prevState,
            shiftInfo: value,
        }));
    };

    const setShiftsPerWorkers = (value) => {
        setState(prevState => ({
            ...prevState,
            shiftsPerWorkers: value,
        }));
    };

    return { get,setCurrentWorkersAndShifts, setShiftsInfo, setShiftsPerWorkers };
};
