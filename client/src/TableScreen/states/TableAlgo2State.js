import { useState } from 'react';

export const useTableAlgo2State = () => {
    const defaultBooleanArray = new Array(48).fill(false);
    const worksAndShiftsUntilLoaded = new Array(10).fill({ name: '\n\n', shifts: defaultBooleanArray });
    const [get, setState] = useState({currentWorkersAndShifts : worksAndShiftsUntilLoaded});

    const setCurrentDay = (day) => {
        setState(prevState => ({
            ...prevState,
            currentDay: day,
        }));
    };

    const setCurrentWorkersAndShifts = (value) => {
        setState(prevState => ({
            ...prevState,
            currentWorkersAndShifts: value,
        }));
    };

    return { get,setCurrentWorkersAndShifts };
};
