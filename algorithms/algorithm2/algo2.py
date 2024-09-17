import random
from datetime import datetime, timedelta
from collections import defaultdict
from python import sys
from typing import List


class ScheduleItem:
    emp_id: int
    shift_id: int

    def __init__(self, emp_id: int, shift_id: int):
        self.emp_id = emp_id
        self.shift_id = shift_id

    def __repr__(self):
        return (
            '{"emp_id": "'
            + str(self.emp_id)
            + '", "shift_id": '
            + str(self.shift_id)
            + "}"
        )


def parse_fixed_schedule(schedule_data: str) -> List[ScheduleItem]:
    schedule_items = []
    lines = schedule_data.strip().split("=")

    for line in lines:
        fields = line.split(",")
        if len(fields) == 2:
            try:
                shift_id = int(fields[0])
                emp_id = int(fields[1])

                schedule_item = ScheduleItem(emp_id=emp_id, shift_id=shift_id)
                schedule_items.append(schedule_item)
            except ValueError as e:
                print(f"Frror processing line: {line}. Error: {e}")

    return schedule_items


class ShiftRequirement:
    id: int
    skill: str
    day: str
    start_time: str
    end_time: str
    required_workers: int

    def __init__(
        self,
        id: int,
        skill: str,
        day: str,
        start_time: str,
        end_time: str,
        required_workers: int,
    ):
        self.id = id
        self.skill = skill
        self.day = day
        self.start_time = start_time
        self.end_time = end_time
        self.required_workers = required_workers

    def __eq__(self, other):
        if not isinstance(other, ShiftRequirement):
            return False
        return (
            self.id == other.id
            and self.skill == other.skill
            and self.day == other.day
            and self.start_time == other.start_time
            and self.end_time == other.end_time
            and self.required_workers == other.required_workers
        )


def parse_shift_requirements(shift_data: str) -> List[ShiftRequirement]:
    shift_requirements = []
    lines = shift_data.strip().split("=")

    for line in lines:
        fields = line.split(",")
        if len(fields) == 6:
            try:
                shift_id = int(fields[0])
                skill = fields[1]
                day = fields[2]
                start_time = fields[3]
                end_time = fields[4]
                required_workers = int(fields[5])

                shift_requirement = ShiftRequirement(
                    id=shift_id,
                    skill=skill,
                    day=day,
                    start_time=start_time,
                    end_time=end_time,
                    required_workers=required_workers,
                )
                shift_requirements.append(shift_requirement)
            except ValueError as e:
                print(f"Srror processing line: {line}. Error: {e}")

    return shift_requirements


class Employee:
    id: int
    name: str
    skills: list[str]
    min_hours: float
    max_hours: float

    def __init__(
        self, id: int, name: str, skills: list[str], min_hours: float, max_hours: float
    ):
        self.id = id
        self.name = name
        self.skills = skills
        self.min_hours = min_hours
        self.max_hours = max_hours


def parse_employees(employee_data: str) -> List[Employee]:
    employees = []
    lines = employee_data.strip().split("=")

    for line in lines:
        fields = line.split(",")
        if len(fields) == 7:
            try:
                id = int(fields[0])
                name = fields[1]
                skills = [field for field in fields[2:5] if field]
                min_hours = float(fields[5])
                max_hours = float(fields[6])

                employee = Employee(
                    id=id,
                    name=name,
                    skills=skills,
                    min_hours=min_hours,
                    max_hours=max_hours,
                )
                employees.append(employee)
            except ValueError as e:
                print(f"Error processing line: {line}. Error: {e}")

    return employees


# Helper Functions
def get_shift_by_id(shift_id, shift_requirements):
    return next((shift for shift in shift_requirements if shift.id == shift_id), None)


# Custom parse function to handle times including "24:00"
def parse_time(time_str):
    # Handle the special "24:00" case
    if time_str == "24:00":
        return datetime(year=1900, month=1, day=2, hour=0, minute=0)

    # Manually parse the time string "HH:MM"
    hours, minutes = list(map(int, time_str.split(":")))
    return datetime(year=1900, month=1, day=1, hour=hours, minute=minutes)


def shifts_overlap(shift1, shift2):
    # Check if the shifts are on the same day
    if shift1.day != shift2.day:
        return False

    def parse_time(time_str):
        if time_str == "24:00":
            time_str = "23:59"
        hours, minutes = list(map(int, time_str.split(":")))
        return datetime(year=1900, month=1, day=1, hour=hours, minute=minutes)

    start_time1 = parse_time(shift1.start_time).time()
    end_time1 = parse_time(shift1.end_time).time()
    start_time2 = parse_time(shift2.start_time).time()
    end_time2 = parse_time(shift2.end_time).time()

    # Check if the times overlap
    return start_time1 < end_time2 and start_time2 < end_time1


def calculate_shift_hours(shift):
    start_time = parse_time(shift.start_time)
    end_time = parse_time(shift.end_time)
    return round((end_time - start_time).seconds / 3600, 2)


def calculate_employee_hours(schedule_of_employee):
    total_hours = 0.0
    for shift in schedule_of_employee:
        total_hours += calculate_shift_hours(shift)
    return total_hours


def generate_random_schedule(employees, shift_requirements, fixed_schedule):
    # Initialize shift worker count dictionary
    shift_worker_count = {shift.id: 0 for shift in shift_requirements}

    # Dictionary to track employee shifts
    employee_shifts = {e.id: [] for e in employees}

    # Process fixed schedules
    for s in fixed_schedule:
        shift = get_shift_by_id(s.shift_id, shift_requirements)
        employee_shifts[s.emp_id].append(shift)
        shift_worker_count[s.shift_id] += 1

    # Shuffle the employees and shift requirements for randomness
    random_employees = random.sample(employees, len(employees))
    random_shift_requirements = random.sample(
        shift_requirements, len(shift_requirements)
    )

    # First round: Satisfy minimum hours for each employee
    for employee in random_employees:
        current_hours = calculate_employee_hours(employee_shifts[employee.id])
        current_index = 0
        while current_hours < employee.min_hours:
            found_shift = False
            for i in range(current_index, len(random_shift_requirements)):
                shift = random_shift_requirements[i]
                shift_hours = calculate_shift_hours(shift)

                if (
                    shift_worker_count[shift.id] < shift.required_workers
                    and shift.skill in employee.skills
                    and ((shift_hours + current_hours) <= employee.max_hours)
                    and not any(
                        shifts_overlap(shift, existing_shift)
                        for existing_shift in employee_shifts[employee.id]
                    )
                ):
                    # Assign the shift to the employee
                    shift_worker_count[shift.id] += 1
                    current_hours += shift_hours
                    employee_shifts[employee.id].append(shift)
                    current_index = i + 1
                    found_shift = True

                    # Remove the shift from random_shift_requirements if it is full
                    if shift_worker_count[shift.id] == shift.required_workers:
                        random_shift_requirements.pop(i)
                        current_index -= 1

                    break

            if not found_shift:
                break

    # Second round: Try to reach maximum hours for each employee
    for employee in random_employees:
        current_hours = calculate_employee_hours(employee_shifts[employee.id])
        current_index = 0
        while current_hours < employee.max_hours:
            found_shift = False
            for i in range(current_index, len(random_shift_requirements)):
                shift = random_shift_requirements[i]
                additional_hours = calculate_shift_hours(shift)
                if (
                    current_hours + additional_hours <= employee.max_hours
                    and shift_worker_count[shift.id] < shift.required_workers
                    and shift.skill in employee.skills
                    and not any(
                        shifts_overlap(shift, existing_shift)
                        for existing_shift in employee_shifts[employee.id]
                    )
                ):
                    # Assign the shift to the employee
                    shift_worker_count[shift.id] += 1
                    current_hours += additional_hours
                    employee_shifts[employee.id].append(shift)
                    current_index = i + 1
                    found_shift = True

                    # Remove the shift from random_shift_requirements if it is full
                    if shift_worker_count[shift.id] == shift.required_workers:
                        random_shift_requirements.pop(i)
                        current_index -= 1

                    break
            if not found_shift:
                break

    return employee_shifts, shift_worker_count


def initialize_population(pop_size, fixed_schedule, employees, shift_requirements):

    def generate_schedule():
        return generate_random_schedule(employees, shift_requirements, fixed_schedule)

    # Generate the population
    population = [generate_schedule() for _ in range(pop_size)]

    return population


def fitness(employees, shift_requirements, employee_shifts, shift_worker_count):
    CONTRACT_VIOLATION_PENALTY = 5
    total_penalty = 0.0

    # Calculate penalties based on shift requirements and employee constraints
    for shift in shift_requirements:
        total_penalty += shift.required_workers - shift_worker_count[shift.id]

    for emp in employees:
        total_hours = calculate_employee_hours(employee_shifts[emp.id])
        if total_hours < emp.min_hours:
            total_penalty += CONTRACT_VIOLATION_PENALTY + emp.min_hours - total_hours
        if total_hours > emp.max_hours:
            total_penalty += CONTRACT_VIOLATION_PENALTY + total_hours - emp.max_hours

    return total_penalty


def crossover(
    employees, shift_requirements, parent1_employee_shifts, parent2_employee_shifts
):
    # Initialize child shift dictionaries
    child1_employee_shifts = {emp.id: [] for emp in employees}
    child2_employee_shifts = {emp.id: [] for emp in employees}

    # Initialize shift worker count dictionaries
    child1_shift_worker_count = {shift.id: 0 for shift in shift_requirements}
    child2_shift_worker_count = {shift.id: 0 for shift in shift_requirements}

    # Shuffle employees to randomize crossover assignment
    random_employees = random.sample(employees, len(employees))

    # Split the employees into halves for inheritance
    mid_point = len(random_employees) // 2

    for i, employee in enumerate(random_employees):
        emp_id = employee.id

        if i < mid_point:
            # Child 1 takes from Parent 1, Child 2 from Parent 2
            parent1_shifts = parent1_employee_shifts[emp_id]
            parent2_shifts = parent2_employee_shifts[emp_id]
        else:
            # Child 1 takes from Parent 2, Child 2 from Parent 1
            parent1_shifts = parent2_employee_shifts[emp_id]
            parent2_shifts = parent1_employee_shifts[emp_id]

        # Assign shifts to Child 1, ensuring shift requirements are not exceeded
        for shift in parent1_shifts:
            shift_id = shift.id
            required_workers = shift.required_workers
            if child1_shift_worker_count[shift_id] < required_workers:
                child1_employee_shifts[emp_id].append(shift)
                child1_shift_worker_count[shift_id] += 1

        # Assign shifts to Child 2, ensuring shift requirements are not exceeded
        for shift in parent2_shifts:
            shift_id = shift.id
            required_workers = shift.required_workers
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
    employee_id = employee.id

    assigned_shifts = employee_shifts[employee_id]

    if assigned_shifts:
        # Randomly select one shift to remove if there are assigned shifts
        shift_to_remove = random.choice(assigned_shifts)
        if (employee_id, shift_to_remove.id) not in fixed_schedule_set:
            assigned_shifts.remove(shift_to_remove)
            shift_worker_count[
                shift_to_remove.id
            ] -= 1  # Decrease the count for the removed shift

    # Shuffle shift requirements to randomly order them
    random_shift_requirements = random.sample(
        shift_requirements, len(shift_requirements)
    )

    # Try to add a new valid shift
    for shift in random_shift_requirements:
        if (
            shift_worker_count[shift.id] < shift.required_workers
            and shift.skill in employee.skills
            and not any(
                shifts_overlap(shift, existing_shift)
                for existing_shift in assigned_shifts
            )
        ):
            # Assign the new shift
            assigned_shifts.append(shift)
            shift_worker_count[shift.id] += 1
            break  # Return


def calculate_crossover_probabilities(fitness_scores):
    # Normalized crossover probabilities
    crossover_probabilities = [int(fitness * 2) for fitness in fitness_scores]
    return crossover_probabilities


def select_parents(population, crossover_probabilities):
    # Select two parents based on crossover probabilities
    parents = random.choices(population, weights=crossover_probabilities, k=2)
    return parents[0], parents[1]


def fill_shifts(
    employees,
    shift_requirements,
    employee_shifts: dict[int, list[ShiftRequirement]],
    shift_worker_count: dict[int, int],
):
    # Iterate through all shift requirements
    for shift in shift_requirements:
        shift_id = shift.id
        max_required_workers = shift.required_workers

        # If the shift is already fully staffed, skip it
        if shift_worker_count[shift_id] >= max_required_workers:
            continue

        skill_required = shift.skill

        # Iterate through all employees to fill the shift
        for employee in employees:
            emp_id = employee.id
            employee_skills = employee.skills

            # Check if the employee has the required skill and can be assigned to the shift
            if skill_required in employee_skills and not any(
                shifts_overlap(shift, existing_shift)
                for existing_shift in employee_shifts[emp_id]
            ):
                # Calculate the additional hours this shift would add
                additional_hours = calculate_shift_hours(shift)
                # Check if assigning this shift exceeds the employee's maximum hours
                current_hours = calculate_employee_hours(employee_shifts[emp_id])
                if current_hours + additional_hours <= employee.max_hours:
                    # Assign the shift to the employee
                    employee_shifts[emp_id].append(shift)
                    shift_worker_count[shift_id] += 1
                    if shift_worker_count[shift_id] == max_required_workers:
                        break  # Move to the next shift requirement if the current shift is filled

    return employee_shifts, shift_worker_count


def convert_employee_shifts_to_schedule(
    employee_shifts: dict[int, list[ShiftRequirement]]
) -> list[ScheduleItem]:
    schedule = []

    # Iterate over the dictionary with employee IDs and their assigned shifts
    for emp_id, shifts in employee_shifts.items():
        for shift in shifts:
            # Append a new dictionary with employee ID and shift ID to the schedule list
            schedule.append(ScheduleItem(emp_id=emp_id, shift_id=shift.id))

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
) -> list[ScheduleItem]:
    fixed_schedule_set = {(entry.emp_id, entry.shift_id) for entry in fixed_schedule}
    population = initialize_population(
        pop_size, fixed_schedule, employees, shift_requirements
    )
    fitness_scores = [
        fitness(employees, shift_requirements, schedule[0], schedule[1])
        for schedule in population
    ]
    num_elites = int(pop_size * elitism_rate)
    num_new_population = pop_size - num_elites
    previous_best_fitness = -1.0
    original_mutation_rate = mutation_rate
    stagnation_counter = 0

    for generation in range(generations):
        best_fitness = min(fitness_scores)

        # Check for perfect solution
        if best_fitness == 0:
            best_schedule = population[fitness_scores.index(best_fitness)]
            return convert_employee_shifts_to_schedule(best_schedule[0])

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


if __name__ == "__main__":
    fixed_schedule_str = sys.stdin.readline().strip()
    employees_str = sys.stdin.readline().strip()
    shift_requirements_str = sys.stdin.readline().strip()
    fixed_schedule = parse_fixed_schedule(fixed_schedule_str)
    employees = parse_employees(employees_str)
    shift_requirements = parse_shift_requirements(shift_requirements_str)

    best_solution: list[ScheduleItem] = genetic_algorithm(
        fixed_schedule,
        employees,
        shift_requirements,
        pop_size=60,
        generations=10,
    )
    print(best_solution)
