/*
    [Operator]: UADD, USUB, ADD, SUB, MUL, DIV, MOD,
                LESS_THAN, LESS_THAN_EQUAL, GREATER_THAN, GREATER_THAN_EQUAL,
                EQUAL, NOT_EQUAL, NOT, AND, OR, PRINT
    [Operator, (number | boolean)]: PUSH 
    [Operator, number, number]: LOAD, STORE
    [Operator, number|null, number, number]: CALL   [Call, address, level, arity]

*/
export enum Operator 
    { //ASSIGN,
      UADD, USUB,
      ADD, SUB, MUL, DIV, MOD,
      LESS_THAN, LESS_THAN_EQUAL, GREATER_THAN, GREATER_THAN_EQUAL,
      EQUAL, NOT_EQUAL,
      NOT, AND, OR,
      PUSH, POP, LOAD, STORE,
      CALL, // [Operator.Call, address, level, arity]
      RETURN, JMP, JMP_IF, JMP_IF_NOT, LABEL, PRINT, MOVE, FIRE, FORK, RANDOM
    }
