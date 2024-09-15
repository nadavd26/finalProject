import pulp
import sys
import json


# Converts any hour in format 'hh:mm' to a number between 0 and 47, every half an hour is +1.
def hour_to_index(hour):
    hours, minutes = map(int, hour.split(":"))
    return hours * 2 + (minutes == 30)


# Converts any range of hours in format 'hh:mm' to an array in size 48 (half an hour time interval).
# Filled with 1 if the hour is bigger than the start or equal to it, and smaller than the end. Else 0.
def hours_to_array(start_hour, end_hour):
    start_index = hour_to_index(start_hour)
    end_index = hour_to_index(end_hour)

    if end_index == 0:
        end_index = 48

    hours_array = [1 if start_index <= i < end_index else 0 for i in range(48)]

    return hours_array


# Arguments:
# reqs is a 2d array filled with the employees required for a day, a skill, and range of hours.
# Example: ["sunday", "cable technician", "00:00", "00:30", 50].
#
# shifts is a 2d array filled with the cost of the shift, the day, the skill,
# And range of hours the shift is happening at.
# Example ["sunday", "cable technician", "08:00", "12:00", 150].
def solve_shifts(reqs, shifts):
    unique_skills = []
    unique_days = []

    # Fill unique_skills and unique_days arrays
    for requirement in reqs:
        if requirement[1] not in unique_skills:
            unique_skills.append(requirement[1])
        if requirement[0] not in unique_days:
            unique_days.append(requirement[0])

    # Create mappings for days and skills
    day_to_index = {day: index for index, day in enumerate(unique_days)}
    skill_to_index = {skill: index for index, skill in enumerate(unique_skills)}

    # Init array of shifts per skill and day
    shifts_matrix = [
        [[] for _ in range(len(skill_to_index))] for _ in range(len(day_to_index))
    ]
    output_matrix = [
        [[] for _ in range(len(skill_to_index))] for _ in range(len(day_to_index))
    ]

    # Fill in the 3D shifts matrix with the corresponding values
    for shift in shifts:
        day_index = day_to_index.get(shift[1], -1)
        skill_index = skill_to_index.get(shift[0], -1)
        if skill_index == -1 or day_index == -1:
            continue

        hours = hours_to_array(shift[2], shift[3])
        cost = int(shift[4])
        # For each shift, append the hours and the cost of it, to the relevant day and skill.
        shifts_matrix[day_index][skill_index].append((hours, cost))
        output_matrix[day_index][skill_index].append(
            [shift[1], shift[0], shift[2], shift[3], "-1"]
        )

    requirements_matrix = [
        [[0 for _ in range(48)] for _ in range(len(skill_to_index))]
        for _ in range(len(day_to_index))
    ]

    # For each day and skill, update the requested employees.
    for requirement in reqs:
        day_index = day_to_index.get(requirement[0], -1)
        skill_index = skill_to_index.get(requirement[1], -1)
        if skill_index == -1 or day_index == -1:
            raise ValueError("Error filling the requirements matrix")
        start_index = hour_to_index(requirement[2])
        end_index = hour_to_index(requirement[3])
        if end_index == 0:
            end_index = 48
        for i in range(start_index, end_index):
            requirements_matrix[day_index][skill_index][i] = int(requirement[4])

    # For each day and skill, solve the problem using pulp.
    for day_index in range(len(day_to_index)):
        for skill_index in range(len(skill_to_index)):
            num_shifts = len(shifts_matrix[day_index][skill_index])
            time_intervals = 48
            # Requests for this day and skill
            demand = requirements_matrix[day_index][skill_index]
            # For each time interval, the shifts that happen in this interval.
            availability = [
                [
                    shifts_matrix[day_index][skill_index][shift_index][0][time_index]
                    for shift_index in range(num_shifts)
                ]
                for time_index in range(time_intervals)
            ]

            # Removing requests that no shift happens in this interval.
            shift_present = False
            for time_index in range(time_intervals):
                for shift_index in range(num_shifts):
                    if availability[time_index][shift_index]:
                        shift_present = True
                        break
                if not shift_present:
                    requirements_matrix[day_index][skill_index][time_index] = 0
                shift_present = False

            # Array of costs per shift
            shift_costs = [
                shifts_matrix[day_index][skill_index][shift_index][1]
                for shift_index in range(num_shifts)
            ]

            # The dictionary of output (not below 0, integers)
            num_workers = pulp.LpVariable.dicts(
                "num_workers", list(range(num_shifts)), lowBound=0, cat="Integer"
            )

            # Creating the problem, the target is to minimize the sum.
            prob = pulp.LpProblem("scheduling_workers", pulp.LpMinimize)
            # Adding the sum I want to minimize.
            prob += pulp.lpSum(
                [
                    shift_costs[shift_index] * num_workers[shift_index]
                    for shift_index in range(num_shifts)
                ]
            )

            # The constraints
            for time_index in range(time_intervals):
                prob += (
                    pulp.lpSum(
                        [
                            availability[time_index][shift_index]
                            * num_workers[shift_index]
                            for shift_index in range(num_shifts)
                        ]
                    )
                    >= demand[time_index]
                )

            # Solve
            prob.solve(pulp.PULP_CBC_CMD(msg=False, timeLimit=1))

            for shift_index in range(num_shifts):
                output_matrix[day_index][skill_index][shift_index][4] = str(
                    int(num_workers[shift_index].value())
                )

    output = [
        shift
        for day_list in output_matrix
        for skill_list in day_list
        for shift in skill_list
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
