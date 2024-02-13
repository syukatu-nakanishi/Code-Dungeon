import { Operator } from "./Operator"
import { scope } from "./scope";
export type code1 = [Operator];
//[PUSH, value]  [JMP, address] [JMP_IF or JMP_NOT_IF, address|label] [RETURN, level]
export type code2 = [Operator, number | boolean | Symbol];
//[LOAD or STORE, level, offset] [CALL, levle, arity] [LABEL, label]
export type code3 = [Operator, number, number | boolean];
//[LABEL, function_scope, name] [JMP, function_scope, name]
export type code4 = [Operator, scope, string];
export type code = code1 | code2 | code3 | code4;