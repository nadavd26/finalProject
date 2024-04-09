#ifndef SHIFT_H
#define SHIFT_H

#include <stdbool.h>
#define TIME_INTERVALS_A_DAY 48

struct Shift {
    bool time[TIME_INTERVALS_A_DAY];
    unsigned int cost;
};

typedef struct Shift ****OptionalShiftsArray;

struct ShiftResult {
    int from;
    int until;
    unsigned int number_of_required_employees;
};

typedef struct ShiftResult ****ShiftResultArray;

#endif