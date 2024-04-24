import React from 'react';
import Select from 'react-select';
import info from '../Images/info.png';

export default function WorkerDropdown({ value, rowIndex, coloumnIndex, workerList, onCellEdit, color, shiftIndex, getLineInfo }) {
    const buttonStyle = {
        visibility: color === 'white' ? 'hidden' : 'visible'
    };
    var finalColor = color ? color : "white"
    if (color == "red") {
        if (shiftIndex % 2 == 0) {
            finalColor = "pink"
        }
    } else {
        if (shiftIndex % 2 == 1) {
            finalColor = "gray"
        }
    }
    var startIndex = value == "" ? 0 : 1
    var shownValue = value
    if (value == "") {
        shownValue = "not selected";
    }
    // function concatenateArray10Times(arr) {
    //     let result = [];
    //     for (let i = 0; i < 100; i++) {
    //         result = result.concat(arr);
    //     }
    //     return result;
    // }

    // workerList = concatenateArray10Times(workerList)
    // Add a hidden first option
    let options = [];
    if (workerList.length > 0) {
        options = workerList.map(worker => ({
            label: `${worker.name}\n${worker.id}`,
            value: `${worker.name},${worker.id},${worker.color}`,
            color: worker.color
        }));
    } else {
        // Add a non-clickable option when workerList is empty
        options = [{
            label: "Not enough workers",
            value: "",
            isDisabled: true,
            color: 'lightgray' // Set color to light gray
        }];
    }

    // Add a hidden first option
    const hiddenOption = { label: "Hidden Option", value: "", isHidden: true };
    const optionsWithHidden = [hiddenOption, ...options];
    // const hiddenOption = { label: "Hidden Option", value: "", isHidden: true };
    // const optionsWithHidden = [hiddenOption, ...workerList.map(worker => ({ label: `${worker.name}\n${worker.id}`, value: `${worker.name},${worker.id},${worker.color}`, color: worker.color }))];

    const customStyles = {
        option: (provided, state) => {
            let backgroundColor = state.isSelected ? 'lightblue' : state.data.color;
            if (state.isFocused) {
                backgroundColor = state.data.color === 'red' ? '#f35C84' : 'lightblue'; // Change background color to darker pink for red options, lightblue otherwise
            }
            return {
                ...provided,
                backgroundColor: backgroundColor,
                color: 'black', // Set text color to black for all options
                display: state.data.isHidden ? 'none' : 'block', // Hide the hidden option
            };
        },
        control: (provided) => ({
            ...provided,
            width: '80%', // Set width to a fixed value (adjust as needed)
        }),
    };

    return (
        <td id={`cell-${rowIndex}-${coloumnIndex}`} className={`cell100 last-columns worker-dropdown ${color}`}>
            <div className="cell-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className='selection' style={{width: '75%'}}>
                    <Select
                        id={`selectWorker-${rowIndex}`}
                        value={{ label: shownValue, value }}
                        onChange={(selectedOption) => onCellEdit(selectedOption ? selectedOption.value : "", rowIndex)} // Handle null value for clearing
                        options={optionsWithHidden} // Use the options array with the hidden first option
                        styles={customStyles} // Apply custom styles
                        isClearable // Make the Select component clearable
                        menuPosition="fixed" // Ensure menu is positioned fixed to the bottom of the select input
                        menuShouldBlockScroll={true}
                        // closeMenuOnScroll={true}
                    />
                </div>
                <button
                    className="border-0 p-0 no-outline actionButton"
                    onClick={() => getLineInfo(rowIndex)}
                    style={buttonStyle} // Apply button style dynamically and add margin
                >
                    <img src={info} alt="Info Icon" className="img-fluid actionImage worker-dropdown" />
                </button>
            </div>
        </td>
    );

}
