import pulp
import sys
import json


# Converts any hour in format 'hh:mm' to a number between 0 and 47, every half an hour is +1.
def hour_to_index(hour):
    hours, minutes = map(int, hour.split(":"))
    return hours * 2 + (minutes == 30)


# Converts any range of hours in format 'hh:mm' to an array in size 48 (half an hour time interval).
# Filled with 1 if the hour is greater than or equal to the start, and smaller than the end; else 0.
def hours_to_array(start_hour, end_hour):
    start = hour_to_index(start_hour)
    end = hour_to_index(end_hour)

    if end == 0:
        end = 48

    hours_array = [1 if start <= i < end else 0 for i in range(48)]
    return hours_array


# Arguments:
# reqs is a 2D array filled with the employees required for a day, a skill, and range of hours.
# Example: ["sunday", "cable technician", "00:00", "00:30", 50].
#
# shifts is a 2D array filled with the cost of the shift, the day, the skill,
# and the range of hours the shift is happening at.
# Example: ["sunday", "cable technician", "08:00", "12:00", 150].
def solve_shifts(reqs, shifts):
    # Suppress solver messages
    pulp.LpSolverDefault.msg = 0

    skills = []
    days = []
    # Fill skills and days arrays
    for req in reqs:
        if req[1] not in skills:
            skills.append(req[1])
        if req[0] not in days:
            days.append(req[0])

    # Create maps for day and skill
    day_mapping = {day: index for index, day in enumerate(days)}
    skill_mapping = {skill: index for index, skill in enumerate(skills)}

    # Initialize array of shifts per skill and day
    shifts_by_day_and_skill = [
        [[] for _ in range(len(skill_mapping))] for _ in range(len(day_mapping))
    ]
    output_by_day_and_skill = [
        [[] for _ in range(len(skill_mapping))] for _ in range(len(day_mapping))
    ]

    # Fill in the 3D shifts array with the corresponding values
    for shift in shifts:
        day_index = day_mapping.get(shift[1], -1)
        skill_index = skill_mapping.get(shift[0], -1)
        if skill_index == -1 or day_index == -1:
            continue

        hours = hours_to_array(shift[2], shift[3])
        cost = int(shift[4])
        # Append the hours and the cost of each shift to the relevant day and skill.
        shifts_by_day_and_skill[day_index][skill_index].append((hours, cost))
        output_by_day_and_skill[day_index][skill_index].append(
            [shift[1], shift[0], shift[2], shift[3], "-1"]
        )

    requests_by_day_and_skill = [
        [[0 for _ in range(48)] for _ in range(len(skill_mapping))]
        for _ in range(len(day_mapping))
    ]

    # Update the requested employees for each day and skill.
    for req in reqs:
        day_index = day_mapping.get(req[0], -1)
        skill_index = skill_mapping.get(req[1], -1)
        if skill_index == -1 or day_index == -1:
            raise ValueError("Error filling the requests array")
        start = hour_to_index(req[2])
        end = hour_to_index(req[3])
        if end == 0:
            end = 48
        for i in range(start, end):
            requests_by_day_and_skill[day_index][skill_index][i] = int(req[4])

    # Solve the problem using PuLP for each day and skill
    for day in range(len(day_mapping)):
        for skill in range(len(skill_mapping)):
            num_shifts = len(shifts_by_day_and_skill[day][skill])
            time_intervals = 48
            # Requests for this day and skill
            requested_workers = requests_by_day_and_skill[day][skill]
            # For each time interval, the shifts that occur in this interval.
            shift_coverage = [
                [
                    shifts_by_day_and_skill[day][skill][j][0][i]
                    for j in range(num_shifts)
                ]
                for i in range(time_intervals)
            ]

            # Remove requests where no shift occurs in the interval.
            shift_exists = False
            for i in range(time_intervals):
                for j in range(num_shifts):
                    if shift_coverage[i][j]:
                        shift_exists = True
                        break
                if not shift_exists:
                    requests_by_day_and_skill[day][skill][i] = 0
                shift_exists = False

            # Array of costs per shift
            shift_costs = [
                shifts_by_day_and_skill[day][skill][i][1] for i in range(num_shifts)
            ]

            # Define the decision variables (integer, non-negative)
            workers_assigned = pulp.LpVariable.dicts(
                "num_workers", list(range(num_shifts)), lowBound=0, cat="Integer"
            )

            # Create the problem, the objective is to minimize the total cost
            prob = pulp.LpProblem("scheduling_workers", pulp.LpMinimize)
            # Add the objective function
            prob += pulp.lpSum(
                [shift_costs[j] * workers_assigned[j] for j in range(num_shifts)]
            )

            # Add the constraints for each time interval
            for t in range(time_intervals):
                prob += (
                    pulp.lpSum(
                        [
                            shift_coverage[t][j] * workers_assigned[j]
                            for j in range(num_shifts)
                        ]
                    )
                    >= requested_workers[t]
                )
            # Solve the problem
            prob.solve()

            # Update the output with the number of workers assigned to each shift
            for shift in range(num_shifts):
                output_by_day_and_skill[day][skill][shift][4] = str(
                    int(workers_assigned[shift].value())
                )

    # Flatten the 3D output array into a 1D list for the final output
    output = [
        shift
        for day_list in output_by_day_and_skill
        for shift_list in day_list
        for shift in shift_list
    ]
    return output


if __name__ == "__main__":
    # Read reqs JSON from stdin
    reqs_str = sys.stdin.readline().strip()
    try:
        reqs = json.loads(reqs_str)
    except json.JSONDecodeError as e:
        print("Error parsing reqs JSON:", e)
        sys.exit(1)

    # Read shifts JSON from stdin
    shifts_str = sys.stdin.readline().strip()
    try:
        shifts = json.loads(shifts_str)
    except json.JSONDecodeError as e:
        print("Error parsing shifts JSON:", e)
        sys.exit(1)

    output = solve_shifts(reqs, shifts)
    print(json.dumps(output))
