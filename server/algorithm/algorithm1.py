import pulp
import sys
import json

def parse_json(json_file):
    with open(json_file) as f:
        return json.load(f)

# Converts any hour in format 'hh:mm' to a number between 0 and 47, every half an hour is +1.
def hour_to_index(hour):
    hours, minutes = map(int, hour.split(':'))
    return (hours * 2 + (minutes == 30))

# Converts any range of hours in format 'hh:mm' to an array in size 48 (half an hour time interval).
# Filled with 1 if the hour bigger than the start or equal to it, and smaller than the end. else 0.
def hours_to_array(start_hour, end_hour):

    start = hour_to_index(start_hour)
    end = hour_to_index(end_hour)

    if end == 0:
        end = 48

    hours_array = [1 if start <= i < end else 0 for i in range(48)]

    return hours_array

# Parse JSON string to Python object
def parse_json(json_string):
    try:
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        sys.exit(1)

# Arguments:
# Reqs is a 2d array filled with the employees required for a day, a skill, and range of hours.
# Example: ["sunday", "cable technition", "00:00", "00:30", 50].
# 
# Shifts is a 2d array filled with the the cost of the shift, the day, the skill,
# And range of hours the shift is happening at.
# Example ["sunday", "cable technition", "08:00", "12:00", 150].
def solve_shifts(reqs, shifts):
    # Dont print msgs
    pulp.LpSolverDefault.msg = 0

    skills = []
    # Get distinct skills in skills array
    for item in reqs:
        if item[1] not in skills:
            skills.append(item[1])

    days = []
    # Get distinct days in days array
    for item in reqs:
        if item[0] not in days:
            days.append(item[0])

    # Create maps for day and skill
    day_mapping = {day: index for index, day in enumerate(days)}
    skill_mapping = {skill: index for index, skill in enumerate(skills)}

    # Init array of shifts per skill and day
    shifts_array = [[[] for _ in range(len(skill_mapping))] for _ in range(len(day_mapping))]
    output_array = [[[] for _ in range(len(skill_mapping))] for _ in range(len(day_mapping))]

    # Fill in the 3D shifts array with the corresponding values
    for shift in shifts:
        day_index = day_mapping.get(shift[1], -1)
        skill_index = skill_mapping.get(shift[0], -1)
        if(skill_index == -1 or day_index == -1):
            raise ValueError("Error filling the shifts array")

        hours = hours_to_array(shift[2], shift[3])
        cost = int(shift[4])
        # Per each shift, append the hours and the cost of it, to the relevent day and skill.
        shifts_array[day_index][skill_index].append((hours, cost))
        output_array[day_index][skill_index].append([shift[1], shift[0], shift[2], shift[3], "-1"])

    requests_array = [[[0 for _ in range(48)] for _ in range(len(skill_mapping))] for _ in range(len(day_mapping))]

    # Per each day and skill, update the requested employees.
    for req in reqs:
        day_index = day_mapping.get(req[0], -1)
        skill_index = skill_mapping.get(req[1], -1)
        if(skill_index == -1 or day_index == -1):
            raise ValueError("Error filling the requests array")
        start = hour_to_index(req[2])
        end = hour_to_index(req[3])
        if(end == 0):
            end = 48
        for i in range(start, end):
            requests_array[day_index][skill_index][i] = int(req[4])

    # Per each day and skill, solve the problem using pulp.
    for day in range(len(day_mapping)):
        for skill in range(len(skill_mapping)):
            num_shifts = len(shifts_array[day][skill])
            time_intervals = 48
            # Requests for this day and skill
            d = requests_array[day][skill]
            # For each time interval, the shifts that happens in this interval.
            a = [[shifts_array[day][skill][j][0][i] for j in range(num_shifts)]for i in range(time_intervals)]
            
            # Removing requests that no shift happens in this interval.
            is_shift_in_interval = False
            for i in range(time_intervals):
                for j in range(num_shifts):
                    if(a[i][j]):
                        is_shift_in_interval = True
                        break
                if(is_shift_in_interval == False):
                    requests_array[day][skill][i] = 0
                is_shift_in_interval = False

            # Array of costs per shift
            w = [shifts_array[day][skill][i][1] for i in range(num_shifts)]

            # The dictionary of output(not below 0, integers)
            y = pulp.LpVariable.dicts("num_workers", list(range(num_shifts)), lowBound=0, cat="Integer")

            # Creating the problem, the target is to minimize the sum.
            prob = pulp.LpProblem("scheduling_workers", pulp.LpMinimize)
            # Adding the sum I want to minimize.
            prob += pulp.lpSum([w[j] * y[j] for j in range(num_shifts)])

            # The constraints
            for t in range(time_intervals):
                prob += pulp.lpSum([a[t][j] * y[j] for j in range(num_shifts)]) >= d[t]

            # Solve        
            prob.solve()

            for shift in range(num_shifts):
                output_array[day][skill][shift][4] = str(int(y[shift].value()))
    output = [shift for day_list in output_array for shift_type_list in day_list for shift in shift_type_list]
    return output

if __name__ == "__main__":
    if len(sys.argv) != 1:
        print("Usage: python script.py")
        sys.exit(1)

    # Read reqs JSON from stdin
    reqs_str = input()
    reqs = json.loads(reqs_str)

    # Read shifts JSON from stdin
    shifts_str = input()
    shifts = json.loads(shifts_str)

    output = solve_shifts(reqs, shifts)
    print(json.dumps(output))