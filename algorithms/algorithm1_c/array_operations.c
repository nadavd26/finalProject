#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "array_operations.h"

void init_3d_int_array(int ****arr, int dim1, int dim2, int dim3) {
    *arr = (int ***)malloc(dim1 * sizeof(int **));

    if (*arr == NULL) {
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < dim1; ++i) {
        (*arr)[i] = (int **)malloc(dim2 * sizeof(int *));
        if ((*arr)[i] == NULL) {
            exit(EXIT_FAILURE);
        }

        for (int j = 0; j < dim2; ++j) {
            (*arr)[i][j] = (int *)calloc(dim3, sizeof(int));
            if ((*arr)[i][j] == NULL) {
                exit(EXIT_FAILURE);
            }
        }
    }
}

void init_2d_int_array(int ***arr, int dim1, int dim2){
    *arr = (int **)malloc(dim1 * sizeof(int *));

    if (*arr == NULL) {
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < dim1; ++i) {
        (*arr)[i] = (int *)calloc(dim2, sizeof(int));
        if ((*arr)[i] == NULL) {
            exit(EXIT_FAILURE);
        }
    }
}

void print_string_array(char **arr, int dim) {
    for (int i = 0; i < dim; ++i) {
        printf("%s\n", arr[i]);
    }
}

void print_3d_int_array(int ***arr, int dim1, int dim2, int dim3) {
    for (int i = 0; i < dim1; ++i) {
        for (int j = 0; j < dim2; ++j) {
            for (int k = 0; k < dim3; ++k) {
                printf("%d ", arr[i][j][k]);
            }
            printf("\n");
        }
        printf("\n");
    }
}

int find_string_in_array(char **arr, char *str) {
    if(arr == NULL)
        return -1;
    for (int i = 0; arr[i] != NULL; ++i) {
        if (strcmp(arr[i], str) == 0)
            return i;
    }

    return -1;
}


void free_3d_int_array(int ***arr, int dim1, int dim2) {
    if (arr == NULL) {
        return;  // Nothing to free if the array is already NULL
    }

    for (int i = 0; i < dim1; ++i) {
        if (arr[i] != NULL) {
            for (int j = 0; j < dim2; ++j) {
                free(arr[i][j]);
            }
            free(arr[i]);
        }
    }

    free(arr);
}

void free_2d_int_array(int **arr, int dim1) {
    for (int i = 0; i < dim1; ++i) {
        free(arr[i]);
    }
    free(arr);
}

void free_string_array(char **arr, int dim){
    for (int i = 0; i < dim; ++i) {
        free(arr[i]);
    }
    free(arr);
}
