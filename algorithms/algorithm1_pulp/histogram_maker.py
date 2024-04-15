import plotly.graph_objects as go
import numpy as np
import random
import sys

# Converts a decimal index representing hours (and halves of hours) into a 24-hour time format.
def index_to_hour(i):
    hour = str(int(i))
    if len(hour) == 1:
        hour = "0" + hour
    minute = "00" if i % 1 == 0 else "30"
    return hour + ":" + minute

# ["00:00-00:30","00:30-01:00",.....,"23:30-24:00"].
def get_hover_template():
    x_values_string = []
    hour = 0
    minute = 0
    hour_next = 0
    minute_next = 0
    for _ in range(48):
        minute_next += 30
        if minute_next >= 60:
            hour_next += 1
            minute_next = 0
        x_values_string.append(f"{hour:02d}:{minute:02d}-{hour_next:02d}:{minute_next:02d}")
        minute = minute_next
        hour = hour_next
    return x_values_string

def hour_to_index(hour):
    hours, minutes = map(int, hour.split(':'))
    return (hours * 2 + (minutes == 30))

# Converts any range of hours in format 'hh:mm' to an array in size 48 (half an hour time interval).
# Filled with num if the hour bigger than the start or equal to it, and smaller than the end. else 0.
def hours_to_array_number(start_hour, end_hour, num):
    start = hour_to_index(start_hour)
    end = hour_to_index(end_hour)
    if end == 0:
        end = 48
    hours_array = [num if start <= i < end else 0 for i in range(48)]
    return hours_array

# Parsing all shifts in the array from [start,end,numberOfEmployeesRequires]
def parse_shifts(shifts):
    new_shifts = []
    for shift in shifts:
        if shift[2] != 0:
            new_shifts.append(hours_to_array_number(shift[0],shift[1],shift[2]))
    return new_shifts

def parse_reqs(reqs):
    new_reqs = [0] * 48
    for req in reqs:
        start = hour_to_index(req[0])
        end = hour_to_index(req[1])
        if end == 0:
            end = 48
        for i in range(start,end):
            new_reqs[i] = req[2]
    return new_reqs


# Arguments:
# Reqs is a 2d array filled with the requests for the relevent range of hours
# Example: [["08:00", "08:30", 50]].
# 
# Shifts is a n*3 2d array, where n is the number of shifts
# Shifts[i][0] and Shifts[i][1] are the start hour and the end hour of the shift
# Shifts[i][2] is the number of employees required for the shift(the output of the first algorithm)
# Example: [["08:00", "11:30", 30]].
def make_a_graph(reqs,shifts):

    fig = go.Figure()
    fig.update_layout(barmode='stack', bargap=0.04)
    fig.layout.xaxis.fixedrange = True
    fig.layout.yaxis.fixedrange = True

    # Generate times with half-hour intervals
    x_values_string = get_hover_template()

    # Create the y values for the histogram
    y_data = parse_shifts(shifts)
    a = [[] for _ in range(len(y_data))]
    min_in_range = 25.0
    max_in_range = -1.0
    for i, y in enumerate(y_data):
        for j, num in enumerate(y):
            for _ in range(num):
                k = j/2.0
                a[i].append(k + 0.25)
                min_in_range = min(min_in_range, k)
                max_in_range = max(max_in_range, k)
        fig.add_trace(go.Histogram(x=a[i], xbins=dict(start=min(a[i])-0.25, end=max(a[i])+0.25, size=0.5),
            hovertemplate="%{customdata}, %{y}",
            customdata=x_values_string[int(min(a[i])*2):],
            name = 'shift ' + str(i+1)))  

    y_values = parse_reqs(reqs)
    for i in range(len(y_values)):
        if y_values[i] != 0:
            min_in_range = min(min_in_range, i/2.0)
            max_in_range = max(max_in_range, i/2.0)
    x_values = []
    for i in np.arange(start=0, stop=24.5, step=0.5):
        x_values.append(i)

    # Create a list to hold traces
    x_all = []
    y_all = []
    custom_data_all = []  # List to hold custom data for scatter trace
    for i in range(len(x_values)-1):
        k = i/2.0
        if k >= min_in_range and k <= max_in_range:
            x_all.extend([x_values[i], x_values[i+1]])
            y_all.extend([y_values[i], y_values[i]])
            # Duplicate each element of x to match the length of x_all
            custom_data_all.extend([x_values_string[i]] * 2)
    fig.add_trace(go.Scatter(x=x_all, y=y_all, mode='lines', line=dict(color='black', width=4), name='Request Line',
            hovertemplate="%{customdata}, %{y}",
            customdata=custom_data_all))
    tickvals = list(range(25))
    ticktext = [index_to_hour(i) for i in range(25)]

    # Update x-axis properties
    fig.update_xaxes(
        title="Time",  # Set x-axis title
        tickvals=tickvals,  # Set tick values
        ticktext=ticktext,  # Set tick text
        tickmode="array",  # Use tickvals and ticktext as specified
        showgrid=True,  # Show grid lines
        gridcolor='lightgray',  # Set grid color
        showline=True,  # Show x-axis line
        linewidth=2,  # Set x-axis line width
        linecolor='black',  # Set x-axis line color
        mirror=True,  # Mirror x-axis line to both sides
        range=[min_in_range,max_in_range+0.5],
        ticks="outside",
        ticklen=5
    )
    # Update y-axis properties
    fig.update_yaxes(
        title="Number Of Employees",  # Set y-axis title
        showgrid=True,  # Show grid lines
        gridcolor='lightgray',  # Set grid color
        showline=True,  # Show y-axis line
        linewidth=2,  # Set y-axis line width
        linecolor='black',  # Set y-axis line color
        mirror=True,  # Mirror y-axis line to both sides
        rangemode='tozero',  # Set y-axis range mode to ensure minimum value is 0
        ticks="outside",
        ticklen=5
    )

    # Save the plot as HTML file
    fig.write_html('plot.html', include_plotlyjs='cdn', config={'displayModeBar': False, 'scrollZoom': False})

# reqs = [
#     # ["00:00", "00:30", 50],
#     # ["00:30", "01:00", 70],
#     ["01:00", "01:30", 90],
#     ["01:30", "02:00", 120],
#     ["02:00", "02:30", 150],
#     ["02:30", "03:00", 200],
#     ["03:00", "03:30", 150],
#     ["03:30", "04:00", 120],
#     ["04:00", "04:30", 90],
#     ["04:30", "05:00", 70],
#     ["05:00", "05:30", 50],
#     ["05:30", "06:00", 70],
#     ["06:00", "06:30", 90],
#     ["06:30", "07:00", 120],
#     ["07:00", "07:30", 150],
#     ["07:30", "08:00", 200],
#     ["08:00", "08:30", 150],
#     ["08:30", "09:00", 120],
#     ["09:00", "09:30", 90],
#     ["09:30", "10:00", 70],
#     ["10:00", "10:30", 50],
#     ["10:30", "11:00", 70],
#     ["11:00", "11:30", 90],
#     ["11:30", "12:00", 120],
#     ["12:00", "12:30", 150],
#     ["12:30", "13:00", 200],
#     ["13:00", "13:30", 150],
#     ["13:30", "14:00", 120],
#     ["14:00", "14:30", 90],
#     ["14:30", "15:00", 70],
#     ["15:00", "15:30", 50],
#     ["15:30", "16:00", 70],
#     ["16:00", "16:30", 90],
#     ["16:30", "17:00", 120],
#     ["17:00", "17:30", 150],
#     ["17:30", "18:00", 200],
#     ["18:00", "18:30", 150],
#     ["18:30", "19:00", 120],
#     ["19:00", "19:30", 90],
#     ["19:30", "20:00", 70],
#     ["20:00", "20:30", 50],
#     ["20:30", "21:00", 70],
#     ["21:00", "21:30", 90],
#     ["21:30", "22:00", 120],
#     ["22:00", "22:30", 150],
#     ["22:30", "23:00", 200]
#     # ["23:00", "23:30", 150],
#     # ["23:30", "24:00", 120]
# ]
# shifts = [["08:00", "11:30", 50], ["12:00", "20:00", 90], ["00:30","19:00",100]]
# make_a_graph(reqs,shifts)
