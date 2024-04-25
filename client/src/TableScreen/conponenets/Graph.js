import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { Modal, Button, Col } from 'react-bootstrap';

const Plot = createPlotlyComponent(Plotly);

const Graph = ({ reqs, shifts, skill, day }) => {
    useEffect(() => {
        makeGraph();
    }, []);

    console.log("reqs")
    console.log(reqs)
    console.log("shifts")
    console.log(shifts)

    const [showModal, setShowModal] = useState(true);

    const makeGraph = () => {

        // Convert hours to index
        const hourToIndex = (hour) => {
            if (typeof hour !== 'string') {
                // Handle the case where hour is not a string
                return -1; // or any other default value
            }
            const [hours, minutes] = hour.split(':');
            return hours * 2 + (minutes === '30' ? 1 : 0);
        };


        // Parse shifts data
        const parseShifts = (shifts) => {
            const newShifts = [];
            for (const shift of shifts) {
                if (shift[4] !== 0) {
                    newShifts.push(hoursToArrayNumber(shift[2], shift[3], shift[4]));
                }
            }
            return newShifts;
        };

        // Convert hours to array number
        const hoursToArrayNumber = (startHour, endHour, num) => {
            const start = hourToIndex(startHour);
            let end = hourToIndex(endHour);
            if (end === 0) {
                end = 48;
            }
            const hoursArray = Array.from({ length: 48 }, (_, i) => (start <= i && i < end) ? num : 0);
            return hoursArray;
        };

        // Parse reqs data
        const parseReqs = (reqs) => {
            const newReqs = Array.from({ length: 48 }, () => 0);
            for (const req of reqs) {
                const start = hourToIndex(req[2]);
                let end = hourToIndex(req[3]);
                if (end === 0) {
                    end = 48;
                }
                for (let i = start; i < end; i++) {
                    newReqs[i] = req[4];
                }
            }
            return newReqs;
        };

        // Get hover template
        const getHoverTemplate = () => {
            const xValuesString = [];
            let hour = 0;
            let minute = 0;
            let hourNext = 0;
            let minuteNext = 0;
            for (let i = 0; i < 48; i++) {
                minuteNext += 30;
                if (minuteNext >= 60) {
                    hourNext += 1;
                    minuteNext = 0;
                }
                xValuesString.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${hourNext.toString().padStart(2, '0')}:${minuteNext.toString().padStart(2, '0')}`);
                minute = minuteNext;
                hour = hourNext;
            }
            return xValuesString;
        };

        const tickvals = Array.from({ length: 25 }, (_, i) => i);
        const ticktext = tickvals.map(i => {
            const hour = Math.floor(i);
            const minute = (i % 1 === 0) ? "00" : "30";
            return `${String(hour).padStart(2, '0')}:${minute}`;
        });

        const figData = [];
        const xValuesString = getHoverTemplate();
        const yData = parseShifts(shifts);
        let minInRange = 25.0;
        let maxInRange = -1.0;
        for (let i = 0; i < yData.length; i++) {
            const a = [];
            for (let j = 0; j < yData[i].length; j++) {
                const k = j / 2.0;
                const kplus = k + 0.25;
                if (yData[i][j]) {
                    minInRange = Math.min(minInRange, k);
                    maxInRange = Math.max(maxInRange, k);
                }
                for (let m = 0; m < yData[i][j]; m++) {
                    a.push(kplus);
                }
            }
            figData.push({
                x: a,
                type: 'histogram',
                xbins: { start: Math.min(...a) - 0.25, end: Math.max(...a) + 0.25, size: 0.5 },
                hovertemplate: "%{customdata}, %{y}",
                customdata: xValuesString.slice(Math.floor(Math.min(...a) * 2), Math.ceil(Math.max(...a) * 2)),
                name: `shift ${i + 1}`
            });
        }

        const yValues = parseReqs(reqs);
        for (let i = 0; i < yValues.length; i++) {
            if (yValues[i] !== 0) {
                minInRange = Math.min(minInRange, i / 2.0);
                maxInRange = Math.max(maxInRange, i / 2.0);
            }
        }

        const xValues = Array.from({ length: 49 }, (_, i) => i / 2);

        let xAll = [];
        let yAll = [];
        let customDataAll = [];
        for (let i = 0; i < xValues.length - 1; i++) {
            const k = xValues[i];
            if (k >= minInRange && k <= maxInRange) {
                xAll = [...xAll, xValues[i], xValues[i + 1]];
                yAll = [...yAll, yValues[i], yValues[i]];
                customDataAll = [...customDataAll, ...Array(2).fill(xValuesString[i])];
            }
        }

        figData.push({
            x: xAll,
            y: yAll,
            mode: 'lines',
            line: { color: 'black', width: 4 },
            name: 'Request Line',
            hovertemplate: "%{customdata}, %{y}",
            customdata: customDataAll
        });

        const config = {
            displayModeBar: false,  // Hide the interactive mode bar
            scrollZoom: false       // Disable scroll zoom
        };

        const layout = {
            barmode: 'stack',
            bargap: 0.04,
            xaxis: {
                title: "Time",              // Set x-axis title
                tickvals: tickvals,         // Set tick values
                ticktext: ticktext,         // Set tick text
                fixedrange: true,
                tickmode: "array",          // Use tickvals and ticktext as specified
                showgrid: true,             // Show grid lines
                gridcolor: 'lightgray',     // Set grid color
                showline: true,             // Show x-axis line
                linewidth: 2,               // Set x-axis line width
                linecolor: 'black',         // Set x-axis line color
                mirror: true,               // Mirror x-axis line to both sides
                range: [0.0, 24.0], // Set axis range
                ticks: "outside",           // Place ticks outside the plot area
                ticklen: 5                  // Set tick length
            },
            yaxis: {
                title: "Number Of Employees", // Set y-axis title
                fixedrange: true,
                showgrid: true,               // Show grid lines
                gridcolor: 'lightgray',       // Set grid color
                showline: true,               // Show y-axis line
                linewidth: 2,                 // Set y-axis line width
                linecolor: 'black',           // Set y-axis line color
                mirror: true,                 // Mirror y-axis line to both sides
                rangemode: 'tozero',          // Set y-axis range mode to ensure minimum value is 0
                ticks: "outside",             // Place ticks outside the plot area
                ticklen: 5                    // Set tick length
            }
        };
        if (minInRange !== 25.0 && maxInRange !== -1.0) {
            layout.xaxis.range = [minInRange, maxInRange + 0.5]
        }
        const fig = {
            data: figData,
            layout: layout,
            config: config   // Include configuration options
        };

        return fig;
    };

    const fig = makeGraph();

    if (reqs.length === 0 && shifts.length === 0) {
        return (
            <>
                <Plot
                    data={fig.data}
                    layout={fig.layout}
                    config={fig.config}
                    style={{ width: '100%', height: '100%' }}
                />
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header>
                        <Modal.Title className="text-danger">No Results</Modal.Title>
                        <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body className="text-danger">No requests at {day} to {skill}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return (
        <div className="Graph">
            <Plot
                data={fig.data}
                layout={fig.layout}
                config={fig.config}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default Graph;