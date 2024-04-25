import React from 'react';
import Select from 'react-select';

const SearchDropdown = ({ value, shownValue, options, shownOptions, onSelect }) => {
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

    // Custom styles to hide the first option
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            display: state.data.value === 0 ? 'none' : 'block', // Hide the first option
        }),
        clearIndicator: (provided) => ({
            ...provided,
            padding: '4px' // Adjust the padding of the clear indicator button
        })
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
            />
            {/* <div>value: {value}</div>
            <div>shownValue: {shownValue}</div> */}
        </>
    );
};

export default SearchDropdown;
