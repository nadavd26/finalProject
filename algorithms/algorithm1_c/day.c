#include "day.h"
#include <stdio.h>
#include <stdlib.h>

enum Day stringToDay(const char *dayString) {
    if (strcmp(dayString, "sunday") == 0) {
        return sunday;
    } else if (strcmp(dayString, "monday") == 0) {
        return monday;
    } else if (strcmp(dayString, "tuesday") == 0) {
        return tuesday;
    } else if (strcmp(dayString, "wednesday") == 0) {
        return wednesday;
    } else if (strcmp(dayString, "thursday") == 0) {
        return thursday;
    } else if (strcmp(dayString, "friday") == 0) {
        return friday;
    } else if (strcmp(dayString, "saturday") == 0) {
        return saturday;
    } else {
        fprintf(stderr, "Invalid day: %s\n", dayString);
        exit(EXIT_FAILURE);
    }
}
