import plotly.graph_objects as go
import numpy as np
import random

# Initialize array with 48 values for x
x = []

# Generate times with half-hour intervals
hour = 0
minute = 0
for _ in range(48):
    x.append(f"{hour:02d}:{minute:02d}")
    minute += 30
    if minute >= 60:
        hour += 1
        minute = 0

# Generate random arrays of length 48 for y_data
y_data = [np.random.randint(0, 100, size=48) for _ in range(4)]

# Create traces for each y_data
traces = []
for i, y in enumerate(y_data):
    traces.append(go.Bar(x=x, y=y, name=f'Shift {i+1}'))

# Create layout
layout = go.Layout(
    title='Employee Count by Shifts',
    xaxis=dict(title='Time'),
    yaxis=dict(title='Num Of Employees'),
    barmode='stack',
)

# Add a horizontal line above each bar
shapes = []
l = 1/(6*len(x))
for i in range(len(x)):
    r = random.randint(50, 200)
    shapes.append({'type': 'line','xref': 'paper', 'x0': i/len(x)+l, 'y0': r, 'x1': (i+1)/len(x)-l, 'y1': r, 'line': {'color': 'black', 'width': 3}})

# Create figure
fig = go.Figure(data=traces, layout=layout)
fig.update_layout(shapes=shapes)
fig.layout.xaxis.fixedrange = True
fig.layout.yaxis.fixedrange = True

# Save the plot as HTML file
fig.write_html('plot.html', include_plotlyjs='cdn', config={'displayModeBar': False, 'scrollZoom': False})
