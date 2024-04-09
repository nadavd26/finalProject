OBJS	= firstAlgorithm.o array_operations.o day.o solve_algorithm.o
SOURCE	= firstAlgorithm.c array_operations.c day.c solve_algorithm.c
HEADER	= array_operations.h day.h solve_algorithm.h shift.h
OUT	= a.out
CC	 = gcc
FLAGS	 = -g -c -Wall

all: $(OBJS)
	$(CC) -g $(OBJS) -o $(OUT)

firstAlgorithm.o: firstAlgorithm.c
	$(CC) $(FLAGS) firstAlgorithm.c 

array_operations.o: array_operations.c
	$(CC) $(FLAGS) array_operations.c 

day.o: day.c
	$(CC) $(FLAGS) day.c 

solve_algorithm.o: solve_algorithm.c
	$(CC) $(FLAGS) solve_algorithm.c 

clean:
	rm -f $(OBJS) $(OUT)

run: $(OUT)
	./$(OUT)