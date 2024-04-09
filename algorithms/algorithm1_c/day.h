#ifndef ENUMS_H
#define ENUMS_H

enum Day {
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday
};

enum Day stringToDay(const char *dayString);

#endif