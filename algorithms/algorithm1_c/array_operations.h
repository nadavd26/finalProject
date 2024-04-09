#ifndef ARRAYOPERATIONS_H
#define ARRAYOPERATIONS_H

void init_3d_int_array(int ****arr, int dim1, int dim2, int dim3);
void init_2d_int_array(int ***arr, int dim1, int dim2);
void print_3d_int_array(int ***arr, int dim1, int dim2, int dim3);
void print_string_array(char **arr, int dim);
int  find_string_in_array(char **arr, char *str);
void free_3d_int_array(int ***arr, int dim1, int dim2);
void free_2d_int_array(int **arr, int dim1);
void free_string_array(char **arr, int dim);

#endif
