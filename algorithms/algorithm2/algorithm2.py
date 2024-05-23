import random
from collections import defaultdict

# Shift requirements
shift_requirements = [
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "7:00", "end_time": "11:30", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "10:00", "end_time": "15:00", "required_workers": 15},
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "12:00", "end_time": "16:00", "required_workers": 13},
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "12:00", "end_time": "20:00", "required_workers": 5},
    {"skill": "Cable Technician", "day": "Monday", "start_time": "7:00", "end_time": "11:00", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Monday", "start_time": "10:00", "end_time": "13:00", "required_workers": 15},
    {"skill": "Cable Technician", "day": "Monday", "start_time": "10:00", "end_time": "16:00", "required_workers": 12},
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "7:00", "end_time": "12:30", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "10:00", "end_time": "13:00", "required_workers": 15},
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "11:00", "end_time": "16:00", "required_workers": 16},
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "12:00", "end_time": "20:00", "required_workers": 5},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "8:00", "end_time": "11:00", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "10:00", "end_time": "13:00", "required_workers": 15},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "10:00", "end_time": "16:00", "required_workers": 12},
]

# Employees
employees = [
    {"id": 1, "name": "Meir", "skills": ["Cable Technician", "Operator"], "min_hours": 20, "max_hours": 40},
    {"id": 2, "name": "Haim", "skills": ["Operator", "WIFI Technician"], "min_hours": 20, "max_hours": 40},
    {"id": 3, "name": "Cohen", "skills": ["WIFI Technician"], "min_hours": 20, "max_hours": 40},
    {"id": 4, "name": "Levi", "skills": ["Operator"], "min_hours": 20, "max_hours": 40},
]

# Function to generate initial population
def generate_population(pop_size):
    population = []
    for _ in range(pop_size):
        schedule = defaultdict(list)
        for shift in shift_requirements:
            eligible_employees = [emp for emp in employees if shift["skill"] in emp["skills"]]
            if eligible_employees:
                random.shuffle(eligible_employees)  # Randomize employee order
                required_workers = shift["required_workers"]
                assigned_workers = 0
                for emp in eligible_employees:
                    if assigned_workers >= required_workers:
                        break
                    # Check for overlapping shifts
                    overlap = False
                    for existing_shift in schedule[emp["id"]]:
                        if shift["day"] == existing_shift["day"]:
                            # Convert shift times to minutes for easier comparison
                            new_shift_start = int(shift["start_time"].split(":")[0]) * 60 + int(shift["start_time"].split(":")[1])
                            new_shift_end = int(shift["end_time"].split(":")[0]) * 60 + int(shift["end_time"].split(":")[1])
                            existing_shift_start = int(existing_shift["start_time"].split(":")[0]) * 60 + int(existing_shift["start_time"].split(":")[1])
                            existing_shift_end = int(existing_shift["end_time"].split(":")[0]) * 60 + int(existing_shift["end_time"].split(":")[1])
                            if (not (new_shift_end <= existing_shift_start or existing_shift_end <= new_shift_start)):
                                overlap = True
                                break
                    if not overlap:
                        schedule[emp["id"]].append(shift)
                        assigned_workers += 1
        population.append(schedule)
    return population

# Function to calculate fitness
def calculate_fitness(schedule):
    total_fitness = 0
    for emp_id, shifts in schedule.items():
        total_emp_hours = 0
        for shift in shifts:
            shift_start = int(shift["start_time"].split(":")[0]) * 60 + int(shift["start_time"].split(":")[1])
            shift_end = int(shift["end_time"].split(":")[0]) * 60 + int(shift["end_time"].split(":")[1])
            total_emp_hours += (shift_end - shift_start) / 60
        employee = next(emp for emp in employees if emp["id"] == emp_id)
        if total_emp_hours < employee["min_hours"]:
            total_fitness += (employee["min_hours"] - total_emp_hours) ** 2
        if total_emp_hours > employee["max_hours"]:
            total_fitness += (total_emp_hours - employee["max_hours"]) ** 2
    return total_fitness

# Function for selection
def selection(population, k):
    # Tournament selection
    selected = []
    for _ in range(k):
        tournament = random.sample(population, 5)
        best = min(tournament, key=calculate_fitness)
        selected.append(best)
    return selected

# Function for crossover
def crossover(parent1, parent2):
    child = defaultdict(list)
    for parent in [parent1, parent2]:
        for emp_id, shifts in parent.items():
            for shift in shifts:
                # Check for overlapping shifts
                overlap = False
                for existing_shift in child[emp_id]:
                    if shift["day"] == existing_shift["day"]:
                        # Convert shift times to minutes for easier comparison
                        new_shift_start = int(shift["start_time"].split(":")[0]) * 60 + int(shift["start_time"].split(":")[1])
                        new_shift_end = int(shift["end_time"].split(":")[0]) * 60 + int(shift["end_time"].split(":")[1])
                        existing_shift_start = int(existing_shift["start_time"].split(":")[0]) * 60 + int(existing_shift["start_time"].split(":")[1])
                        existing_shift_end = int(existing_shift["end_time"].split(":")[0]) * 60 + int(existing_shift["end_time"].split(":")[1])
                        if (new_shift_start < existing_shift_end and new_shift_end > existing_shift_start):
                            overlap = True
                            break
                if not overlap:
                    child[emp_id].append(shift)
    return child

# Function for mutation
def mutation(child):
    # Randomly swap two shifts between two employees
    emp_ids = list(child.keys())
    if len(emp_ids) < 2:
        return child
    emp1, emp2 = random.sample(emp_ids, 2)
    if child[emp1] and child[emp2]:
        shift1 = random.choice(child[emp1])
        shift2 = random.choice(child[emp2])
        # Check for overlapping shifts
        overlap1 = any(s for s in child[emp2] if s["day"] == shift1["day"] and
                    ((shift1["start_time"] < s["end_time"] and shift1["end_time"] > s["start_time"])))
        overlap2 = any(s for s in child[emp1] if s["day"] == shift2["day"] and
                    ((shift2["start_time"] < s["end_time"] and shift2["end_time"] > s["start_time"])))
        if not overlap1 and not overlap2:
            child[emp1].remove(shift1)
            child[emp2].remove(shift2)
            child[emp1].append(shift2)
            child[emp2].append(shift1)
    return child

# Genetic Algorithm
def genetic_algorithm(pop_size, generations):
    population = generate_population(pop_size)
    for _ in range(generations):
        parents = selection(population, 2)
        child = crossover(*parents)
        child = mutation(child)
        population.append(child)
    return min(population, key=calculate_fitness)

# Example usage
best_schedule = genetic_algorithm(pop_size=100, generations=1000)

def print_schedule(schedule):
    print("Best Schedule:")
    for emp_id, shifts in schedule.items():
        print(f"Employee ID: {emp_id}")
        for shift in shifts:
            print(f"Day: {shift['day']}, Start Time: {shift['start_time']}, End Time: {shift['end_time']}, Skill: {shift['skill']}, Required Workers: {shift['required_workers']}")
        print()

# Print the best schedule
print_schedule(best_schedule)
