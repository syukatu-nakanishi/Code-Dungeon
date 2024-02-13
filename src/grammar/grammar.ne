@preprocessor typescript

@{%
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

%}

@lexer lexer

SOURCE -> ( FUNCTION_DECLARATION | SENTENCE ):*
    {% 
        (d) => 
        { 
            const arr: ASTNode[] = [];
            for (const e of d[0]) {
                if (Array.isArray(e[0])) arr.push(...e[0]);
                else arr.push(e[0]);
            }
            return new MainNode(arr);
        } 
    %}
FUNCTION_DECLARATION -> %FUNCTION %NAME %LPAREN ( null | PARAMETER_LIST ) %RPAREN %COLON %TYPE BLOCK
    {% (d) => { return new FunctionNode(d[1].value, [d[6].value, d[3][0]], null, d[7]); } %}
PARAMETER_LIST -> 
    PARAMETER {% id %}
    | PARAMETER_LIST %COMMA PARAMETER {% (d) => { return [ ...d[0], ...d[2] ]; } %}
PARAMETER -> %NAME %COLON %TYPE {% (d) => { return [[d[0].value, d[2].value]]; } %}
BLOCK -> %LBRACE ( SENTENCE | FUNCTION_DECLARATION ):* %RBRACE 
    {% (d) =>
        {
            const arr: ASTNode[] = [];
            for (const e of d[1]) {
                if (Array.isArray(e[0])) arr.push(...e[0]);
                else arr.push(e[0]);
            }
            return arr;
        }
    %}

#SENTENCE
SENTENCE -> #sentenceは配列で渡される
    %SEMICOLON
    | EXPRESSION_SENTENCE  {% (d) => { return d; } %}
    | VARIABLE_DECLARATION_SENTENCE {% id %}
    | RETURN_SENTENCE {% id %}
    | IF_SENTENCE {% (d) => { return d; } %}
    | WHILE_SENTENCE {% (d) => { return d; } %}
    | FOR_SENTENCE {% (d) => { return d; } %}
    | COMPOUND_SENTENCE 
EXPRESSION_SENTENCE -> EXPRESSION %SEMICOLON {% (d) => { return new ExpressionSentenceNode(d[0]); } %}
VARIABLE_DECLARATION_SENTENCE -> %LET %NAME %COLON %TYPE ( %LSQUARE %INT %RSQUARE ):* ( %ASSIGN EXPRESSION ):? %SEMICOLON
    {% (d) => 
        { 
            if (d[5] === null) return [new VariableDeclarationNode(d[1].value, d[3].value)];
            else 
                return [new VariableDeclarationNode(d[1].value, d[3].value), 
                        new BinaryOperationNode(Operator.STORE, new VariableNode(d[1].value, null), d[5][1])]; 
        } 
    %}
RETURN_SENTENCE -> 
    %RETURN %SEMICOLON {% (d) => { return [new ReturnNode(null, null)]; }%}
    | %RETURN EXPRESSION %SEMICOLON {% (d) => { return [new ReturnNode(d[1], null)]; }%}
IF_SENTENCE -> %IF %LPAREN CONDITIONAL_EXPRESSION %RPAREN BLOCK ( %ELSE %IF %LPAREN CONDITIONAL_EXPRESSION %RPAREN BLOCK ):* ( %ELSE BLOCK):?
    {% (d) =>
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
    %}
WHILE_SENTENCE -> %WHILE %LPAREN CONDITIONAL_EXPRESSION %RPAREN BLOCK
    {% (d) => { return new WhileNode(d[2], d[4]); } %}
FOR_SENTENCE -> 
    %FOR %LPAREN ( EXPRESSION ):? %SEMICOLON ( CONDITIONAL_EXPRESSION ):? %SEMICOLON ( EXPRESSION ):? %RPAREN BLOCK
        {% (d) => { return new ForNode(d[2][0], d[4][0], d[6][0], d[8]); } %}
    | %FOR %LPAREN VARIABLE_DECLARATION_SENTENCE ( CONDITIONAL_EXPRESSION ):? %SEMICOLON ( EXPRESSION ):? %RPAREN BLOCK
        {% (d) => { return new ForNode(d[2], d[3][0], d[5][0], d[7]); } %}
CALL_FUNCTION_EXPRESSION -> %NAME %LPAREN ( null | ARGUMENT_LIST ) %RPAREN
    {% (d) => { return new CallFuncNode(d[0].value, d[2][0], null); } %}
ARGUMENT_LIST ->  
    ARGUMENT {% id %}
    | ARGUMENT_LIST %COMMA ARGUMENT {% (d) => { return [ ...d[0], ...d[2] ]; } %}
ARGUMENT -> EXPRESSION {% ([d]) => { return [d]; } %}
PRINT_EXPRESSION -> %PRINT %LPAREN ( null | EXPRESSION ) %RPAREN
    {% (d) => { return new PrintNode(d[2][0]); } %}
MOVE_EXPRESSION -> %MOVE %LPAREN ( null | EXPRESSION ) %RPAREN
    {% (d) => { return new MoveNode(d[2][0]); } %}
FIRE_EXPRESSION -> %FIRE %LPAREN ( null | EXPRESSION ) %RPAREN
    {% (d) => { return new FireNode(d[2][0]); } %}
FORK_EXPRESSION -> %FORK %LPAREN %RPAREN
    {% (d) => { return new ForkNode(); } %}
RANDOM_EXPRESSION -> %RANDOM %LPAREN %RPAREN
    {% (d) => { return new RandomNode(); } %}

#EXPRESSION
EXPRESSION -> ASSIGNMENT_EXPRESSION  {% id %}
ASSIGNMENT_EXPRESSION -> 
    CONDITIONAL_EXPRESSION {% id %}
    | %NAME %ASSIGN ASSIGNMENT_EXPRESSION
        {% (d) => { return new BinaryOperationNode(Operator.STORE, new VariableNode(d[0].value, null), d[2]); } %}
CONDITIONAL_EXPRESSION -> OR_EXPRESSION {% id %}
OR_EXPRESSION -> 
    AND_EXPRESSION {% id %}
    | OR_EXPRESSION %OR AND_EXPRESSION {% (d) => { return new BinaryOperationNode(Operator.OR, d[0], d[2]); } %}
AND_EXPRESSION -> 
    NOT_EXPRESSION {% id %}
    | AND_EXPRESSION %AND NOT_EXPRESSION {% (d) => { return new BinaryOperationNode(Operator.AND, d[0], d[2]); } %}

NOT_EXPRESSION ->
    EQUALITY_EXPRESSION {% id %}
    | %NOT NOT_EXPRESSION {% (d) => { return new UnaryOperationNode(Operator.NOT, d[1]); } %}
            
EQUALITY_EXPRESSION -> 
    RELATIONAL_EXPRESSION {% id %}
    | EQUALITY_EXPRESSION ( %EQUAL | %NOT_EQUAL ) RELATIONAL_EXPRESSION
        {% (d) =>
            {
                let operation: Operator;
                switch (d[1][0].type) {
                    case "EQUAL": operation = Operator.EQUAL; break;
                    case "NOT_EQUAL": operation = Operator.NOT_EQUAL; break;
                    default: throw new Error("Invalid operation type.")
                }
                return new BinaryOperationNode(operation, d[0], d[2]);
            }
        %}

RELATIONAL_EXPRESSION -> 
    ADDITIVE_EXPRESSION {% id %}
    | RELATIONAL_EXPRESSION ( %LESS_THAN | %LESS_THAN_EQUAL | %GREATER_THAN | %GREATER_THAN_EQUAL ) ADDITIVE_EXPRESSION
        {% (d) =>
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
        %}

ADDITIVE_EXPRESSION -> 
    MULTIPLICATIVE_EXPRESSION {% id %} 
    | ADDITIVE_EXPRESSION ( %ADD | %SUB ) MULTIPLICATIVE_EXPRESSION
        {% (d) =>
            {
                let operation: Operator;
                switch (d[1][0].type) {
                    case "ADD": operation = Operator.ADD; break;
                    case "SUB": operation = Operator.SUB; break;
                    default: throw new Error("Invalid operation type.")
                }
                return new BinaryOperationNode(operation, d[0], d[2]);
            }
        %}

MULTIPLICATIVE_EXPRESSION -> 
    UNARY_EXPRESSION {% id %} 
    | MULTIPLICATIVE_EXPRESSION ( %MUL | %DIV | %MOD ) UNARY_EXPRESSION
        {% (d) =>
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
        %}

UNARY_EXPRESSION -> 
    PRIMARY_EXPRESSION {% id %}
    | %ADD UNARY_EXPRESSION {% (d) => { return new UnaryOperationNode(Operator.UADD, d[1]); } %}
    | %SUB UNARY_EXPRESSION {% (d) => { return new UnaryOperationNode(Operator.USUB, d[1]); } %}

PRIMARY_EXPRESSION -> 
    %NAME {% ([d]) => { return new VariableNode(d.value, null); } %} 
    | CONSTANT {% id %} | %LPAREN EXPRESSION %RPAREN {% (d) => { return d[1]; } %} 
    | PRINT_EXPRESSION {% id %}
    | MOVE_EXPRESSION {% id %}
    | FIRE_EXPRESSION {% id %}
    | FORK_EXPRESSION {% id %}
    | RANDOM_EXPRESSION {% id %}
    | CALL_FUNCTION_EXPRESSION {% id %}
CONSTANT -> NUMBER {% id %} | BOOLEAN_VALUE {% id %}
NUMBER -> 
    %INT {% ([d]) => { return new NumberNode(Number(d.value)); } %}
    | %REAL {% ([d]) => { return new NumberNode(Number(d.value)); } %}
BOOLEAN_VALUE -> 
    %TRUE {% ([d]) => { return new BooleanNode(true); } %}
    | %FALSE {% ([d]) => { return new BooleanNode(false); } %}