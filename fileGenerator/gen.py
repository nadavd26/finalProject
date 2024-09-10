import csv
import random

# Initialize global counters
name_counter = 0

def generate_name():
    global name_counter
    name = ''
    current = name_counter
    
    while True:
        name = chr(97 + current % 26) + name
        current = current // 26 - 1
        if current < 0:
            break
    
    name_counter += 1
    return name

def create_time_array():
    times = []
    for hour in range(24):
        for minute in [0, 30]:
            times.append(f"{hour:02}:{minute:02}")
    return times

def generate_valid_time_intervals(times):
    intervals = []
    for i in range(len(times) - 1):
        for j in range(i + 1, len(times)):
            intervals.append((times[i], times[j]))
    return intervals

def random_day():
    return random.choice(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])

def random_min_hours():
    return round(random.uniform(0, 168) * 2) / 2  # Ensures increments of 0.5

def random_max_hours(min_hours):
    return round(random.uniform(min_hours + 0.5, 168) * 2) / 2  # Ensures increments of 0.5 and greater than min_hours

def random_workers(total_workers):
    return random.randint(1, total_workers)

def random_cost():
    return random.randint(50, 100)

def generate_skills_array(num_skills):
    return [generate_name() for _ in range(num_skills)]

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


def generate_csv_3(skills_array, num_lines, filename):
    times = create_time_array()
    intervals = generate_valid_time_intervals(times)
    random.shuffle(intervals)  # Shuffle to randomize the order
    used_intervals = set()  # Track used intervals to avoid duplicates
    num_lines = min(num_lines, len(intervals))  # Limit number of lines based on available intervals
    
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        
        for _ in range(num_lines):
            skill = random.choice(skills_array)
            day = random_day()
            
            # Get a valid interval that hasn't been used
            for interval in intervals:
                if interval not in used_intervals:
                    from_time, until_time = interval
                    used_intervals.add(interval)
                    break
            else:
                # If no interval found, exit early
                continue
            
            cost = random_cost()
            writer.writerow([skill, day, from_time, until_time, cost])
    
    return used_intervals  # Return intervals to cross-check with Table 2

def count_rows_in_csv(filename):
    with open(filename, 'r') as csvfile:
        reader = csv.reader(csvfile)
        return sum(1 for row in reader)

def generate_csv_2(skills_array, num_lines, filename, table1_filename):
    times = create_time_array()
    all_intervals = generate_valid_time_intervals(times)
    skill_status = {skill: True for skill in skills_array}  # Initially, all skills are choosable
    schedule = []  # List to keep track of all generated rows
    lines_written = 0
    
    # Get the length of table 1
    table1_length = count_rows_in_csv(table1_filename)

    # Load Table 1 to get worker counts for skills
    skill_worker_counts = {}
    with open(table1_filename, 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip header row
        for row in reader:
            skill1 = row[2]
            skill2 = row[3]
            skill3 = row[4]
            for skill in [skill1, skill2, skill3]:
                if skill and skill not in skill_worker_counts:
                    skill_worker_counts[skill] = 0
                if skill:
                    skill_worker_counts[skill] += 1

    def is_overlapping(day, skill, new_from, new_until, existing_rows):
        """Check if the new time interval overlaps with any existing rows for the same skill and day."""
        for row in existing_rows:
            existing_day, existing_skill, existing_from, existing_until = row[:4]
            if existing_skill == skill and existing_day == day:
                if not (new_until <= existing_from or new_from >= existing_until):
                    return True
        return False
    
    while lines_written < num_lines:
        day = random_day()
        choosable_skills = [skill for skill, status in skill_status.items() if status]
        
        if not choosable_skills:
            break  # If no skills are choosable, stop generation
        
        skill = random.choice(choosable_skills)
        
        # Get available worker count for this skill
        available_workers = skill_worker_counts.get(skill, 0)
        
        valid_interval_found = False
        random.shuffle(all_intervals)  # Shuffle intervals to pick a random one
        for from_time, until_time in all_intervals:
            if not is_overlapping(day, skill, from_time, until_time, schedule):
                # Make sure required number of workers does not exceed available workers
                required_workers = random_workers(table1_length)
                if required_workers <= available_workers:
                    schedule.append([day, skill, from_time, until_time, required_workers])
                    lines_written += 1
                    valid_interval_found = True
                    break
        
        if not valid_interval_found:
            # Mark the skill as non-choosable if no valid interval is found
            skill_status[skill] = False
    
    # Write the results to the CSV file
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        writer.writerows(schedule)


def main(num_skills, num_lines_1, num_lines_2, num_lines_3):
    skills_array = generate_skills_array(num_skills)
    generate_csv_1(skills_array, num_lines_1, 'csv1.csv')
    generate_csv_3(skills_array, num_lines_3, 'csv3.csv')
    generate_csv_2(skills_array, num_lines_2, 'csv2.csv', 'csv1.csv')

# Example usage:
main(num_skills=5, num_lines_1=100, num_lines_2=100, num_lines_3=100)
