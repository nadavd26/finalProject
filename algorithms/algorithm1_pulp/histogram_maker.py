import plotly.express as px
import plotly.graph_objects as go
import numpy as np
import random

def index_to_hour(i):
    hour = str(int(i))
    if len(hour) == 1:
        hour = "0" + hour
    minute = "00" if i % 1 == 0 else "30"
    return hour + ":" + minute

# Initialize string array with 48 values for x
x_values_string = []
# Generate times with half-hour intervals
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


a = [[] for _ in range(4)]
y_data = [np.random.randint(0, 100, size=48) for _ in range(4)]
for i, y in enumerate(y_data):
    for j, num in enumerate(y):
        for _ in range(num):
            a[i].append(j/2.0+0.25)

fig = go.Figure()
for i,ai in enumerate(a):
    bin_starts = [index_to_hour(i) for i,num in enumerate(y_data)]
    bin_ends = [index_to_hour(i + 0.5) for i,num in enumerate(y_data)]
    fig.add_trace(go.Histogram(x=ai, xbins=dict(start=min(ai)-0.25, end=max(ai)+0.25, size=0.5),
        hovertemplate="%{customdata}, %{y}", 
        customdata=x_values_string,
        name = 'shift '+str(i+1)))

fig.update_layout(barmode='stack', bargap=0.04)
fig.layout.xaxis.fixedrange = True
fig.layout.yaxis.fixedrange = True
x_values = []
y_values = []
for i in np.arange(start=0, stop=24.5, step=0.5):
    x_values.append(i)
    y_values.append(round(random.random() * 200))

# Create a list to hold traces
x_all = []
y_all = []
for i in range(len(x_values)-1):
    x_all.extend([x_values[i], x_values[i+1]])
    y_all.extend([y_values[i], y_values[i]])
# Create a list to hold traces
x_all = []
y_all = []
custom_data_all = []  # List to hold custom data for scatter trace
for i in range(len(x_values)-1):
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
