import csv
import random

# Initialize global counters
name_counter = 0
first_names = [
    'Oliver', 'Charlotte', 'Liam', 'Amelia', 'Noah', 'Sophia', 'James', 'Isabella', 'Elijah', 'Mia', 
    'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Mason', 'Avery', 'Logan', 'Ella', 'Jackson', 'Abigail',
    'Aiden', 'Scarlett', 'Henry', 'Emily', 'Sebastian', 'Elizabeth', 'Alexander', 'Sofia', 'Mateo', 
    'Mila', 'Daniel', 'Aria', 'Michael', 'Layla', 'William', 'Chloe', 'David', 'Grace', 'Joseph', 
    'Riley', 'Owen', 'Lily', 'Wyatt', 'Hannah', 'Matthew', 'Zoey', 'Jack', 'Leah', 'Samuel', 'Nora',
    'Isaac', 'Aubrey', 'Ethan', 'Eleanor', 'Jacob', 'Ellie', 'Luke', 'Stella', 'Gabriel', 'Lucy', 
    'Jayden', 'Maya', 'Carter', 'Paisley', 'Dylan', 'Natalie', 'Levi', 'Hazel', 'Julian', 'Savannah',
    'Anthony', 'Bella', 'Christopher', 'Aurora', 'Andrew', 'Willow', 'Lincoln', 'Violet', 'Nathan', 
    'Penelope', 'Hunter', 'Luna', 'Ryan', 'Eva', 'Isaiah', 'Victoria', 'Caleb', 'Alice', 'Joshua', 
    'Madeline', 'Maverick', 'Ariana', 'Adam', 'Claire', 'Thomas', 'Samantha', 'Leo', 'Hailey', 
    'John', 'Sadie', 'Landon', 'Gabriella'
]

last_names = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 
    'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 
    'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 
    'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 
    'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 
    'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 
    'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 
    'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 
    'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 
    'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell'
]

skills_list = [
    "Waiter", "Cleaner", "Cook", "Bartender", "Receptionist", "Driver", "Security Guard", "Dishwasher", "Janitor", 
    "Gardener", "Delivery Person", "Cashier", "Barista", "Housekeeper", "Kitchen Assistant", "Maintenance Worker", 
    "Porter", "Warehouse Worker", "Host/Hostess", "Chef", "Lifeguard", "Baggage Handler", "Clerk", "Stocker", 
    "Laundry Attendant", "Concierge", "Busser", "Mover", "Valet", "Parking Attendant", "Window Cleaner", 
    "Room Service Attendant", "Groundskeeper", "Carpenter", "Electrician", "Painter", "Plumber", 
    "Mechanic", "Construction Worker", "Waitstaff", "Bellhop", "Butcher", "Sous Chef", "Taxi Driver", "Chauffeur", 
    "Hairdresser", "Dog Walker", "Pet Groomer", "Nanny", "Babysitter"
]


def generate_name():
    # Sample a first name and a last name from the predefined lists
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    
    # Combine them into a full name
    return f"{first_name} {last_name}"


def create_time_array():
    times = []
    for hour in range(24):
        for minute in [0, 30]:
            times.append(f"{hour:02}:{minute:02}")
    times.append("24:00")        
    return (times)

def time_to_minutes(time_str):
    """Convert HH:MM time string to minutes since start of the day."""
    hours, minutes = map(int, time_str.split(':'))
    return hours * 60 + minutes




def generate_valid_shifts_intervals():
    times = create_time_array()
    start = 0
    intervals_list = []

    while start < 48:
        if (start > 44):
            end  = 48
            intervals_list.append((times[start], times[end]))        
            break
        
        end = start + random.randint(6, 24)
        end = min(end, 48)       
        intervals_list.append((times[start], times[end]))        
        mu = (start + end) / 2
        sigma = (end - start) / 4
        start = int(max(start, min(random.gauss(mu, sigma), end)))

    return intervals_list



def random_day():
    return random.choice(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

def random_min_hours():
    return round(random.gauss(40, 8) * 2) / 2  # Mean of 40 hours, SD of 5, rounded to 0.5 increments

def random_max_hours(min_hours):
    while True:
        max_hours = round(random.gauss(min_hours + 12.5, 5) * 2) / 2  # Mean is min_hours + 10, SD of 5
        if (max_hours > min_hours):
            return min(max_hours, 70)  # Ensures max_hours does not exceed 80

def random_workers(total_workers):
    return random.randint(1, total_workers)

def random_cost():
    return random.randint(50, 100)

def generate_skills_array(num_skills):
    # Ensure we don't request more skills than available in the skills list
    if num_skills > len(skills_list):
        raise ValueError(f"Cannot generate more than {len(skills_list)} unique skills.")
    
    return random.sample(skills_list, num_skills)  # Randomly sample the required number of skills


def generate_csv_1(skills_array, num_lines, filename):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        
        for i in range(num_lines):
            name = generate_name()
            
            # Skill1 must be non-empty
            skill1 = random.choice(skills_array)
            
            # Probability of 1/4 for an empty string for Skill2 and Skill3
            if random.random() < 0.25:  # 25% chance for empty string
                skill2 = ""
            else:
                skill2 = random.choice([s for s in skills_array if s != skill1])
            
            if skill2 == "" or random.random() < 0.25:  # 25% chance for empty string if Skill2 is empty
                skill3 = ""
            else:
                skill3 = random.choice([s for s in skills_array if s != skill1 and s != skill2])
            
            # Ensure empty skills follow the rule: once empty, all subsequent skills are empty
            if skill2 == "":
                skill3 = ""

            min_hours = random_min_hours()
            max_hours = random_max_hours(min_hours)

            # Remove leading zeros from ID
            id_str = str(i + 1)  # IDs start from 1 instead of 0 to avoid leading zeros
            writer.writerow([id_str, name, skill1, skill2, skill3, f"{min_hours:.1f}", f"{max_hours:.1f}"])


def generate_csv_3(skills_array, filename):
    # Generate intervals

    # Track skill prices
    skill_prices = {skill: random.randint(1, 30) for skill in skills_array}

    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')

        # Iterate over each day and skill
        for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]:
            for skill in skills_array:
                intervals = generate_valid_shifts_intervals()
                used_intervals = set()
                
                # Iterate over all intervals
                for interval in intervals:
                    if interval not in used_intervals:
                        from_time, until_time = interval
                        used_intervals.add(interval)
                        
                        # Calculate duration and cost
                        start_minutes = time_to_minutes(from_time)
                        end_minutes = time_to_minutes(until_time)
                        duration_hours = (end_minutes - start_minutes) / 60
                        price_per_hour = skill_prices[skill]
                        cost = round(price_per_hour * duration_hours, 2)
                        
                        # Write to CSV
                        writer.writerow([skill, day, from_time, until_time, cost])

    return intervals





def count_rows_in_csv(filename):
    with open(filename, 'r') as csvfile:
        reader = csv.reader(csvfile)
        return sum(1 for row in reader)

from datetime import timedelta, time

def create_time_intervals():
    intervals = [
        ("00:00", "00:30"), ("00:30", "01:00"), ("01:00", "01:30"), ("01:30", "02:00"),
        ("02:00", "02:30"), ("02:30", "03:00"), ("03:00", "03:30"), ("03:30", "04:00"),
        ("04:00", "04:30"), ("04:30", "05:00"), ("05:00", "05:30"), ("05:30", "06:00"),
        ("06:00", "06:30"), ("06:30", "07:00"), ("07:00", "07:30"), ("07:30", "08:00"),
        ("08:00", "08:30"), ("08:30", "09:00"), ("09:00", "09:30"), ("09:30", "10:00"),
        ("10:00", "10:30"), ("10:30", "11:00"), ("11:00", "11:30"), ("11:30", "12:00"),
        ("12:00", "12:30"), ("12:30", "13:00"), ("13:00", "13:30"), ("13:30", "14:00"),
        ("14:00", "14:30"), ("14:30", "15:00"), ("15:00", "15:30"), ("15:30", "16:00"),
        ("16:00", "16:30"), ("16:30", "17:00"), ("17:00", "17:30"), ("17:30", "18:00"),
        ("18:00", "18:30"), ("18:30", "19:00"), ("19:00", "19:30"), ("19:30", "20:00"),
        ("20:00", "20:30"), ("20:30", "21:00"), ("21:00", "21:30"), ("21:30", "22:00"),
        ("22:00", "22:30"), ("22:30", "23:00"), ("23:00", "23:30"), ("23:30", "24:00")
    ]
    min_difference = 20
    max_index = 48

    # Sample the first index
    index1 = random.randint(0, max_index - min_difference)

    # Sample the second index, ensuring the difference is at least 20
    index2 = random.randint(index1 + min_difference, max_index)
    return intervals[index1:index2]



def generate_csv_2(skills_array, filename, table1_filename):
      # Fixed time intervals like 00:00-00:30, 00:30-01:00, etc.
    schedule = []  # List to keep track of all generated rows
    last_num_workers_day_skill = {}  # To track the last worker count for each day-skill combination

    # Load Table 1 to get worker counts for skills
    skill_worker_counts = {}
    with open(table1_filename, 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip header row
        for row in reader:
            skill1, skill2, skill3 = row[2], row[3], row[4]
            for skill in [skill1, skill2, skill3]:
                if skill and skill not in skill_worker_counts:
                    skill_worker_counts[skill] = 0
                if skill:
                    skill_worker_counts[skill] += 1

    for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]:  # Assuming 7 days (adjust as needed)
        for skill in skills_array:
            available_workers = skill_worker_counts.get(skill, 0)
            if available_workers == 0:
                continue
            times = create_time_intervals()
            # Set the first worker count for 00:00-00:30
            required_workers = random.randint(1, int(available_workers / 4))
            for from_time, until_time in times:
                key = (day, skill)
                
                # For the first interval of the day, use the random initial workers count
                if key not in last_num_workers_day_skill:
                    last_num_workers_day_skill[key] = required_workers
                else:
                    # Adjust the worker count for the next interval by ±5
                    prev_workers = last_num_workers_day_skill[key]
                    adjustment = random.randint(-5, 5)
                    required_workers = max(1, min(available_workers, prev_workers + adjustment))
                    last_num_workers_day_skill[key] = required_workers
                
                # Add the row to the schedule
                schedule.append([day, skill, from_time, until_time, required_workers])

    # Write the results to the CSV file
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        writer.writerows(schedule)







def main(num_skills, num_lines_1):
    skills_array = generate_skills_array(num_skills)
    generate_csv_1(skills_array, num_lines_1, 'csv1.csv')
    generate_csv_3(skills_array, 'csv3.csv')
    generate_csv_2(skills_array,'csv2.csv', 'csv1.csv')

# Example usage:
main(num_skills=5, num_lines_1=500)
