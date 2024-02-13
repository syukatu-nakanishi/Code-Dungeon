// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var FUNCTION: any;
declare var NAME: any;
declare var LPAREN: any;
declare var RPAREN: any;
declare var COLON: any;
declare var TYPE: any;
declare var COMMA: any;
declare var LBRACE: any;
declare var RBRACE: any;
declare var SEMICOLON: any;
declare var LET: any;
declare var LSQUARE: any;
declare var INT: any;
declare var RSQUARE: any;
declare var ASSIGN: any;
declare var RETURN: any;
declare var IF: any;
declare var ELSE: any;
declare var WHILE: any;
declare var FOR: any;
declare var PRINT: any;
declare var MOVE: any;
declare var FIRE: any;
declare var FORK: any;
declare var RANDOM: any;
declare var OR: any;
declare var AND: any;
declare var NOT: any;
declare var EQUAL: any;
declare var NOT_EQUAL: any;
declare var LESS_THAN: any;
declare var LESS_THAN_EQUAL: any;
declare var GREATER_THAN: any;
declare var GREATER_THAN_EQUAL: any;
declare var ADD: any;
declare var SUB: any;
declare var MUL: any;
declare var DIV: any;
declare var MOD: any;
declare var REAL: any;
declare var TRUE: any;
declare var FALSE: any;

    import { makeLexer } from "moo-ignore";
    import { tokens } from "./tokens";
    import * as fs from "fs";
    import { NumberNode, BooleanNode, VariableNode, UnaryOperationNode, BinaryOperationNode, ASTNode,
             MainNode, FunctionNode, CallFuncNode, VariableDeclarationNode, 
             ReturnNode, IfNode, ElseNode, WhileNode, ForNode, ExpressionSentenceNode, 
             PrintNode, MoveNode, FireNode, ForkNode, RandomNode } from "./AST";
    import { Operator } from "./Operator";

    let lexer: any = makeLexer(tokens);
    lexer.ignore("COMMENT","WHITE_SPACE","NEW_LINE");


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "SOURCE$ebnf$1", "symbols": []},
    {"name": "SOURCE$ebnf$1$subexpression$1", "symbols": ["FUNCTION_DECLARATION"]},
    {"name": "SOURCE$ebnf$1$subexpression$1", "symbols": ["SENTENCE"]},
    {"name": "SOURCE$ebnf$1", "symbols": ["SOURCE$ebnf$1", "SOURCE$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "SOURCE", "symbols": ["SOURCE$ebnf$1"], "postprocess":  
        (d) => 
        { 
            const arr: ASTNode[] = [];
            for (const e of d[0]) {
                if (Array.isArray(e[0])) arr.push(...e[0]);
                else arr.push(e[0]);
            }
            return new MainNode(arr);
        } 
            },
    {"name": "FUNCTION_DECLARATION$subexpression$1", "symbols": []},
    {"name": "FUNCTION_DECLARATION$subexpression$1", "symbols": ["PARAMETER_LIST"]},
    {"name": "FUNCTION_DECLARATION", "symbols": [(lexer.has("FUNCTION") ? {type: "FUNCTION"} : FUNCTION), (lexer.has("NAME") ? {type: "NAME"} : NAME), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "FUNCTION_DECLARATION$subexpression$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), (lexer.has("COLON") ? {type: "COLON"} : COLON), (lexer.has("TYPE") ? {type: "TYPE"} : TYPE), "BLOCK"], "postprocess": (d) => { return new FunctionNode(d[1].value, [d[6].value, d[3][0]], null, d[7]); }},
    {"name": "PARAMETER_LIST", "symbols": ["PARAMETER"], "postprocess": id},
    {"name": "PARAMETER_LIST", "symbols": ["PARAMETER_LIST", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "PARAMETER"], "postprocess": (d) => { return [ ...d[0], ...d[2] ]; }},
    {"name": "PARAMETER", "symbols": [(lexer.has("NAME") ? {type: "NAME"} : NAME), (lexer.has("COLON") ? {type: "COLON"} : COLON), (lexer.has("TYPE") ? {type: "TYPE"} : TYPE)], "postprocess": (d) => { return [[d[0].value, d[2].value]]; }},
    {"name": "BLOCK$ebnf$1", "symbols": []},
    {"name": "BLOCK$ebnf$1$subexpression$1", "symbols": ["SENTENCE"]},
    {"name": "BLOCK$ebnf$1$subexpression$1", "symbols": ["FUNCTION_DECLARATION"]},
    {"name": "BLOCK$ebnf$1", "symbols": ["BLOCK$ebnf$1", "BLOCK$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "BLOCK", "symbols": [(lexer.has("LBRACE") ? {type: "LBRACE"} : LBRACE), "BLOCK$ebnf$1", (lexer.has("RBRACE") ? {type: "RBRACE"} : RBRACE)], "postprocess":  (d) =>
        {
            const arr: ASTNode[] = [];
            for (const e of d[1]) {
                if (Array.isArray(e[0])) arr.push(...e[0]);
                else arr.push(e[0]);
            }
            return arr;
        }
            },
    {"name": "SENTENCE", "symbols": [(lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)]},
    {"name": "SENTENCE", "symbols": ["EXPRESSION_SENTENCE"], "postprocess": (d) => { return d; }},
    {"name": "SENTENCE", "symbols": ["VARIABLE_DECLARATION_SENTENCE"], "postprocess": id},
    {"name": "SENTENCE", "symbols": ["RETURN_SENTENCE"], "postprocess": id},
    {"name": "SENTENCE", "symbols": ["IF_SENTENCE"], "postprocess": (d) => { return d; }},
    {"name": "SENTENCE", "symbols": ["WHILE_SENTENCE"], "postprocess": (d) => { return d; }},
    {"name": "SENTENCE", "symbols": ["FOR_SENTENCE"], "postprocess": (d) => { return d; }},
    {"name": "SENTENCE", "symbols": ["COMPOUND_SENTENCE"]},
    {"name": "EXPRESSION_SENTENCE", "symbols": ["EXPRESSION", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess": (d) => { return new ExpressionSentenceNode(d[0]); }},
    {"name": "VARIABLE_DECLARATION_SENTENCE$ebnf$1", "symbols": []},
    {"name": "VARIABLE_DECLARATION_SENTENCE$ebnf$1$subexpression$1", "symbols": [(lexer.has("LSQUARE") ? {type: "LSQUARE"} : LSQUARE), (lexer.has("INT") ? {type: "INT"} : INT), (lexer.has("RSQUARE") ? {type: "RSQUARE"} : RSQUARE)]},
    {"name": "VARIABLE_DECLARATION_SENTENCE$ebnf$1", "symbols": ["VARIABLE_DECLARATION_SENTENCE$ebnf$1", "VARIABLE_DECLARATION_SENTENCE$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "VARIABLE_DECLARATION_SENTENCE$ebnf$2$subexpression$1", "symbols": [(lexer.has("ASSIGN") ? {type: "ASSIGN"} : ASSIGN), "EXPRESSION"]},
    {"name": "VARIABLE_DECLARATION_SENTENCE$ebnf$2", "symbols": ["VARIABLE_DECLARATION_SENTENCE$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "VARIABLE_DECLARATION_SENTENCE$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "VARIABLE_DECLARATION_SENTENCE", "symbols": [(lexer.has("LET") ? {type: "LET"} : LET), (lexer.has("NAME") ? {type: "NAME"} : NAME), (lexer.has("COLON") ? {type: "COLON"} : COLON), (lexer.has("TYPE") ? {type: "TYPE"} : TYPE), "VARIABLE_DECLARATION_SENTENCE$ebnf$1", "VARIABLE_DECLARATION_SENTENCE$ebnf$2", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess":  (d) => 
        { 
            if (d[5] === null) return [new VariableDeclarationNode(d[1].value, d[3].value)];
            else 
                return [new VariableDeclarationNode(d[1].value, d[3].value), 
                        new BinaryOperationNode(Operator.STORE, new VariableNode(d[1].value, null), d[5][1])]; 
        } 
            },
    {"name": "RETURN_SENTENCE", "symbols": [(lexer.has("RETURN") ? {type: "RETURN"} : RETURN), (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess": (d) => { return [new ReturnNode(null, null)]; }},
    {"name": "RETURN_SENTENCE", "symbols": [(lexer.has("RETURN") ? {type: "RETURN"} : RETURN), "EXPRESSION", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON)], "postprocess": (d) => { return [new ReturnNode(d[1], null)]; }},
    {"name": "IF_SENTENCE$ebnf$1", "symbols": []},
    {"name": "IF_SENTENCE$ebnf$1$subexpression$1", "symbols": [(lexer.has("ELSE") ? {type: "ELSE"} : ELSE), (lexer.has("IF") ? {type: "IF"} : IF), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "CONDITIONAL_EXPRESSION", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), "BLOCK"]},
    {"name": "IF_SENTENCE$ebnf$1", "symbols": ["IF_SENTENCE$ebnf$1", "IF_SENTENCE$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "IF_SENTENCE$ebnf$2$subexpression$1", "symbols": [(lexer.has("ELSE") ? {type: "ELSE"} : ELSE), "BLOCK"]},
    {"name": "IF_SENTENCE$ebnf$2", "symbols": ["IF_SENTENCE$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "IF_SENTENCE$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "IF_SENTENCE", "symbols": [(lexer.has("IF") ? {type: "IF"} : IF), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "CONDITIONAL_EXPRESSION", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), "BLOCK", "IF_SENTENCE$ebnf$1", "IF_SENTENCE$ebnf$2"], "postprocess":  (d) =>
        {
            const elseIfs: IfNode[] = [];
            for (const e of d[5]) {
                elseIfs.push(new IfNode(e[3], e[5], null));
            }
            //else節がない場合
            if (d[6] === null) {
                //else if節がない場合
                if (elseIfs.length === 0) return new IfNode(d[2], d[4], null);
                //else if節がある場合
                for (let i=elseIfs.length-2; i>=0; i--) {
                    elseIfs[i].child = elseIfs[i+1];
                }
                return new IfNode(d[2], d[4], elseIfs[0]);
            //else節がある場合
            } else {
                //else if節がない場合
                if (elseIfs.length === 0) return new IfNode(d[2], d[4], new ElseNode(d[6][1]));
                //else if節がある場合
                elseIfs[elseIfs.length-1].child = new ElseNode(d[6][1]);
                for (let i=elseIfs.length-2; i>=0; i--) {
                    elseIfs[i].child = elseIfs[i+1];
                }
                return new IfNode(d[2], d[4], elseIfs[0]);
            }
        }
            },
    {"name": "WHILE_SENTENCE", "symbols": [(lexer.has("WHILE") ? {type: "WHILE"} : WHILE), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "CONDITIONAL_EXPRESSION", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), "BLOCK"], "postprocess": (d) => { return new WhileNode(d[2], d[4]); }},
    {"name": "FOR_SENTENCE$ebnf$1$subexpression$1", "symbols": ["EXPRESSION"]},
    {"name": "FOR_SENTENCE$ebnf$1", "symbols": ["FOR_SENTENCE$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "FOR_SENTENCE$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "FOR_SENTENCE$ebnf$2$subexpression$1", "symbols": ["CONDITIONAL_EXPRESSION"]},
    {"name": "FOR_SENTENCE$ebnf$2", "symbols": ["FOR_SENTENCE$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "FOR_SENTENCE$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "FOR_SENTENCE$ebnf$3$subexpression$1", "symbols": ["EXPRESSION"]},
    {"name": "FOR_SENTENCE$ebnf$3", "symbols": ["FOR_SENTENCE$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "FOR_SENTENCE$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "FOR_SENTENCE", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "FOR_SENTENCE$ebnf$1", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON), "FOR_SENTENCE$ebnf$2", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON), "FOR_SENTENCE$ebnf$3", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), "BLOCK"], "postprocess": (d) => { return new ForNode(d[2][0], d[4][0], d[6][0], d[8]); }},
    {"name": "FOR_SENTENCE$ebnf$4$subexpression$1", "symbols": ["CONDITIONAL_EXPRESSION"]},
    {"name": "FOR_SENTENCE$ebnf$4", "symbols": ["FOR_SENTENCE$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "FOR_SENTENCE$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "FOR_SENTENCE$ebnf$5$subexpression$1", "symbols": ["EXPRESSION"]},
    {"name": "FOR_SENTENCE$ebnf$5", "symbols": ["FOR_SENTENCE$ebnf$5$subexpression$1"], "postprocess": id},
    {"name": "FOR_SENTENCE$ebnf$5", "symbols": [], "postprocess": () => null},
    {"name": "FOR_SENTENCE", "symbols": [(lexer.has("FOR") ? {type: "FOR"} : FOR), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "VARIABLE_DECLARATION_SENTENCE", "FOR_SENTENCE$ebnf$4", (lexer.has("SEMICOLON") ? {type: "SEMICOLON"} : SEMICOLON), "FOR_SENTENCE$ebnf$5", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN), "BLOCK"], "postprocess": (d) => { return new ForNode(d[2], d[3][0], d[5][0], d[7]); }},
    {"name": "CALL_FUNCTION_EXPRESSION$subexpression$1", "symbols": []},
    {"name": "CALL_FUNCTION_EXPRESSION$subexpression$1", "symbols": ["ARGUMENT_LIST"]},
    {"name": "CALL_FUNCTION_EXPRESSION", "symbols": [(lexer.has("NAME") ? {type: "NAME"} : NAME), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "CALL_FUNCTION_EXPRESSION$subexpression$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return new CallFuncNode(d[0].value, d[2][0], null); }},
    {"name": "ARGUMENT_LIST", "symbols": ["ARGUMENT"], "postprocess": id},
    {"name": "ARGUMENT_LIST", "symbols": ["ARGUMENT_LIST", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "ARGUMENT"], "postprocess": (d) => { return [ ...d[0], ...d[2] ]; }},
    {"name": "ARGUMENT", "symbols": ["EXPRESSION"], "postprocess": ([d]) => { return [d]; }},
    {"name": "PRINT_EXPRESSION$subexpression$1", "symbols": []},
    {"name": "PRINT_EXPRESSION$subexpression$1", "symbols": ["EXPRESSION"]},
    {"name": "PRINT_EXPRESSION", "symbols": [(lexer.has("PRINT") ? {type: "PRINT"} : PRINT), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "PRINT_EXPRESSION$subexpression$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return new PrintNode(d[2][0]); }},
    {"name": "MOVE_EXPRESSION$subexpression$1", "symbols": []},
    {"name": "MOVE_EXPRESSION$subexpression$1", "symbols": ["EXPRESSION"]},
    {"name": "MOVE_EXPRESSION", "symbols": [(lexer.has("MOVE") ? {type: "MOVE"} : MOVE), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "MOVE_EXPRESSION$subexpression$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return new MoveNode(d[2][0]); }},
    {"name": "FIRE_EXPRESSION$subexpression$1", "symbols": []},
    {"name": "FIRE_EXPRESSION$subexpression$1", "symbols": ["EXPRESSION"]},
    {"name": "FIRE_EXPRESSION", "symbols": [(lexer.has("FIRE") ? {type: "FIRE"} : FIRE), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "FIRE_EXPRESSION$subexpression$1", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return new FireNode(d[2][0]); }},
    {"name": "FORK_EXPRESSION", "symbols": [(lexer.has("FORK") ? {type: "FORK"} : FORK), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return new ForkNode(); }},
    {"name": "RANDOM_EXPRESSION", "symbols": [(lexer.has("RANDOM") ? {type: "RANDOM"} : RANDOM), (lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return new RandomNode(); }},
    {"name": "EXPRESSION", "symbols": ["ASSIGNMENT_EXPRESSION"], "postprocess": id},
    {"name": "ASSIGNMENT_EXPRESSION", "symbols": ["CONDITIONAL_EXPRESSION"], "postprocess": id},
    {"name": "ASSIGNMENT_EXPRESSION", "symbols": [(lexer.has("NAME") ? {type: "NAME"} : NAME), (lexer.has("ASSIGN") ? {type: "ASSIGN"} : ASSIGN), "ASSIGNMENT_EXPRESSION"], "postprocess": (d) => { return new BinaryOperationNode(Operator.STORE, new VariableNode(d[0].value, null), d[2]); }},
    {"name": "CONDITIONAL_EXPRESSION", "symbols": ["OR_EXPRESSION"], "postprocess": id},
    {"name": "OR_EXPRESSION", "symbols": ["AND_EXPRESSION"], "postprocess": id},
    {"name": "OR_EXPRESSION", "symbols": ["OR_EXPRESSION", (lexer.has("OR") ? {type: "OR"} : OR), "AND_EXPRESSION"], "postprocess": (d) => { return new BinaryOperationNode(Operator.OR, d[0], d[2]); }},
    {"name": "AND_EXPRESSION", "symbols": ["NOT_EXPRESSION"], "postprocess": id},
    {"name": "AND_EXPRESSION", "symbols": ["AND_EXPRESSION", (lexer.has("AND") ? {type: "AND"} : AND), "NOT_EXPRESSION"], "postprocess": (d) => { return new BinaryOperationNode(Operator.AND, d[0], d[2]); }},
    {"name": "NOT_EXPRESSION", "symbols": ["EQUALITY_EXPRESSION"], "postprocess": id},
    {"name": "NOT_EXPRESSION", "symbols": [(lexer.has("NOT") ? {type: "NOT"} : NOT), "NOT_EXPRESSION"], "postprocess": (d) => { return new UnaryOperationNode(Operator.NOT, d[1]); }},
    {"name": "EQUALITY_EXPRESSION", "symbols": ["RELATIONAL_EXPRESSION"], "postprocess": id},
    {"name": "EQUALITY_EXPRESSION$subexpression$1", "symbols": [(lexer.has("EQUAL") ? {type: "EQUAL"} : EQUAL)]},
    {"name": "EQUALITY_EXPRESSION$subexpression$1", "symbols": [(lexer.has("NOT_EQUAL") ? {type: "NOT_EQUAL"} : NOT_EQUAL)]},
    {"name": "EQUALITY_EXPRESSION", "symbols": ["EQUALITY_EXPRESSION", "EQUALITY_EXPRESSION$subexpression$1", "RELATIONAL_EXPRESSION"], "postprocess":  (d) =>
        {
            let operation: Operator;
            switch (d[1][0].type) {
                case "EQUAL": operation = Operator.EQUAL; break;
                case "NOT_EQUAL": operation = Operator.NOT_EQUAL; break;
                default: throw new Error("Invalid operation type.")
            }
            return new BinaryOperationNode(operation, d[0], d[2]);
        }
                },
    {"name": "RELATIONAL_EXPRESSION", "symbols": ["ADDITIVE_EXPRESSION"], "postprocess": id},
    {"name": "RELATIONAL_EXPRESSION$subexpression$1", "symbols": [(lexer.has("LESS_THAN") ? {type: "LESS_THAN"} : LESS_THAN)]},
    {"name": "RELATIONAL_EXPRESSION$subexpression$1", "symbols": [(lexer.has("LESS_THAN_EQUAL") ? {type: "LESS_THAN_EQUAL"} : LESS_THAN_EQUAL)]},
    {"name": "RELATIONAL_EXPRESSION$subexpression$1", "symbols": [(lexer.has("GREATER_THAN") ? {type: "GREATER_THAN"} : GREATER_THAN)]},
    {"name": "RELATIONAL_EXPRESSION$subexpression$1", "symbols": [(lexer.has("GREATER_THAN_EQUAL") ? {type: "GREATER_THAN_EQUAL"} : GREATER_THAN_EQUAL)]},
    {"name": "RELATIONAL_EXPRESSION", "symbols": ["RELATIONAL_EXPRESSION", "RELATIONAL_EXPRESSION$subexpression$1", "ADDITIVE_EXPRESSION"], "postprocess":  (d) =>
        {
            let operation: Operator;
            switch (d[1][0].type) {
                case "LESS_THAN": operation = Operator.LESS_THAN; break;
                case "LESS_THAN_EQUAL": operation = Operator.LESS_THAN_EQUAL; break;
                case "GREATER_THAN": operation = Operator.GREATER_THAN; break;
                case "GREATER_THAN_EQUAL": operation = Operator.GREATER_THAN_EQUAL; break;
                default: throw new Error("Invalid operation type.")
            }
            return new BinaryOperationNode(operation, d[0], d[2]);
        }
                },
    {"name": "ADDITIVE_EXPRESSION", "symbols": ["MULTIPLICATIVE_EXPRESSION"], "postprocess": id},
    {"name": "ADDITIVE_EXPRESSION$subexpression$1", "symbols": [(lexer.has("ADD") ? {type: "ADD"} : ADD)]},
    {"name": "ADDITIVE_EXPRESSION$subexpression$1", "symbols": [(lexer.has("SUB") ? {type: "SUB"} : SUB)]},
    {"name": "ADDITIVE_EXPRESSION", "symbols": ["ADDITIVE_EXPRESSION", "ADDITIVE_EXPRESSION$subexpression$1", "MULTIPLICATIVE_EXPRESSION"], "postprocess":  (d) =>
        {
            let operation: Operator;
            switch (d[1][0].type) {
                case "ADD": operation = Operator.ADD; break;
                case "SUB": operation = Operator.SUB; break;
                default: throw new Error("Invalid operation type.")
            }
            return new BinaryOperationNode(operation, d[0], d[2]);
        }
                },
    {"name": "MULTIPLICATIVE_EXPRESSION", "symbols": ["UNARY_EXPRESSION"], "postprocess": id},
    {"name": "MULTIPLICATIVE_EXPRESSION$subexpression$1", "symbols": [(lexer.has("MUL") ? {type: "MUL"} : MUL)]},
    {"name": "MULTIPLICATIVE_EXPRESSION$subexpression$1", "symbols": [(lexer.has("DIV") ? {type: "DIV"} : DIV)]},
    {"name": "MULTIPLICATIVE_EXPRESSION$subexpression$1", "symbols": [(lexer.has("MOD") ? {type: "MOD"} : MOD)]},
    {"name": "MULTIPLICATIVE_EXPRESSION", "symbols": ["MULTIPLICATIVE_EXPRESSION", "MULTIPLICATIVE_EXPRESSION$subexpression$1", "UNARY_EXPRESSION"], "postprocess":  (d) =>
        {
            let operation: Operator;
            switch (d[1][0].type) {
                case "MUL": operation = Operator.MUL; break;
                case "DIV": operation = Operator.DIV; break;
                case "MOD": operation = Operator.MOD; break;
                default: throw new Error("Invalid operation type.")
            }
            return new BinaryOperationNode(operation, d[0], d[2]);
        }
                },
    {"name": "UNARY_EXPRESSION", "symbols": ["PRIMARY_EXPRESSION"], "postprocess": id},
    {"name": "UNARY_EXPRESSION", "symbols": [(lexer.has("ADD") ? {type: "ADD"} : ADD), "UNARY_EXPRESSION"], "postprocess": (d) => { return new UnaryOperationNode(Operator.UADD, d[1]); }},
    {"name": "UNARY_EXPRESSION", "symbols": [(lexer.has("SUB") ? {type: "SUB"} : SUB), "UNARY_EXPRESSION"], "postprocess": (d) => { return new UnaryOperationNode(Operator.USUB, d[1]); }},
    {"name": "PRIMARY_EXPRESSION", "symbols": [(lexer.has("NAME") ? {type: "NAME"} : NAME)], "postprocess": ([d]) => { return new VariableNode(d.value, null); }},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["CONSTANT"], "postprocess": id},
    {"name": "PRIMARY_EXPRESSION", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "EXPRESSION", (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)], "postprocess": (d) => { return d[1]; }},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["PRINT_EXPRESSION"], "postprocess": id},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["MOVE_EXPRESSION"], "postprocess": id},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["FIRE_EXPRESSION"], "postprocess": id},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["FORK_EXPRESSION"], "postprocess": id},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["RANDOM_EXPRESSION"], "postprocess": id},
    {"name": "PRIMARY_EXPRESSION", "symbols": ["CALL_FUNCTION_EXPRESSION"], "postprocess": id},
    {"name": "CONSTANT", "symbols": ["NUMBER"], "postprocess": id},
    {"name": "CONSTANT", "symbols": ["BOOLEAN_VALUE"], "postprocess": id},
    {"name": "NUMBER", "symbols": [(lexer.has("INT") ? {type: "INT"} : INT)], "postprocess": ([d]) => { return new NumberNode(Number(d.value)); }},
    {"name": "NUMBER", "symbols": [(lexer.has("REAL") ? {type: "REAL"} : REAL)], "postprocess": ([d]) => { return new NumberNode(Number(d.value)); }},
    {"name": "BOOLEAN_VALUE", "symbols": [(lexer.has("TRUE") ? {type: "TRUE"} : TRUE)], "postprocess": ([d]) => { return new BooleanNode(true); }},
    {"name": "BOOLEAN_VALUE", "symbols": [(lexer.has("FALSE") ? {type: "FALSE"} : FALSE)], "postprocess": ([d]) => { return new BooleanNode(false); }}
  ],
  ParserStart: "SOURCE",
};

export default grammar;
