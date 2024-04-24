import { useState } from 'react';

export const useTableAlgo1State = () => {
    const [get, setState] = useState({ currentSkill: "", otherSkills: [], worksPerShift: null, req: null ,key: ""});

    const setCurrentSkill = (skill) => {
        setState(prevState => ({
            ...prevState,
            currentSkill: skill,
        }));
    };

    const setOtherSkills = (arr) => {
        setState(prevState => ({
            ...prevState,
            otherSkills: arr,
        }));
    };

    const setWorksPerShift = (arr) => {
        setState(prevState => ({
            ...prevState,
            worksPerShift: arr,
        }));
    };

    const setReq = (arr) => {
        setState(prevState => ({
            ...prevState,
            req: arr,
        }));
    };

    const setKey = (arr) => {
        setState(prevState => ({
            ...prevState,
            worksPerShift: arr,
        }));
    };

    return { get, setCurrentSkill, setOtherSkills, setWorksPerShift, setKey, setReq};
};
