import React from 'react';
import Select from 'react-select';
import info from '../Images/info.png';

export default function WorkerDropdown({ value, rowIndex, coloumnIndex, workerList, onCellEdit, color, shiftIndex, getLineInfo }) {
    const buttonStyle = {
        visibility: color === 'white' ? 'hidden' : 'visible'
    };

    let finalColor = "white";
    if (color) {
        if (color.includes("red")) finalColor = "red";
        else if (color.includes("orange")) finalColor = "orange";
        else if (color.includes("yellow")) finalColor = "yellow";
    }

    const startIndex = value === "" ? 0 : 1;
    const shownValue = value === "" ? "not selected" : value;

    function getOrder(worker) {
        if (worker.color.includes("red")) return 5;
        if (worker.color.includes("orange")) return 4;
        if (worker.color.includes("yellow")) return 2;
        if (worker.color.includes("green")) return 1;
        return 3; // white
    }

    workerList.sort((a, b) => getOrder(a) - getOrder(b));

    let options = workerList.length > 0
        ? workerList.map(worker => ({
            label: `${worker.name}\n${worker.id}`,
            value: `${worker.name},${worker.id},${worker.color}`,
            color: worker.color || "white"
        }))
        : [{
            label: "Not enough workers",
            value: "",
            isDisabled: true,
            color: 'lightgray'
        }];

    const hiddenOption = { label: "Hidden Option", value: "", isHidden: true };
    const optionsWithHidden = [hiddenOption, ...options];

    const customStyles = {
        option: (provided, state) => {
            let backgroundColor = state.isSelected ? 'lightblue' : state.data.color;
            if (state.isFocused) {
                backgroundColor = !state.data.color
                    ? '#CCF5F0'
                    : state.data.color.includes('red')
                        ? '#f35C84'
                        : state.data.color.includes('orange')
                            ? '#F59669'
                            : state.data.color.includes('yellow')
                                ? '#F3F569'
                                : state.data.color.includes('green')
                                    ? '#1AB621'
                                    : '#CCF5F0';
            }
            return {
                ...provided,
                backgroundColor: backgroundColor,
                color: 'black',
                display: state.data.isHidden ? 'none' : 'block',
            };
        },
        control: (provided) => ({
            ...provided,
            backgroundColor: value === "" ? 'white' : 'lightblue',
            border: '1px solid black',
            width: '100%',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'black',
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: 'black',
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: 'black',
        }),
    };

    const filterOption = (option, searchString) => {
        return option.label.toLowerCase().includes(searchString.toLowerCase());
    };

    return (
        <td id={`cell-${rowIndex}-${coloumnIndex}`} className={`cell100 last-columns worker-dropdown ${finalColor}`}>
            <div className="cell-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className='selection' style={{ width: '75%' }}>
                    <Select
                        id={`selectWorker-${rowIndex}`}
                        value={value === "" ? { label: "not selected", value: "" } : { label: shownValue, value }}
                        onChange={(selectedOption) => onCellEdit(selectedOption ? selectedOption.value : "", rowIndex)}
                        options={optionsWithHidden}
                        styles={customStyles}
                        isClearable
                        menuPosition="fixed"
                        menuShouldBlockScroll={true}
                        filterOption={filterOption} // Apply custom filter function
                    />
                </div>
                <button
                    className="border-0 p-0 no-outline actionButton"
                    onClick={() => getLineInfo(rowIndex)}
                    style={buttonStyle}
                >
                    <img src={info} alt="Info Icon" className="img-fluid actionImage worker-dropdown" />
                </button>
            </div>
        </td>
    );
}
