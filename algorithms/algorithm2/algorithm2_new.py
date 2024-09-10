import random
import time
from datetime import datetime, timedelta
from joblib import Parallel, delayed
from collections import defaultdict
import copy


fixed_schedule = [
    {"emp_id": 0, "shift_id": 8},
    {"emp_id": 0, "shift_id": 6},
    {"emp_id": 0, "shift_id": 5},
    {"emp_id": 0, "shift_id": 4},
    # {"emp_id": 2, "shift_id": 8},
    # {"emp_id": 10, "shift_id": 0},
]

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
        "id": 1,
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
    {
        "id": 15,
        "skill": "Cable Technician",
        "day": "Saturday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 15,
    },
    {
        "id": 16,
        "skill": "WIFI Technician",
        "day": "Sunday",
        "start_time": "7:00",
        "end_time": "12:30",
        "required_workers": 10,
    },
    {
        "id": 17,
        "skill": "WIFI Technician",
        "day": "Sunday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 15,
    },
    {
        "id": 18,
        "skill": "WIFI Technician",
        "day": "Sunday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 16,
    },
    {
        "id": 19,
        "skill": "WIFI Technician",
        "day": "Monday",
        "start_time": "0:00",
        "end_time": "7:00",
        "required_workers": 5,
    },
    {
        "id": 20,
        "skill": "WIFI Technician",
        "day": "Monday",
        "start_time": "8:00",
        "end_time": "11:00",
        "required_workers": 10,
    },
    {
        "id": 21,
        "skill": "WIFI Technician",
        "day": "Monday",
        "start_time": "14:00",
        "end_time": "18:00",
        "required_workers": 15,
    },
    {
        "id": 22,
        "skill": "WIFI Technician",
        "day": "Monday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 12,
    },
    {
        "id": 23,
        "skill": "WIFI Technician",
        "day": "Tuesday",
        "start_time": "7:00",
        "end_time": "12:30",
        "required_workers": 10,
    },
    {
        "id": 24,
        "skill": "WIFI Technician",
        "day": "Tuesday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 15,
    },
    {
        "id": 25,
        "skill": "WIFI Technician",
        "day": "Wednesday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 16,
    },
    {
        "id": 26,
        "skill": "WIFI Technician",
        "day": "Thursday",
        "start_time": "0:00",
        "end_time": "7:00",
        "required_workers": 5,
    },
    {
        "id": 27,
        "skill": "WIFI Technician",
        "day": "Thursday",
        "start_time": "8:00",
        "end_time": "11:00",
        "required_workers": 10,
    },
    {
        "id": 28,
        "skill": "WIFI Technician",
        "day": "Thursday",
        "start_time": "14:00",
        "end_time": "18:00",
        "required_workers": 15,
    },
    {
        "id": 29,
        "skill": "WIFI Technician",
        "day": "Friday",
        "start_time": "10:00",
        "end_time": "16:00",
        "required_workers": 12,
    },
    {
        "id": 30,
        "skill": "WIFI Technician",
        "day": "Saturday",
        "start_time": "7:00",
        "end_time": "12:30",
        "required_workers": 10,
    },
    {
        "id": 31,
        "skill": "WIFI Technician",
        "day": "Saturday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 15,
    },
    {
        "id": 32,
        "skill": "TV Technician",
        "day": "Sunday",
        "start_time": "8:00",
        "end_time": "12:00",
        "required_workers": 8,
    },
    {
        "id": 33,
        "skill": "TV Technician",
        "day": "Sunday",
        "start_time": "8:00",
        "end_time": "12:00",
        "required_workers": 8,
    },
    {
        "id": 34,
        "skill": "TV Technician",
        "day": "Sunday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 10,
    },
    {
        "id": 35,
        "skill": "TV Technician",
        "day": "Sunday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 7,
    },
    {
        "id": 36,
        "skill": "TV Technician",
        "day": "Monday",
        "start_time": "9:00",
        "end_time": "12:00",
        "required_workers": 5,
    },
    {
        "id": 37,
        "skill": "TV Technician",
        "day": "Monday",
        "start_time": "14:00",
        "end_time": "18:00",
        "required_workers": 6,
    },
    {
        "id": 38,
        "skill": "TV Technician",
        "day": "Tuesday",
        "start_time": "8:00",
        "end_time": "12:00",
        "required_workers": 8,
    },
    {
        "id": 39,
        "skill": "TV Technician",
        "day": "Tuesday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 10,
    },
    {
        "id": 40,
        "skill": "TV Technician",
        "day": "Wednesday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 7,
    },
    {
        "id": 41,
        "skill": "TV Technician",
        "day": "Thursday",
        "start_time": "9:00",
        "end_time": "12:00",
        "required_workers": 5,
    },
    {
        "id": 42,
        "skill": "TV Technician",
        "day": "Thursday",
        "start_time": "14:00",
        "end_time": "18:00",
        "required_workers": 6,
    },
    {
        "id": 43,
        "skill": "TV Technician",
        "day": "Friday",
        "start_time": "8:00",
        "end_time": "12:00",
        "required_workers": 8,
    },
    {
        "id": 44,
        "skill": "TV Technician",
        "day": "Friday",
        "start_time": "15:00",
        "end_time": "20:00",
        "required_workers": 10,
    },
    {
        "id": 45,
        "skill": "TV Technician",
        "day": "Saturday",
        "start_time": "20:00",
        "end_time": "24:00",
        "required_workers": 7,
    },
    {
        "id": 46,
        "skill": "TV Technician",
        "day": "Saturday",
        "start_time": "9:00",
        "end_time": "12:00",
        "required_workers": 5,
    },
]


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


shift_dict = {shift["id"]: shift for shift in shift_requirements}


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
                    shift_worker_count[shift["id"]] += 1
                    additional_hours = (
                        parse_time(shift["end_time"]) - parse_time(shift["start_time"])
                    ).seconds / 3600
                    current_hours += additional_hours
                    employee_shifts[employee["id"]].append(shift)
                    current_index = i + 1
                    found_shift = True
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
                    shift_worker_count[shift["id"]] += 1
                    current_hours += additional_hours
                    employee_shifts[employee["id"]].append(shift)
                    current_index = i + 1
                    found_shift = True
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

    for generation in range(generations):
        best_fitness = min(fitness_scores)

        # Check for perfect solution
        if best_fitness == 0:
            best_schedule = population[fitness_scores.index(best_fitness)]
            print(f"Perfect solution found in generation {generation}: {best_schedule}")
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

        # Print the best fitness of the current generation
        print(f"Generation {generation}: Best Fitness = {best_fitness}")

    print("No perfect solution found.")
    return population[fitness_scores.index(min(fitness_scores))]


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


def convert_employee_shifts_to_schedule(employee_shifts):
    schedule = []

    # Iterate over the dictionary with employee IDs and their assigned shifts
    for emp_id, shifts in employee_shifts.items():
        for shift in shifts:
            # Append a new dictionary with employee ID and shift ID to the schedule list
            schedule.append({"emp_id": emp_id, "shift_id": shift["id"]})

    return schedule


def validate_schedule(schedule, shift_requirements, employees, fixed_schedule):
    # Initialize data structures
    employee_shifts = {e["id"]: [] for e in employees}
    shift_worker_count = {s["id"]: 0 for s in shift_requirements}
    employee_skills = {e["id"]: e["skills"] for e in employees}

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
        if count < shift["required_workers"]:
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


if __name__ == "__main__":
    employees = generate_employees(70)
    employees = update_employees(employees)
    start_time = time.time()  # Start timing
    best_solution = genetic_algorithm(
        fixed_schedule,
        employees,
        shift_requirements,
        pop_size=100,
        generations=20,
    )
    print(
        f"Best solution found: {convert_employee_shifts_to_schedule(best_solution[0])}"
    )
    print(
        validate_schedule(
            convert_employee_shifts_to_schedule(best_solution[0]),
            shift_requirements,
            employees,
            fixed_schedule,
        )
    )
    # pop = initialize_population(100, fixed_schedule, employees, shift_requirements)
    # print_schedule(
    #     convert_employee_shifts_to_schedule(pop[1][0]), shift_requirements, employees
    # )
    # print_shift_details(
    #     convert_employee_shifts_to_schedule(pop[1][0]), shift_requirements
    # )
    # print(
    #     "fitness:",
    #     fitness(employees, shift_requirements, pop[0][0], pop[0][1]),
    #     fitness(employees, shift_requirements, pop[1][0], pop[1][1]),
    # )
    # mutate(shift_requirements, pop[0][0], pop[0][1], employees, 1)
    # mutate(shift_requirements, pop[1][0], pop[1][1], employees, 1)
    # print(
    #     "fitness:",
    #     fitness(employees, shift_requirements, pop[0][0], pop[0][1]),
    #     fitness(employees, shift_requirements, pop[1][0], pop[1][1]),
    # )
    # end_time = time.time()  # End timing
    # print(f"Time taken: {end_time - start_time:.2f} seconds")  # Print elapsed time
    # start_time = time.time()  # Start timing
    # child1, child2 = crossover(employees, shift_requirements, pop[0][0], pop[1][0])
    # print(
    #     fitness(employees, shift_requirements, child1[0], child1[1]),
    #     fitness(employees, shift_requirements, child2[0], child2[1]),
    # )
    end_time = time.time()  # End timing
    print(f"Time taken: {end_time - start_time:.2f} seconds")  # Print elapsed time
