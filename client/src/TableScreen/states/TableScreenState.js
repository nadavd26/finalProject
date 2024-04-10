import { useState } from 'react';

export const useTableScreenState = () => {
    const [get, setState] = useState({
        is1Generated: false,
        is2Generated: false,
        tableNum: 1,
        currentDay: "Sunday"
    });

    const setCurrentDay = (day) => {
        setState(prevState => ({
            ...prevState,
            currentDay: day,
        }));
    };

    const setIs1Generated = (value) => {
        setState(prevState => ({
            ...prevState,
            is1Generated: value
        }));
    };

    const setIs2Generated = (value) => {
        setState(prevState => ({
            ...prevState,
            is2Generated: value
        }));
    };

    const setTableNum = (num) => {
        setState(prevState => ({
            ...prevState,
            tableNum: num
        }));
    };

    return {
        get,
        setIs1Generated,
        setIs2Generated,
        setTableNum,
        setCurrentDay
    };
};
