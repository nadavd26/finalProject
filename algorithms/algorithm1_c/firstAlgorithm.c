#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "array_operations.h"
#include "solve_algorithm.h"
#include "shift.h"
#include "day.h"

#define MAX_LINE_LENGTH 2048
#define MAX_FIELD_LENGTH 512
#define NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK 7
#define TIME_INTERVALS_A_DAY 48

int count_unique_skills(const char *file1name, const char *file2name, char ***unique_skills);
void fill_request_array(const char *filename, int ***request_array, char **unique_skills);
void init_optional_shifts_array(OptionalShiftsArray *optional_shifts_array, int dim1, int dim2);
void fill_optional_shifts_array(const char *filename, OptionalShiftsArray optional_shifts_array, int dim1, int dim2, char **unique_skills);
void free_optional_shifts_array(OptionalShiftsArray *optional_shifts_array, int dim1, int dim2);

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <file1.csv> <file2.csv>\n", argv[0]);
        return EXIT_FAILURE;
    }

    const char *file1 = argv[1];
    const char *file2 = argv[2];

    char **unique_skills = NULL;
    int ***request_array = NULL;

    int num_skills = count_unique_skills(file1, file2, &unique_skills);
    // print_string_array(unique_skills, num_skills);

    //put file1 in an array
    init_3d_int_array(&request_array, NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK, num_skills, TIME_INTERVALS_A_DAY);
    fill_request_array(file1, request_array, unique_skills);
    // print_3d_int_array(request_array, NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK, num_skills, TIME_INTERVALS_A_DAY);

    //put file2 in an array
    OptionalShiftsArray optional_shifts_array;
    init_optional_shifts_array(&optional_shifts_array, NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK, num_skills);
    fill_optional_shifts_array(file2, optional_shifts_array, NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK, num_skills, unique_skills);

    free_optional_shifts_array(&optional_shifts_array, NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK, num_skills);
    free_3d_int_array(request_array, NUMBER_OFֹ_DAYSֹ_INֹ_Aֹ_WEEK, num_skills);
    free_string_array(unique_skills, num_skills);

    return 0;
}

int count_unique_skills(const char *file1name, const char *file2name, char ***unique_skills) {
    FILE *file1 = fopen(file1name, "r");

    if (file1 == NULL) {
        fprintf(stderr, "Error opening file: %s\n", file1name);
        exit(EXIT_FAILURE);
    }

    FILE *file2 = fopen(file2name, "r");

    if (file2 == NULL) {
        fprintf(stderr, "Error opening file: %s\n", file2name);
        exit(EXIT_FAILURE);
    }

    char line[MAX_LINE_LENGTH];
    char field[MAX_FIELD_LENGTH];

    int unique_count = 0;

    *unique_skills = NULL;

    for (int fileIndex = 0; fileIndex < 2; ++fileIndex) {
        FILE *current_file = (fileIndex == 0) ? file1 : file2;

        while (fgets(line, sizeof(line), current_file) != NULL) {
            char *token = strtok(line, ",");

            if (token != NULL) {
                token = strtok(NULL, ",");
                if (token != NULL) {
                    sscanf(token, " %511[^,]", field);
                    if (find_string_in_array(*unique_skills, field) == -1) {
                        *unique_skills = (char**)realloc(*unique_skills, (unique_count + 2) * sizeof(char *));
                        if (*unique_skills == NULL) {
                            fprintf(stderr, "Memory allocation failed.\n");
                            exit(EXIT_FAILURE);
                        }
                        (*unique_skills)[unique_count] = strdup(field);
                        if ((*unique_skills)[unique_count] == NULL) {
                            fprintf(stderr, "Memory allocation failed.\n");
                            exit(EXIT_FAILURE);
                        }
                        ++unique_count;
                        (*unique_skills)[unique_count] = NULL;
                    }
                }
            }
        }

        fclose(current_file);
    }

    return unique_count;
}

void substring(const char *source, int start, int length, char *destination) {
    strncpy(destination, source + start, length);
    destination[length] = '\0';
}

int convert_hour_to_index(char* hour){
    int sum = 0;
    char subString[2];
    substring(hour,0,1,subString);
    sum += atoi(subString) * 20;
    substring(hour,1,1,subString);
    sum += atoi(subString) * 2;
    if(hour[3] == '3')
        ++sum;
    return sum;
}

void fill_request_array(const char *filename, int ***request_array, char **unique_skills){
    FILE *file = fopen(filename, "r");

    if (file == NULL) {
        fprintf(stderr, "Error opening file\n");
        exit(EXIT_FAILURE);
    }

    char line[MAX_LINE_LENGTH];
    enum Day day;
    int skill_index = 0;
    char *skill = NULL;
    int from, until, amount, i;
    while (fgets(line, sizeof(line), file) != NULL) {
        char *token = strtok(line, ",");
        day = stringToDay(token);
        token = strtok(NULL, ",");
        if(skill == NULL || strcmp(token, skill)!=0){
            if(skill != NULL)
                free(skill);
            skill = strdup(token);
            skill_index = find_string_in_array(unique_skills, skill);
        }
        token = strtok(NULL, ",");
        from = convert_hour_to_index(token);
        token = strtok(NULL, ",");
        until = convert_hour_to_index(token);
        if(until == 0)
            until = 48;
        token = strtok(NULL, ",");
        amount = atoi(token);
        for(i = from; i < until; i++){
            request_array[day][skill_index][i] = amount;
            // printf("day: %d, skill: %d, index %d, amount: %d\n", day, skill_index, i, amount);
        }
    }
    if(skill != NULL)
        free(skill);

    fclose(file);
}

void init_optional_shifts_array(OptionalShiftsArray *optional_shifts_array, int dim1, int dim2){
    *optional_shifts_array = (struct Shift****)malloc(dim1 * sizeof(struct Shift***));

    if (*optional_shifts_array == NULL) {
        exit(EXIT_FAILURE);
    }
    int i = 0,j = 0;
    for (; i < dim1; ++i) {
        (*optional_shifts_array)[i] = (struct Shift***)malloc(dim2 * sizeof(struct Shift**));
        if ((*optional_shifts_array)[i] == NULL) {
            exit(EXIT_FAILURE);
        }
        for(j = 0; j < dim2; ++j){
            (*optional_shifts_array)[i][j] = (struct Shift**)malloc(sizeof(struct Shift*));
            if ((*optional_shifts_array)[i][j] == NULL) {
                exit(EXIT_FAILURE);
        }
        }
    }
}

void set_time(bool (*arr)[TIME_INTERVALS_A_DAY], int dim, int from, int until){
    for(int i = 0; i < dim; ++i){
        (*arr)[i] = (i < from || i >= until) ? 0 : 1;
        printf("i = %d, arr[i] = %d\n", i, (*arr)[i]);
    }
}

void fill_optional_shifts_array(const char *filename, OptionalShiftsArray optional_shifts_array, int dim1, int dim2, char **unique_skills){
    FILE *file = fopen(filename, "r");

    if (file == NULL) {
        fprintf(stderr, "Error opening file\n");
        exit(EXIT_FAILURE);
    }

    char line[MAX_LINE_LENGTH];
    enum Day day;
    int skill_index = 0;
    char *skill = NULL;
    int from, until, cost, current_size;
    int **number_of_optional_shifts;
    init_2d_int_array(&number_of_optional_shifts, dim1, dim2);
    while (fgets(line, sizeof(line), file) != NULL) {
        char *token = strtok(line, ",");
        day = stringToDay(token);
        token = strtok(NULL, ",");
        if(skill == NULL || strcmp(token, skill)!=0){
            if(skill != NULL)
                free(skill);
            skill = strdup(token);
            skill_index = find_string_in_array(unique_skills, skill);
        }
        token = strtok(NULL, ",");
        from = convert_hour_to_index(token);
        token = strtok(NULL, ",");
        until = convert_hour_to_index(token);
        if(until == 0)
            until = 48;
        token = strtok(NULL, ",");
        cost = atoi(token);
        current_size = number_of_optional_shifts[day][skill_index]++;
        optional_shifts_array[day][skill_index] = (struct Shift**)realloc(
            optional_shifts_array[day][skill_index], 
            (current_size + 2) * sizeof(struct Shift*)
        );
        if (optional_shifts_array[day][skill_index] == NULL) {
            fprintf(stderr, "Memory allocation failed.\n");
            exit(EXIT_FAILURE);
        }
        optional_shifts_array[day][skill_index][current_size] = (struct Shift *)malloc(sizeof(struct Shift));
        if (optional_shifts_array[day][skill_index][current_size] == NULL) {
            fprintf(stderr, "Memory allocation failed.\n");
            exit(EXIT_FAILURE);
        }
        printf("day = %d, skill = %d\n", day, skill_index);
        set_time(&(optional_shifts_array[day][skill_index][current_size]->time), TIME_INTERVALS_A_DAY, from, until);
        optional_shifts_array[day][skill_index][current_size]->cost = cost;
        optional_shifts_array[day][skill_index][current_size + 1] = NULL;
    }
    if(skill != NULL)
        free(skill);
    fclose(file);
    free_2d_int_array(number_of_optional_shifts, dim1);
}

void free_optional_shifts_array(OptionalShiftsArray *optional_shifts_array, int dim1, int dim2) {
    int i, j, k;
    for (i = 0; i < dim1; ++i) {
        for (j = 0; j < dim2; ++j) {
            for(k = 0; (*optional_shifts_array)[i][j][k] != NULL; ++k){
                free((*optional_shifts_array)[i][j][k]);
            }
            free((*optional_shifts_array)[i][j]);
        }
        free((*optional_shifts_array)[i]);
    }

    free((*optional_shifts_array));
    (*optional_shifts_array) = NULL;
}
