import React from 'react';
import Select from 'react-select';

const SearchDropdown = ({ value, shownValue, options, shownOptions, onSelect, width }) => {
    // Define a function to format the option label
    const formatOptionLabel = (option) => {
        const label = shownOptions[option.value];
        return <div>{label}</div>;
    };

    // Transform options into an array of objects with value and label properties
    const transformedOptions = options.map((option, index) => ({
        value: index,
        label: shownOptions[index]
    }));

    // Find the index of the option with label equal to shownValue
    const defaultIndex = shownOptions.indexOf(shownValue);

    // Set the selected value based on whether value is provided or not
    const selectedValue = value !== undefined ? value : (defaultIndex !== -1 ? defaultIndex : null);

    // Handle selection
    const handleSelect = (selectedOption) => {
        if (selectedOption) {
            const selectedValue = selectedOption.value;
            onSelect(selectedValue);
        } else {
            // If selectedOption is null, set the value to the index of the first option and call onSelect with its index
            onSelect(0);
        }
    };

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            display: state.data.value === 0 ? 'none' : 'block', // Hide the first option
        }),
        clearIndicator: (provided) => ({
            ...provided,
            padding: '4px',
            color: 'black' // Adjust the padding of the clear indicator button
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: value == "" ? 'white' : 'lightblue',
            border: '1px solid black', // Add border to the control
            width: width !== undefined ? width : '100%',
            margin: '0px',
            padding: '0px',
             // Set padding to 0
             // Set width to either the specified value or 100%
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: 'black', // Change color of the vertical line to black
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'black',
            padding: '4px' // Change color of the dropdown indicator to black
        }),
        container: (provided) => ({
            ...provided,
            display: 'flex', // Use flexbox
            justifyContent: 'center', // Center items horizontally
            alignItems: 'center',
            marginLeft: '0px', // Add margin on the left
            padding: '0px',
            marginRight: '0px',
            width: '100%',
             // Add margin on the right // Center items vertically
        }),
    };

    return (
        <>
            <Select
                value={selectedValue !== null ? transformedOptions[selectedValue] : null} // Set the selected value
                options={transformedOptions} // Set options with labels
                formatOptionLabel={formatOptionLabel} // Pass the formatOptionLabel function
                onChange={handleSelect} // Handle selection
                placeholder={shownOptions[0]} // Set the placeholder to the first visible option from shownOptions
                isClearable // Enable the clearable option
                styles={customStyles} // Apply custom styles
                menuShouldBlockScroll={true}
            />
            {/* <div>value: {value}</div>
            <div>shownValue: {shownValue}</div> */}
        </>
    );
};

export default SearchDropdown;
