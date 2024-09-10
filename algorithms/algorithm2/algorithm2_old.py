import random
from collections import defaultdict

shift_requirements = [
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "7:00", "end_time": "11:30", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "15:00", "end_time": "20:00", "required_workers": 15},
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "20:00", "end_time": "23:00", "required_workers": 13},
    {"skill": "Cable Technician", "day": "Sunday", "start_time": "23:00", "end_time": "24:00", "required_workers": 5},
    {"skill": "Cable Technician", "day": "Monday", "start_time": "7:00", "end_time": "11:00", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Monday", "start_time": "14:00", "end_time": "18:00", "required_workers": 15},
    {"skill": "Cable Technician", "day": "Monday", "start_time": "20:00", "end_time": "24:00", "required_workers": 12},
    {"skill": "Cable Technician", "day": "Tuesday", "start_time": "7:00", "end_time": "11:30", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Tuesday", "start_time": "15:00", "end_time": "20:00", "required_workers": 15},
    {"skill": "Cable Technician", "day": "Wednesday", "start_time": "12:00", "end_time": "16:00", "required_workers": 13},
    {"skill": "Cable Technician", "day": "Wednesday", "start_time": "20:00", "end_time": "24:00", "required_workers": 5},
    {"skill": "Cable Technician", "day": "Thursday", "start_time": "7:00", "end_time": "11:00", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Thursday", "start_time": "14:00", "end_time": "18:00", "required_workers": 15},
    {"skill": "Cable Technician", "day": "Friday", "start_time": "10:00", "end_time": "16:00", "required_workers": 12},
    {"skill": "Cable Technician", "day": "Saturday", "start_time": "7:00", "end_time": "11:30", "required_workers": 10},
    {"skill": "Cable Technician", "day": "Saturday", "start_time": "20:00", "end_time": "24:00", "required_workers": 15},
    
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "7:00", "end_time": "12:30", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "15:00", "end_time": "20:00", "required_workers": 15},
    {"skill": "WIFI Technician", "day": "Sunday", "start_time": "20:00", "end_time": "24:00", "required_workers": 16},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "0:00", "end_time": "7:00", "required_workers": 5},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "8:00", "end_time": "11:00", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "14:00", "end_time": "18:00", "required_workers": 15},
    {"skill": "WIFI Technician", "day": "Monday", "start_time": "20:00", "end_time": "24:00", "required_workers": 12},
    {"skill": "WIFI Technician", "day": "Tuesday", "start_time": "7:00", "end_time": "12:30", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Tuesday", "start_time": "15:00", "end_time": "20:00", "required_workers": 15},
    {"skill": "WIFI Technician", "day": "Wednesday", "start_time": "20:00", "end_time": "24:00", "required_workers": 16},
    {"skill": "WIFI Technician", "day": "Thursday", "start_time": "0:00", "end_time": "7:00", "required_workers": 5},
    {"skill": "WIFI Technician", "day": "Thursday", "start_time": "8:00", "end_time": "11:00", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Thursday", "start_time": "14:00", "end_time": "18:00", "required_workers": 15},
    {"skill": "WIFI Technician", "day": "Friday", "start_time": "10:00", "end_time": "16:00", "required_workers": 12},
    {"skill": "WIFI Technician", "day": "Saturday", "start_time": "7:00", "end_time": "12:30", "required_workers": 10},
    {"skill": "WIFI Technician", "day": "Saturday", "start_time": "20:00", "end_time": "24:00", "required_workers": 15},
    
    {"skill": "TV Technician", "day": "Sunday", "start_time": "8:00", "end_time": "12:00", "required_workers": 8},
    {"skill": "TV Technician", "day": "Sunday", "start_time": "15:00", "end_time": "20:00", "required_workers": 10},
    {"skill": "TV Technician", "day": "Sunday", "start_time": "20:00", "end_time": "24:00", "required_workers": 7},
    {"skill": "TV Technician", "day": "Monday", "start_time": "9:00", "end_time": "12:00", "required_workers": 5},
    {"skill": "TV Technician", "day": "Monday", "start_time": "14:00", "end_time": "18:00", "required_workers": 6},
    {"skill": "TV Technician", "day": "Tuesday", "start_time": "8:00", "end_time": "12:00", "required_workers": 8},
    {"skill": "TV Technician", "day": "Tuesday", "start_time": "15:00", "end_time": "20:00", "required_workers": 10},
    {"skill": "TV Technician", "day": "Wednesday", "start_time": "20:00", "end_time": "24:00", "required_workers": 7},
    {"skill": "TV Technician", "day": "Thursday", "start_time": "9:00", "end_time": "12:00", "required_workers": 5},
    {"skill": "TV Technician", "day": "Thursday", "start_time": "14:00", "end_time": "18:00", "required_workers": 6},
    {"skill": "TV Technician", "day": "Friday", "start_time": "8:00", "end_time": "12:00", "required_workers": 8},
    {"skill": "TV Technician", "day": "Friday", "start_time": "15:00", "end_time": "20:00", "required_workers": 10},
    {"skill": "TV Technician", "day": "Saturday", "start_time": "20:00", "end_time": "24:00", "required_workers": 7},
    {"skill": "TV Technician", "day": "Saturday", "start_time": "9:00", "end_time": "12:00", "required_workers": 5}
]



employees = []

def generate_random_employee(id):
    names = ["Meir", "Haim", "Cohen", "Levi", "David", "Isaac", "Jacob", "Sarah", "Rebecca", "Rachel", "Aaron", "Moses", "Daniel", "Elijah", "Abraham", "Noah", "Joseph", "Benjamin", "Samuel", "Gideon"]
    skills = ["Cable Technician", "WIFI Technician", "TV Technician"]
    name = random.choice(names)
    num_skills = random.randint(1, len(skills))
    employee_skills = skills
    min_hours = 20
    max_hours = 40
    return {"id": id, "name": name, "skills": random.sample(employee_skills, num_skills), "min_hours": min_hours, "max_hours": max_hours}

def generate_employees(n):
    for i in range(1, n + 1):
        employees.append(generate_random_employee(i))
    return employees

# Example usage
n = 85  # Number of employees to generate
MUTATION_RATE = 1

random_employees = generate_employees(n)

# Function to print the population
def print_population(population):
    for i, schedule in enumerate(population):
        print(f"Schedule {i+1}:")
        for emp_id, shifts in schedule.items():
            employee = next(emp for emp in employees if emp["id"] == emp_id)
            print(f"  Employee ID: {emp_id} ({employee['name']})")
            for shift in shifts:
                print(f"    Day: {shift['day']}, Start Time: {shift['start_time']}, End Time: {shift['end_time']}, Skill: {shift['skill']}, Required Workers: {shift['required_workers']}")
        print()

def generate_population(pop_size):
    population = []
    for _ in range(pop_size):
        schedule = defaultdict(list)
        random.shuffle(shift_requirements)
        for shift in shift_requirements:
            eligible_employees = [emp for emp in employees if shift["skill"] in emp["skills"]]
            if eligible_employees:
                random.shuffle(eligible_employees)  # Randomize employee order
                required_workers = shift["required_workers"]
                assigned_workers = 0
                for emp in eligible_employees:
                    if assigned_workers >= required_workers:
                        break
                    # Check if adding this shift violates max hours constraint
                    total_hours = sum((int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0])) for shift in schedule[emp["id"]])
                    total_hours += (int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0]))
                    if total_hours > (random.random() * (emp["max_hours"] - emp["min_hours"]) + 2 * emp["min_hours"]) / 2 :
                        continue
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


CONTRACT_VIOLATION_PENALTY = 50

def calculate_fitness(schedule):
    total_fitness = 0
    shift_counter = defaultdict(int)
    
    # Create a dictionary containing all employees
    all_employees = {emp["id"]: emp for emp in employees}
    
    # Loop through all employees, including scheduled and unscheduled ones
    for emp_id, emp_data in all_employees.items():
        total_emp_hours = 0
        # If the employee is scheduled, calculate their hours
        if emp_id in schedule:
            for shift in schedule[emp_id]:
                shift_key = (shift["skill"], shift["day"], shift["start_time"], shift["end_time"])
                shift_counter[shift_key] += 1
                shift_start = int(shift["start_time"].split(":")[0]) + int(shift["start_time"].split(":")[1]) / 60
                shift_end = int(shift["end_time"].split(":")[0]) + int(shift["end_time"].split(":")[1]) / 60
                total_emp_hours += (shift_end - shift_start)
            
            if total_emp_hours < emp_data["min_hours"]:
                total_fitness += CONTRACT_VIOLATION_PENALTY + (emp_data["min_hours"] - total_emp_hours)
            if total_emp_hours > emp_data["max_hours"]:
                total_fitness += CONTRACT_VIOLATION_PENALTY + (total_emp_hours - emp_data["max_hours"])
        else:
            if emp_data["min_hours"] > 0:
                total_fitness += CONTRACT_VIOLATION_PENALTY + emp_data["min_hours"]
    
    # Check for unfilled shifts and penalize
    for shift in shift_requirements:
        shift_key = (shift["skill"], shift["day"], shift["start_time"], shift["end_time"])
        if shift_key not in shift_counter or shift_counter[shift_key] < shift["required_workers"]:
            total_fitness += (shift["required_workers"] - shift_counter.get(shift_key, 0))
    
    return total_fitness

def crossover(parent1, parent2):
    child = defaultdict(list)
    shift_requirements_met = defaultdict(int)  # Keep track of how many shifts of each type have been added

    # Combine shifts from both parents
    for parent in [parent1, parent2]:
        for emp_id, shifts in parent.items():
            for shift in shifts:
                # Check if the required number of workers for this shift type has been met
                shift_key = (shift["skill"], shift["day"], shift["start_time"], shift["end_time"])
                if shift_requirements_met[shift_key] < shift["required_workers"]:
                    # Check for overlapping shifts in the child's schedule
                    overlap = False
                    for existing_shift in child[emp_id]:
                        if shift["day"] == existing_shift["day"]:
                            # Convert shift times to minutes for easier comparison
                            new_shift_start = int(shift["start_time"].split(":")[0]) * 60 + int(shift["start_time"].split(":")[1])
                            new_shift_end = int(shift["end_time"].split(":")[0]) * 60 + int(shift["end_time"].split(":")[1])
                            existing_shift_start = int(existing_shift["start_time"].split(":")[0]) * 60 + int(existing_shift["start_time"].split(":")[1])
                            existing_shift_end = int(existing_shift["end_time"].split(":")[0]) * 60 + int(existing_shift["end_time"].split(":")[1])
                            if new_shift_start < existing_shift_end and new_shift_end > existing_shift_start:
                                overlap = True
                                break
                    if not overlap:
                        # Check if adding this shift violates max hours constraint
                        total_hours = sum((int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0])) for shift in child[emp_id])
                        total_hours += (int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0]))
                        employee = next(emp for emp in employees if emp["id"] == emp_id)
                        if total_hours <= employee["max_hours"]:
                            # Append the shift to the child's schedule
                            child[emp_id].append(shift)
                            # Increment the counter for this shift type
                            shift_requirements_met[shift_key] += 1

    # Ensure the child's schedule meets the required workers for each shift
    for shift in shift_requirements:
        shift_key = (shift["skill"], shift["day"], shift["start_time"], shift["end_time"])
        while shift_requirements_met[shift_key] < shift["required_workers"]:
            eligible_employees = [emp for emp in employees if shift["skill"] in emp["skills"]]
            if not eligible_employees:
                break
            random.shuffle(eligible_employees)
            for emp in eligible_employees:
                if shift_requirements_met[shift_key] >= shift["required_workers"]:
                    break
                # Check for overlapping shifts and max hours
                overlap = False
                for existing_shift in child[emp["id"]]:
                    if shift["day"] == existing_shift["day"]:
                        new_shift_start = int(shift["start_time"].split(":")[0]) * 60 + int(shift["start_time"].split(":")[1])
                        new_shift_end = int(shift["end_time"].split(":")[0]) * 60 + int(shift["end_time"].split(":")[1])
                        existing_shift_start = int(existing_shift["start_time"].split(":")[0]) * 60 + int(existing_shift["start_time"].split(":")[1])
                        existing_shift_end = int(existing_shift["end_time"].split(":")[0]) * 60 + int(existing_shift["end_time"].split(":")[1])
                        if new_shift_start < existing_shift_end and new_shift_end > existing_shift_start:
                            overlap = True
                            break
                if not overlap:
                    total_hours = sum((int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0])) for shift in child[emp["id"]])
                    total_hours += (int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0]))
                    if total_hours <= emp["max_hours"]:
                        child[emp["id"]].append(shift)
                        shift_requirements_met[shift_key] += 1

    return child



def mutation(child):
    # Randomly swap two shifts between two employees with the same skills
    emp_ids = list(child.keys())
    if len(emp_ids) < 2:
        return child
    emp1, emp2 = random.sample(emp_ids, 2)
    if child[emp1] and child[emp2]:
        shift1 = random.choice(child[emp1])
        shift2 = random.choice(child[emp2])
        emp1_skills = next(emp for emp in employees if emp["id"] == emp1)["skills"]
        emp2_skills = next(emp for emp in employees if emp["id"] == emp2)["skills"]

        # Check if employees have the required skills for the shifts
        if shift1["skill"] in emp2_skills and shift2["skill"] in emp1_skills:
            # Check for overlapping shifts
            overlap1 = any(s for s in child[emp2] if s["day"] == shift1["day"] and
                            ((shift1["start_time"] < s["end_time"] and shift1["end_time"] > s["start_time"])))
            overlap2 = any(s for s in child[emp1] if s["day"] == shift2["day"] and
                            ((shift2["start_time"] < s["end_time"] and shift2["end_time"] > s["start_time"])))
            if not overlap1 and not overlap2:
                # Calculate total hours for each employee after the swap
                total_hours_emp1 = sum((int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0])) for shift in child[emp1])
                total_hours_emp1 += (int(shift2["end_time"].split(":")[0]) - int(shift2["start_time"].split(":")[0]))

                total_hours_emp2 = sum((int(shift["end_time"].split(":")[0]) - int(shift["start_time"].split(":")[0])) for shift in child[emp2])
                total_hours_emp2 += (int(shift1["end_time"].split(":")[0]) - int(shift1["start_time"].split(":")[0]))

                employee1 = next(emp for emp in employees if emp["id"] == emp1)
                employee2 = next(emp for emp in employees if emp["id"] == emp2)

                # Check if the swap violates maximum hours constraint for any employee
                if total_hours_emp1 <= employee1["max_hours"] and total_hours_emp2 <= employee2["max_hours"]:
                    # If not, perform the swap
                    child[emp1].remove(shift1)
                    child[emp2].remove(shift2)
                    child[emp1].append(shift2)
                    child[emp2].append(shift1)
    return child

def calculate_probs(fitnesses):
    worst_fitness = max(fitnesses)
    normal_fitnesses = [(worst_fitness - fitness + 1) for fitness in fitnesses]
    sum_normal_fitnesses = sum(normal_fitnesses)
    probs = [fitness / sum_normal_fitnesses for fitness in normal_fitnesses]
    return probs


# Genetic Algorithm
def genetic_algorithm(pop_size, generations):
    population = generate_population(pop_size)
    for generation in range(generations):
        fitnesses = [calculate_fitness(schedule) for schedule in population]

        best_fitness = min(fitnesses)
        probabilities = calculate_probs(fitnesses)

        # Check for perfect solution
        if best_fitness == 0:
            best_schedule = population[fitnesses.index(0)]
            print(f"Perfect solution found in generation {generation}")
            return best_schedule
        
        # Elitism: Find the best schedule (minimum fitness)
        best_schedule = population[fitnesses.index(best_fitness)]

        new_population = [best_schedule]  # Start new population with the best genome
        while len(new_population) < pop_size:
            parents = random.choices(population, weights=probabilities, k=2)
            child = crossover(*parents)
            if random.random() < MUTATION_RATE:
                mutation(child)
            new_population.append(child)

        population = new_population

        # Optional: print the best fitness of the current generation
        print(f"Generation {generation}: Best Fitness = {best_fitness}")

    ret = min(population, key=calculate_fitness)
    print("Fitness: " + str(calculate_fitness(ret)))
    return ret

best_schedule = genetic_algorithm(pop_size=100, generations=50)

def print_schedule(schedule):
    # Define a dictionary to map days to numerical values
    day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7}
    
    print("Best Schedule:")
    # Sort schedule by employee ID
    sorted_schedule = sorted(schedule.items(), key=lambda x: x[0])
    
    for emp_id, shifts in sorted_schedule:
        # Find the employee data based on employee ID
        employee = next(emp for emp in employees if emp["id"] == emp_id)
        # Sort shifts by day and start time
        sorted_shifts = sorted(shifts, key=lambda x: (day_order[x['day']], int(x['start_time'].split(':')[0])))
        print(f"Employee ID: {emp_id}, Skills: {', '.join(employee['skills'])}")
        for shift in sorted_shifts:
            print(f"  Day: {shift['day']}, Start Time: {shift['start_time']}, End Time: {shift['end_time']}, Skill: {shift['skill']}, Required Workers: {shift['required_workers']}")
        print()


# Print the best schedule
print_schedule(best_schedule)

def print_schedule_with_employees(schedule):
    # Define a dictionary to map days to numerical values
    day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7}
    
    print("Unfilled Shifts:")
    sorted_shifts = sorted(shift_requirements, key=lambda x: (day_order[x['day']], int(x['start_time'].split(':')[0])))
    for shift in sorted_shifts:
        required_workers = shift['required_workers']
        filled_workers = sum(1 for emp in schedule.keys() if shift in schedule[emp])
        if filled_workers < required_workers:
            print(f"Shift Details:")
            print(f"Day: {shift['day']}, Start Time: {shift['start_time']}, End Time: {shift['end_time']}, Skill: {shift['skill']}, Required Workers: {required_workers - filled_workers}")
            print()
        elif filled_workers < required_workers:
            print("Error")



# Print the best schedule with employee IDs for each shift
print_schedule_with_employees(best_schedule)
