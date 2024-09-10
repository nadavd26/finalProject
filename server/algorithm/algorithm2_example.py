import random
from datetime import datetime, timedelta
from collections import defaultdict
import json
import sys


# Input 1 - the fixed schedule (before the autocomplete)
fixed_schedule = [
    {"emp_id": 0, "shift_id": 8},
    {"emp_id": 2, "shift_id": 4},
    {"emp_id": 2, "shift_id": 5},
    {"emp_id": 3, "shift_id": 4},
    {"emp_id": 2, "shift_id": 8},
    {"emp_id": 10, "shift_id": 0},
]

# Input 2
shift_requirements = [
    {
        "id": 0,
        "skill": "Cable Technician",
        "day": "Sunday",
        "start_time": "7:00",
        "end_time": "11:30",
        "required_workers": 10,
    },
    {
        "id": 19,
        "skill": "Cable Technician",
        "day": "Sunday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 15,
    },
    {
        "id": 2,
        "skill": "Cable Technician",
        "day": "Sunday",
        "start_time": "20:00",
        "end_time": "23:00",
        "required_workers": 13,
    },
    {
        "id": 3,
        "skill": "Cable Technician",
        "day": "Sunday",
        "start_time": "23:00",
        "end_time": "24:00",
        "required_workers": 5,
    },
    {
        "id": 4,
        "skill": "Cable Technician",
        "day": "Monday",
        "start_time": "7:00",
        "end_time": "11:00",
        "required_workers": 10,
    },
    {
        "id": 5,
        "skill": "Cable Technician",
        "day": "Monday",
        "start_time": "14:00",
        "end_time": "18:00",
        "required_workers": 15,
    },
    {
        "id": 6,
        "skill": "Cable Technician",
        "day": "Monday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 12,
    },
    {
        "id": 7,
        "skill": "Cable Technician",
        "day": "Tuesday",
        "start_time": "7:00",
        "end_time": "11:30",
        "required_workers": 10,
    },
    {
        "id": 8,
        "skill": "Cable Technician",
        "day": "Tuesday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 15,
    },
    {
        "id": 9,
        "skill": "Cable Technician",
        "day": "Wednesday",
        "start_time": "12:00",
        "end_time": "16:00",
        "required_workers": 13,
    },
    {
        "id": 10,
        "skill": "Cable Technician",
        "day": "Wednesday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 5,
    },
    {
        "id": 11,
        "skill": "Cable Technician",
        "day": "Thursday",
        "start_time": "7:00",
        "end_time": "11:00",
        "required_workers": 10,
    },
    {
        "id": 12,
        "skill": "Cable Technician",
        "day": "Thursday",
        "start_time": "14:00",
        "end_time": "18:00",
        "required_workers": 15,
    },
    {
        "id": 13,
        "skill": "Cable Technician",
        "day": "Friday",
        "start_time": "10:00",
        "end_time": "16:00",
        "required_workers": 12,
    },
    {
        "id": 14,
        "skill": "Cable Technician",
        "day": "Saturday",
        "start_time": "7:00",
        "end_time": "11:30",
        "required_workers": 10,
    },
]

# Input 3
employees = [
    {
        "id": 0,
        "name": "Joseph",
        "skill1": "WIFI Technician",
        "skill2": "",
        "skill3": "",
        "min_hours": 21,
        "max_hours": None,
    },
    {
        "id": 1,
        "name": "Rebecca",
        "skill1": "WIFI Technician",
        "skill2": "Cable Technician",
        "skill3": "",
        "min_hours": None,
        "max_hours": 40,
    },
    {
        "id": 2,
        "name": "David",
        "skill1": "Cable Technician",
        "skill2": "",
        "skill3": "",
        "min_hours": 21,
        "max_hours": 40,
    },
    {
        "id": 3,
        "name": "Sarah",
        "skill1": "Cable Technician",
        "skill2": "",
        "skill3": "",
        "min_hours": 28,
        "max_hours": 45,
    },
    {
        "id": 4,
        "name": "Joseph",
        "skill1": "TV Technician",
        "skill2": "WIFI Technician",
        "skill3": "",
        "min_hours": 28,
        "max_hours": 41,
    },
    {
        "id": 5,
        "name": "Levi",
        "skill1": "Cable Technician",
        "skill2": "TV Technician",
        "skill3": "WIFI Technician",
        "min_hours": 15,
        "max_hours": None,
    },
    {
        "id": 6,
        "name": "Abraham",
        "skill1": "WIFI Technician",
        "skill2": "TV Technician",
        "skill3": "Cable Technician",
        "min_hours": 30,
        "max_hours": 37,
    },
    {
        "id": 7,
        "name": "Moses",
        "skill1": "Cable Technician",
        "skill2": "",
        "skill3": "",
        "min_hours": 26,
        "max_hours": 40,
    },
    {
        "id": 8,
        "name": "Levi",
        "skill1": "WIFI Technician",
        "skill2": "TV Technician",
        "skill3": "Cable Technician",
        "min_hours": 20,
        "max_hours": 47,
    },
    {
        "id": 9,
        "name": "Joseph",
        "skill1": "WIFI Technician",
        "skill2": "",
        "skill3": "",
        "min_hours": 16,
        "max_hours": 38,
    },
    {
        "id": 10,
        "name": "David",
        "skill1": "Cable Technician",
        "skill2": "TV Technician",
        "skill3": "WIFI Technician",
        "min_hours": 21,
        "max_hours": 43,
    },
]


# Helper Functions ----------------------------------------------------
def get_shift_by_id(shift_id, shift_requirements):
    return next(
        (shift for shift in shift_requirements if shift["id"] == shift_id), None
    )


def parse_time(time_str):
    if time_str == "24:00":
        return datetime.strptime("00:00", "%H:%M") + timedelta(days=1)
    return datetime.strptime(time_str, "%H:%M")


def shifts_overlap(shift1, shift2):
    # Check if the shifts are on the same day
    if shift1["day"] != shift2["day"]:
        return False

    def parse_time(time_str):
        if time_str == "24:00":
            time_str = "23:59"
        return datetime.strptime(time_str, "%H:%M")

    start_time1 = parse_time(shift1["start_time"]).time()
    end_time1 = parse_time(shift1["end_time"]).time()
    start_time2 = parse_time(shift2["start_time"]).time()
    end_time2 = parse_time(shift2["end_time"]).time()

    # Check if the times overlap
    return start_time1 < end_time2 and start_time2 < end_time1


def calculate_employee_hours(schedule, employee_id, shift_requirements):
    total_hours = 0
    for entry in schedule:
        if entry["emp_id"] == employee_id:
            shift = get_shift_by_id(entry["shift_id"], shift_requirements)
            start_time = parse_time(shift["start_time"])
            end_time = parse_time(shift["end_time"])
            total_hours += (end_time - start_time).seconds / 3600
    return total_hours


# Helper Functions ----------------------------------------------------


def generate_random_schedule(fixed_schedule, employees, shift_requirements):
    schedule = fixed_schedule.copy()  # Start with the fixed schedule
    random_employees = random.sample(employees, len(employees))

    # First round: Satisfy minimum hours
    for employee in random_employees:
        current_hours = calculate_employee_hours(
            schedule, employee["id"], shift_requirements
        )
        while current_hours < employee["min_hours"]:
            appropriate_shifts = [
                shift
                for shift in shift_requirements
                if shift["skill"] in employee["skills"]
                and len([s for s in schedule if s["shift_id"] == shift["id"]])
                < shift["required_workers"]
                and not any(
                    shifts_overlap(
                        shift, get_shift_by_id(s["shift_id"], shift_requirements)
                    )
                    for s in schedule
                    if s["emp_id"] == employee["id"]
                )
            ]
            if not appropriate_shifts:
                break
            selected_shift = random.choice(appropriate_shifts)
            schedule.append(
                {"emp_id": employee["id"], "shift_id": selected_shift["id"]}
            )
            current_hours = calculate_employee_hours(
                schedule, employee["id"], shift_requirements
            )

    # Second round: Try to reach maximum hours
    random_employees = random.sample(employees, len(employees))
    for employee in random_employees:
        current_hours = calculate_employee_hours(
            schedule, employee["id"], shift_requirements
        )
        while current_hours < employee["max_hours"]:
            appropriate_shifts = [
                shift
                for shift in shift_requirements
                if shift["skill"] in employee["skills"]
                and len([s for s in schedule if s["shift_id"] == shift["id"]])
                < shift["required_workers"]
                and not any(
                    shifts_overlap(
                        shift, get_shift_by_id(s["shift_id"], shift_requirements)
                    )
                    for s in schedule
                    if s["emp_id"] == employee["id"]
                )
            ]
            if not appropriate_shifts:
                break
            selected_shift = random.choice(appropriate_shifts)
            additional_hours = (
                parse_time(selected_shift["end_time"])
                - parse_time(selected_shift["start_time"])
            ).seconds / 3600
            if current_hours + additional_hours > employee["max_hours"]:
                break
            schedule.append(
                {"emp_id": employee["id"], "shift_id": selected_shift["id"]}
            )
            current_hours = calculate_employee_hours(
                schedule, employee["id"], shift_requirements
            )

    return schedule


def update_employees(employees):
    # Maximum hours in a week
    MAX_WEEK_HOURS = 24 * 7

    for employee in employees:
        # Set min_hours to 0 if it's None
        if employee["min_hours"] is None:
            employee["min_hours"] = 0

        # Set max_hours to 24*7 (168) if it's None
        if employee["max_hours"] is None:
            employee["max_hours"] = MAX_WEEK_HOURS

        # Combine skill1, skill2, skill3 into a skills array, filtering out empty strings
        skills = [
            employee[key] for key in ["skill1", "skill2", "skill3"] if employee[key]
        ]
        employee["skills"] = skills

        # Remove the old skill keys
        employee.pop("skill1", None)
        employee.pop("skill2", None)
        employee.pop("skill3", None)

    return employees


if __name__ == "__main__":
    # Read fixed_schedule JSON from stdin
    fixed_schedule_str = sys.stdin.readline().strip()
    try:
        fixed_schedule = json.loads(fixed_schedule_str)
    except json.JSONDecodeError as e:
        print("Error parsing fixed_schedule JSON:", e)
        sys.exit(1)

    # Read employees JSON from stdin
    employees_str = sys.stdin.readline().strip()
    try:
        employees = json.loads(employees_str)
    except json.JSONDecodeError as e:
        print("Error parsing employees JSON:", e)
        sys.exit(1)

    # Read shifts JSON from stdin
    shift_requirements_str = sys.stdin.readline().strip()
    try:
        shift_requirements = json.loads(shift_requirements_str)
    except json.JSONDecodeError as e:
        print("Error parsing shift_requirements JSON:", e)
        sys.exit(1)
    output = generate_random_schedule(fixed_schedule, update_employees(employees), shift_requirements)
    print(json.dumps(output))

# output_example = [
#     {"emp_id": 0, "shift_id": 8},
#     {"emp_id": 2, "shift_id": 4},
#     {"emp_id": 2, "shift_id": 5},
#     {"emp_id": 3, "shift_id": 4},
#     {"emp_id": 2, "shift_id": 8},
#     {"emp_id": 10, "shift_id": 0},
#     {"emp_id": 2, "shift_id": 6},
#     {"emp_id": 2, "shift_id": 0},
#     {"emp_id": 1, "shift_id": 4},
#     {"emp_id": 1, "shift_id": 5},
#     {"emp_id": 1, "shift_id": 19},
#     {"emp_id": 10, "shift_id": 6},
#     {"emp_id": 10, "shift_id": 9},
#     {"emp_id": 10, "shift_id": 12},
#     {"emp_id": 10, "shift_id": 2},
#     {"emp_id": 10, "shift_id": 14},
#     {"emp_id": 3, "shift_id": 7},
#     {"emp_id": 3, "shift_id": 2},
#     {"emp_id": 3, "shift_id": 10},
#     {"emp_id": 3, "shift_id": 10},
#     {"emp_id": 3, "shift_id": 3},
#     {"emp_id": 3, "shift_id": 13},
#     {"emp_id": 3, "shift_id": 6},
#     {"emp_id": 6, "shift_id": 4},
#     {"emp_id": 6, "shift_id": 3},
#     {"emp_id": 6, "shift_id": 12},
#     {"emp_id": 6, "shift_id": 6},
#     {"emp_id": 6, "shift_id": 6},
#     {"emp_id": 6, "shift_id": 14},
#     {"emp_id": 6, "shift_id": 19},
#     {"emp_id": 6, "shift_id": 7},
#     {"emp_id": 5, "shift_id": 0},
#     {"emp_id": 5, "shift_id": 14},
#     {"emp_id": 5, "shift_id": 8},
#     {"emp_id": 5, "shift_id": 9},
#     {"emp_id": 7, "shift_id": 14},
#     {"emp_id": 7, "shift_id": 8},
#     {"emp_id": 7, "shift_id": 9},
#     {"emp_id": 7, "shift_id": 11},
#     {"emp_id": 7, "shift_id": 6},
#     {"emp_id": 7, "shift_id": 12},
#     {"emp_id": 7, "shift_id": 0},
#     {"emp_id": 8, "shift_id": 13},
#     {"emp_id": 8, "shift_id": 14},
#     {"emp_id": 8, "shift_id": 2},
#     {"emp_id": 8, "shift_id": 11},
#     {"emp_id": 8, "shift_id": 19},
#     {"emp_id": 8, "shift_id": 5},
#     {"emp_id": 8, "shift_id": 4},
#     {"emp_id": 8, "shift_id": 6},
#     {"emp_id": 8, "shift_id": 9},
#     {"emp_id": 8, "shift_id": 3},
#     {"emp_id": 8, "shift_id": 10},
#     {"emp_id": 5, "shift_id": 4},
#     {"emp_id": 5, "shift_id": 6},
#     {"emp_id": 5, "shift_id": 6},
#     {"emp_id": 5, "shift_id": 19},
#     {"emp_id": 7, "shift_id": 5},
#     {"emp_id": 7, "shift_id": 2},
#     {"emp_id": 2, "shift_id": 6},
#     {"emp_id": 2, "shift_id": 9},
#     {"emp_id": 2, "shift_id": 13},
#     {"emp_id": 2, "shift_id": 10},
#     {"emp_id": 10, "shift_id": 8},
#     {"emp_id": 10, "shift_id": 13},
#     {"emp_id": 10, "shift_id": 11},
#     {"emp_id": 1, "shift_id": 9},
#     {"emp_id": 1, "shift_id": 14},
#     {"emp_id": 1, "shift_id": 7},
#     {"emp_id": 1, "shift_id": 6},
#     {"emp_id": 1, "shift_id": 10},
#     {"emp_id": 1, "shift_id": 8},
#     {"emp_id": 1, "shift_id": 3},
#     {"emp_id": 3, "shift_id": 3},
#     {"emp_id": 3, "shift_id": 14},
#     {"emp_id": 3, "shift_id": 8},
#     {"emp_id": 6, "shift_id": 9},
# ]
