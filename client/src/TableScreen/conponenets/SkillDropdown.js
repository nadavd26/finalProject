import React from 'react';
import Select from 'react-select';

function SkillDropdown({ currentSkill, skillList, handlerSkill }) {
    // Transform skillList into an array of objects with value and label properties
    const transformedOptions = skillList.map((skill, index) => ({
        value: skill,
        label: skill
    }));

    // Handle selection
    const handleSelect = (selectedOption) => {
        if (selectedOption) {
            handlerSkill(selectedOption.value);
        }
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: 'black', // Set text color of options to black
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white', // Set text color of selected option to white
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#28a745', // Set background color to #28a745
            border: 'none', // Remove border
            width: 'auto', // Set width to auto
            margin: '0px',
            padding: '0px',
            color: 'white', // Set text color of select text to white
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: 'white', // Set separator color to white
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'white', // Set arrow color to white
            padding: '4px' // Change padding of the dropdown indicator to match the example
        }),
        container: (provided) => ({
            ...provided,
            display: 'inline-flex', // Use inline-flex to adjust to the width of the content
            width: 'auto', // Set width to auto
        }),
        menu: (provided) => ({
            ...provided,
            width: 'auto', // Set menu width to auto
        }),
    };
    
    return (
        <Select
            value={{ value: currentSkill, label: currentSkill }} // Set the selected value
            options={transformedOptions} // Set options with labels
            onChange={handleSelect} // Handle selection
            styles={customStyles} // Apply custom styles
            menuShouldBlockScroll={true}
            autoWidth={true} // Set autoWidth to true
        />
    );
}

export default SkillDropdown;
