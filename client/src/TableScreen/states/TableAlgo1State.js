import { useState } from 'react';

export const useTableAlgo1State = () => {
    const [get, setState] = useState({ currentSkill: "", otherSkills: []});

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

    return { get, setCurrentSkill, setOtherSkills};
};
