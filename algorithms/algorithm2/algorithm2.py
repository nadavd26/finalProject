import random
import time
from datetime import datetime, timedelta
from joblib import Parallel, delayed
from collections import defaultdict
import copy

# JUST FOR TEST - CAN REMOVE 1/2 ---------------------------------------------

fixed_schedule = [
    {"emp_id": 0, "shift_id": 8},
    {"emp_id": 0, "shift_id": 6},
    {"emp_id": 0, "shift_id": 5},
    {"emp_id": 0, "shift_id": 4},
]


def generate_random_shift_requirements(n):
    skills = ["Cable Technician", "WIFI Technician", "TV Technician"]
    days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ]

    shift_requirements = []

    for i in range(n):
        skill = random.choice(skills)
        day = random.choice(days)

        # Generate random start and end times within reasonable hours
        start_hour = random.randint(0, 23)
        end_hour = start_hour + random.randint(
            1, 6
        )  # Shift lasts between 1 and 6 hours

        # Ensure end hour does not exceed 24 and format times correctly
        start_time = f"{start_hour}:00"
        end_time = f"{min(end_hour, 24)}:00" if end_hour <= 24 else "24:00"

        # Generate a reasonable number of required workers
        required_workers = random.randint(5, 20)

        # Append the shift requirement to the list
        shift_requirements.append(
            {
                "id": i,
                "skill": skill,
                "day": day,
                "start_time": start_time,
                "end_time": end_time,
                "required_workers": required_workers,
            }
        )

    return shift_requirements


def generate_random_employee(id):
    names = [
        "Meir",
        "Haim",
        "Cohen",
        "Levi",
        "David",
        "Isaac",
        "Jacob",
        "Sarah",
        "Rebecca",
        "Rachel",
        "Aaron",
        "Moses",
        "Daniel",
        "Elijah",
        "Abraham",
        "Noah",
        "Joseph",
        "Benjamin",
        "Samuel",
        "Gideon",
    ]
    skills = ["Cable Technician", "WIFI Technician", "TV Technician"]
    name = random.choice(names)
    num_skills = random.randint(1, 3)
    if id == 0:
        num_skills = 3
    selected_skills = random.sample(skills, num_skills)
    employee_skills = ["", "", ""]
    for i in range(num_skills):
        employee_skills[i] = selected_skills[i]
    min_hours = random.randint(10, 30)
    max_hours = random.randint(31, 50)
    return {
        "id": id,
        "name": name,
        "skill1": employee_skills[0],
        "skill2": employee_skills[1],
        "skill3": employee_skills[2],
        "min_hours": min_hours,
        "max_hours": max_hours,
    }


def generate_employees(n):
    employees = []

    for i in range(0, n):
        employees.append(generate_random_employee(i))
    return employees


# JUST FOR TEST - OMER CAN REMOVE 1/2 ---------------------------------------------


# Helper Functions
def get_shift_by_id(shift_id, shift_requirements):
    return next(
        (shift for shift in shift_requirements if shift["id"] == shift_id), None
    )


# Parse the start and end times
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


def calculate_employee_hours(schedule_of_employee, shift_requirements):
    total_hours = 0
    for shift in schedule_of_employee:
        start_time = parse_time(shift["start_time"])
        end_time = parse_time(shift["end_time"])
        total_hours += (end_time - start_time).seconds / 3600
    return total_hours


def generate_random_schedule(
    employees, shift_requirements, employee_shifts_global, shift_worker_count_global
):
    employee_shifts = copy.deepcopy(employee_shifts_global)
    shift_worker_count = copy.deepcopy(shift_worker_count_global)
    random_employees = random.sample(employees, len(employees))
    random_shift_requirements = random.sample(
        shift_requirements, len(shift_requirements)
    )

    # First round: Satisfy minimum hours
    for employee in random_employees:
        current_hours = calculate_employee_hours(
            employee_shifts[employee["id"]], shift_requirements
        )
        current_index = 0
        while current_hours < employee["min_hours"]:
            found_shift = False
            for i in range(current_index, len(random_shift_requirements)):
                shift = random_shift_requirements[i]
                if (
                    shift_worker_count[shift["id"]] < shift["required_workers"]
                    and shift["skill"] in employee["skills"]
                    and not any(
                        shifts_overlap(shift, existing_shift)
                        for existing_shift in employee_shifts[employee["id"]]
                    )
                ):
                    # Assign the shift to the employee
                    shift_worker_count[shift["id"]] += 1
                    additional_hours = (
                        parse_time(shift["end_time"]) - parse_time(shift["start_time"])
                    ).seconds / 3600
                    current_hours += additional_hours
                    employee_shifts[employee["id"]].append(shift)
                    current_index = i + 1
                    found_shift = True

                    # Remove the shift from random_shift_requirements if it is full
                    if shift_worker_count[shift["id"]] == shift["required_workers"]:
                        random_shift_requirements.pop(i)
                        current_index -= 1

                    break
            if not found_shift:
                break

    # Second round: Try to reach maximum hours
    for employee in random_employees:
        current_hours = calculate_employee_hours(
            employee_shifts[employee["id"]], shift_requirements
        )
        current_index = 0
        while current_hours < employee["max_hours"]:
            found_shift = False
            for i in range(current_index, len(random_shift_requirements)):
                shift = random_shift_requirements[i]
                additional_hours = (
                    parse_time(shift["end_time"]) - parse_time(shift["start_time"])
                ).seconds / 3600
                if (
                    current_hours + additional_hours <= employee["max_hours"]
                    and shift_worker_count[shift["id"]] < shift["required_workers"]
                    and shift["skill"] in employee["skills"]
                    and not any(
                        shifts_overlap(shift, existing_shift)
                        for existing_shift in employee_shifts[employee["id"]]
                    )
                ):
                    # Assign the shift to the employee
                    shift_worker_count[shift["id"]] += 1
                    current_hours += additional_hours
                    employee_shifts[employee["id"]].append(shift)
                    current_index = i + 1
                    found_shift = True

                    # Remove the shift from random_shift_requirements if it is full
                    if shift_worker_count[shift["id"]] == shift["required_workers"]:
                        random_shift_requirements.pop(i)
                        current_index -= 1

                    break
            if not found_shift:
                break

    return employee_shifts, shift_worker_count


def initialize_population(pop_size, fixed_schedule, employees, shift_requirements):
    # Initialize shift worker count dictionary
    shift_worker_count = {shift["id"]: 0 for shift in shift_requirements}

    # Dictionary to track employee shifts
    employee_shifts = {e["id"]: [] for e in employees}

    for s in fixed_schedule:
        shift_worker_count[s["shift_id"]] += 1
        employee_shifts[s["emp_id"]].append(
            get_shift_by_id(s["shift_id"], shift_requirements)
        )

    def generate_schedule():
        return generate_random_schedule(
            employees, shift_requirements, employee_shifts, shift_worker_count
        )

    # Using joblib to parallelize the schedule generation
    population = Parallel(n_jobs=-1)(
        delayed(generate_schedule)() for _ in range(pop_size)
    )
    return population


def fitness(employees, shift_requirements, employee_shifts, shift_worker_count):
    CONTRACT_VIOLATION_PENALTY = 5
    total_penalty = 0
    for shift in shift_requirements:
        total_penalty += shift["required_workers"] - shift_worker_count[shift["id"]]
    for emp in employees:
        total_hours = 0
        for shift in employee_shifts[emp["id"]]:
            shift_hours = (
                parse_time(shift["end_time"]) - parse_time(shift["start_time"])
            ).total_seconds() / 3600
            total_hours += shift_hours
        if total_hours < emp["min_hours"]:
            total_penalty += CONTRACT_VIOLATION_PENALTY + emp["min_hours"] - total_hours
        if total_hours > emp["max_hours"]:
            total_penalty += CONTRACT_VIOLATION_PENALTY + total_hours - emp["max_hours"]
    return total_penalty


def crossover(
    employees,
    shift_requirements,
    parent1_employee_shifts,
    parent2_employee_shifts,
):
    # Initialize child shift dictionaries
    child1_employee_shifts = {emp["id"]: [] for emp in employees}
    child2_employee_shifts = {emp["id"]: [] for emp in employees}

    # Initialize shift worker count dictionaries
    child1_shift_worker_count = {shift["id"]: 0 for shift in shift_requirements}
    child2_shift_worker_count = {shift["id"]: 0 for shift in shift_requirements}

    # Shuffle the list of employees to randomize crossover assignment
    random_employees = random.sample(employees, len(employees))

    # Split the employees into two halves for inheritance from parent1 and parent2
    mid_point = len(random_employees) // 2

    for i, employee in enumerate(random_employees):
        emp_id = employee["id"]

        if i < mid_point:
            # Child 1 takes from Parent 1, Child 2 from Parent 2
            parent1_shifts = parent1_employee_shifts[emp_id]
            parent2_shifts = parent2_employee_shifts[emp_id]
        else:
            # Child 1 takes from Parent 2, Child 2 from Parent 1
            parent1_shifts = parent2_employee_shifts[emp_id]
            parent2_shifts = parent1_employee_shifts[emp_id]

        # Assign shifts to Child 1, ensuring the shift requirement is not exceeded
        for shift in parent1_shifts:
            shift_id = shift["id"]
            required_workers = shift["required_workers"]
            if child1_shift_worker_count[shift_id] < required_workers:
                child1_employee_shifts[emp_id].append(shift)
                child1_shift_worker_count[shift_id] += 1

        # Assign shifts to Child 2, ensuring the shift requirement is not exceeded
        for shift in parent2_shifts:
            shift_id = shift["id"]
            required_workers = shift["required_workers"]
            if child2_shift_worker_count[shift_id] < required_workers:
                child2_employee_shifts[emp_id].append(shift)
                child2_shift_worker_count[shift_id] += 1

    return (child1_employee_shifts, child1_shift_worker_count), (
        child2_employee_shifts,
        child2_shift_worker_count,
    )


def mutate(
    shift_requirements,
    employee_shifts,
    shift_worker_count,
    employees,
    fixed_schedule_set,
    mutation_rate=0.1,
):
    # Determine if mutation should occur based on the mutation rate
    if random.random() > mutation_rate:
        return

    # Select a random employee
    employee = random.choice(employees)
    employee_id = employee["id"]

    assigned_shifts = employee_shifts[employee_id]

    if assigned_shifts:
        # Randomly select one shift to remove if there are assigned shifts
        shift_to_remove = random.choice(assigned_shifts)
        if (employee_id, shift_to_remove["id"]) not in fixed_schedule_set:
            assigned_shifts.remove(shift_to_remove)
            shift_worker_count[
                shift_to_remove["id"]
            ] -= 1  # Decrease the count for the removed shift

    # Shuffle shift requirements to randomly order them
    random_shift_requirements = random.sample(
        shift_requirements, len(shift_requirements)
    )

    # Try to add a new valid shift
    for shift in random_shift_requirements:
        if (
            shift_worker_count[shift["id"]] < shift["required_workers"]
            and shift["skill"] in employee["skills"]
            and not any(
                shifts_overlap(shift, existing_shift)
                for existing_shift in assigned_shifts
            )
        ):
            # Assign the new shift
            assigned_shifts.append(shift)
            shift_worker_count[shift["id"]] += 1
            break  # Return


def calculate_crossover_probabilities(fitness_scores):
    total_fitness = sum(fitness_scores)

    # Normalized crossover probabilities
    crossover_probabilities = [fitness / total_fitness for fitness in fitness_scores]

    return crossover_probabilities


def select_parents(population, crossover_probabilities):
    # Select two parents based on crossover probabilities
    parents = random.choices(population, weights=crossover_probabilities, k=2)
    return parents[0], parents[1]


def fill_shifts(employees, shift_requirements, employee_shifts, shift_worker_count):
    # Iterate through all shift requirements
    for shift in shift_requirements:
        shift_id = shift["id"]
        max_required_workers = shift["required_workers"]

        # If the shift is already fully staffed, skip it
        if shift_worker_count[shift_id] >= max_required_workers:
            continue

        skill_required = shift["skill"]

        # Iterate through all employees to fill the shift
        for employee in employees:
            emp_id = employee["id"]
            employee_skills = employee["skills"]

            # Check if the employee has the required skill and can be assigned to the shift
            if skill_required in employee_skills and not any(
                shifts_overlap(shift, existing_shift)
                for existing_shift in employee_shifts[emp_id]
            ):
                # Calculate the additional hours this shift would add
                additional_hours = (
                    parse_time(shift["end_time"]) - parse_time(shift["start_time"])
                ).seconds / 3600

                # Check if assigning this shift exceeds the employee's maximum hours
                current_hours = calculate_employee_hours(
                    employee_shifts[emp_id], shift_requirements
                )
                if current_hours + additional_hours <= employee["max_hours"]:
                    # Assign the shift to the employee
                    employee_shifts[emp_id].append(shift)
                    shift_worker_count[shift_id] += 1
                    if shift_worker_count[shift_id] == max_required_workers:
                        break  # Move to the next shift requirement if the current shift is filled

    return employee_shifts, shift_worker_count


def convert_employee_shifts_to_schedule(employee_shifts):
    schedule = []

    # Iterate over the dictionary with employee IDs and their assigned shifts
    for emp_id, shifts in employee_shifts.items():
        for shift in shifts:
            # Append a new dictionary with employee ID and shift ID to the schedule list
            schedule.append({"emp_id": emp_id, "shift_id": shift["id"]})

    return schedule


def genetic_algorithm(
    fixed_schedule,
    employees,
    shift_requirements,
    pop_size=100,
    generations=100,
    mutation_rate=0.1,
    elitism_rate=0.3,
    stagnation_threshold=5,  # Number of generations with no improvement to trigger mutation rate increase
):
    fixed_schedule_set = {
        (entry["emp_id"], entry["shift_id"]) for entry in fixed_schedule
    }
    population = initialize_population(
        pop_size, fixed_schedule, employees, shift_requirements
    )
    fitness_scores = [
        fitness(employees, shift_requirements, schedule[0], schedule[1])
        for schedule in population
    ]
    num_elites = int(pop_size * elitism_rate)
    num_new_population = pop_size - num_elites
    previous_best_fitness = -1
    original_mutation_rate = mutation_rate
    stagnation_counter = 0

    for _ in range(generations):
        best_fitness = min(fitness_scores)

        # Check for perfect solution
        if best_fitness == 0:
            best_schedule = population[fitness_scores.index(best_fitness)]
            return best_schedule

        # Check for stagnation
        if best_fitness == previous_best_fitness:
            stagnation_counter += 1
        else:
            stagnation_counter = 0
            mutation_rate = original_mutation_rate
        if stagnation_counter >= stagnation_threshold:
            mutation_rate = min(mutation_rate * 2, 0.5)
            stagnation_counter = 0
        previous_best_fitness = best_fitness

        crossover_probs = calculate_crossover_probabilities(fitness_scores)

        # Elitism: Get the indices of the top num_elites schedules
        elite_indices = sorted(
            range(len(fitness_scores)), key=lambda x: fitness_scores[x]
        )[:num_elites]
        elite_population = [population[i] for i in elite_indices]
        elite_fitness_scores = [fitness_scores[i] for i in elite_indices]
        new_population = []

        while len(new_population) < num_new_population:
            parent1, parent2 = select_parents(population, crossover_probs)

            child1, child2 = crossover(
                employees, shift_requirements, parent1[0], parent2[0]
            )

            mutate(
                shift_requirements,
                child1[0],
                child1[1],
                employees,
                fixed_schedule_set,
                mutation_rate,
            )
            mutate(
                shift_requirements,
                child2[0],
                child2[1],
                employees,
                fixed_schedule_set,
                mutation_rate,
            )

            new_population.append(child1)
            new_population.append(child2)

        new_population = new_population[:num_new_population]  # Ensure correct size
        new_fitness_scores = [
            fitness(employees, shift_requirements, schedule[0], schedule[1])
            for schedule in new_population
        ]

        population = elite_population + new_population
        fitness_scores = elite_fitness_scores + new_fitness_scores

    best_solution = population[fitness_scores.index(min(fitness_scores))]
    best_solution_after_fill = fill_shifts(
        employees, shift_requirements, best_solution[0], best_solution[1]
    )
    return convert_employee_shifts_to_schedule(best_solution_after_fill[0])


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


# JUST FOR TEST - CAN REMOVE 2/2 ---------------------------------------------


def calculate_shift_hours(shift):
    start_time = parse_time(shift["start_time"])
    end_time = parse_time(shift["end_time"])
    duration = end_time - start_time
    return duration.seconds / 3600


def print_schedule(schedule, shift_requirements, employees):
    # Create a dictionary to store employee schedules
    employee_schedules = {
        emp["id"]: {
            "name": emp["name"],
            "skills": emp["skills"],
            "min_hours": emp["min_hours"],
            "max_hours": emp["max_hours"],
            "shifts": [],
            "total_hours": 0,
        }
        for emp in employees
    }

    # Populate the schedule information
    for entry in schedule:
        emp_id = entry["emp_id"]
        shift_id = entry["shift_id"]
        shift = get_shift_by_id(shift_id, shift_requirements)

        if shift:
            shift_hours = calculate_shift_hours(shift)
            employee_schedules[emp_id]["shifts"].append(shift)
            employee_schedules[emp_id]["total_hours"] += shift_hours

    # Print the details for each employee
    for emp_id, emp_schedule in employee_schedules.items():
        print(f"Employee: {emp_schedule['name']}")
        print(f"  Skills: {', '.join(filter(None, emp_schedule['skills']))}")
        print(f"  Min Hours: {emp_schedule['min_hours']}")
        print(f"  Max Hours: {emp_schedule['max_hours']}")
        print(f"  Total Hours Assigned: {emp_schedule['total_hours']:.2f}")
        if emp_schedule["shifts"]:
            for shift in emp_schedule["shifts"]:
                print(f"  Shift ID: {shift['id']}")
                print(f"    Day: {shift['day']}")
                print(f"    Start Time: {shift['start_time']}")
                print(f"    End Time: {shift['end_time']}")
                print(f"    Skill Required: {shift['skill']}")
        else:
            print("  No shifts assigned.")
        print()


def print_shift_details(schedule, shift_requirements):
    # Create dictionaries to store shift details
    shift_counts = defaultdict(int)
    shift_desired = {
        shift["id"]: shift["required_workers"] for shift in shift_requirements
    }

    # Process each entry in the schedule
    for entry in schedule:
        shift_id = entry.get("shift_id")
        if shift_id is None:
            print(f"Entry does not contain 'shift_id': {entry}")  # Debugging line
            continue
        shift_counts[shift_id] += 1

    # Print shift details
    for shift_id, count in shift_counts.items():
        desired_count = shift_desired.get(
            shift_id, "Unknown"
        )  # Get desired count, or 'Unknown' if not found
        if count != desired_count:
            print(f"Shift ID: {shift_id}")
            print(f"Number of Employees Scheduled: {count}")
            print(f"Desired Number of Employees: {desired_count}")
            print("-" * 30)


def validate_schedule(schedule, shift_requirements, employees, fixed_schedule):
    # Initialize data structures
    employee_shifts = {e["id"]: [] for e in employees}
    shift_worker_count = {s["id"]: 0 for s in shift_requirements}

    # Populate employee shifts and shift worker count
    for entry in schedule:
        emp_id = entry["emp_id"]
        shift_id = entry["shift_id"]
        shift = get_shift_by_id(shift_id, shift_requirements)

        if shift is None:
            print(f"Invalid shift ID {shift_id} in schedule.")
            return False

        employee_shifts[emp_id].append(shift)
        shift_worker_count[shift_id] += 1

    # Validate each employee's shifts
    for emp_id, shifts in employee_shifts.items():
        employee = next(e for e in employees if e["id"] == emp_id)
        skills = employee["skills"]

        # Check if all assigned shifts match the employee's skills
        if not all(shift["skill"] in skills for shift in shifts):
            print(f"Employee {emp_id} has shifts not matching their skills.")
            return False

        # Check for overlapping shifts
        for i, shift1 in enumerate(shifts):
            for shift2 in shifts[i + 1 :]:
                if shifts_overlap(shift1, shift2):
                    print(
                        f"Employee {emp_id} has overlapping shifts: {shift1} and {shift2}."
                    )
                    return False

    # Validate shift requirements
    for shift_id, count in shift_worker_count.items():
        shift = get_shift_by_id(shift_id, shift_requirements)
        if shift is None:
            print(f"Invalid shift ID {shift_id} in shift requirements.")
            return False
        if count > shift["required_workers"]:
            print(
                f"Shift {shift_id} does not meet the required number of workers. Required: {shift['required_workers']}, Assigned: {count}"
            )
            return False

    # Check that all fixed schedules are present
    fixed_schedule_set = {
        (entry["emp_id"], entry["shift_id"]) for entry in fixed_schedule
    }
    schedule_set = {(entry["emp_id"], entry["shift_id"]) for entry in schedule}

    if not fixed_schedule_set.issubset(schedule_set):
        missing_schedules = fixed_schedule_set - schedule_set
        print(f"Fixed schedules missing from the solution: {missing_schedules}")
        return False

    return True


# JUST FOR TEST - CAN REMOVE 2/2 ---------------------------------------------

if __name__ == "__main__":
    employees = generate_employees(100)
    shift_requirements = generate_random_shift_requirements(100)
    start_time = time.time()
    employees = update_employees(employees)
    best_solution = genetic_algorithm(
        fixed_schedule,
        employees,
        shift_requirements,
        pop_size=50,
        generations=100,
        mutation_rate=0.2,
    )
    print(best_solution)
    # print(time.time() - start_time)
