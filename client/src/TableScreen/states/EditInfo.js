import { useState } from 'react';

export const useEditInfoState = () => {
    const [get, setState] = useState({inEdit: false});

    const setInEdit= (value) => {
        setState(prevState => ({
            ...prevState,
            inEdit: value,
        }));
    };

    return { get, setInEdit };
};
