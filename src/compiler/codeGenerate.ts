import { ASTNode, BinaryOperationNode, BooleanNode, FunctionNode, 
        MainNode, NumberNode, UnaryOperationNode,
        CallFuncNode, SentenceNode,
        VariableNode,
        ExpressionNode,
        VariableDeclarationNode,
        ReturnNode,
        IfNode,
        ElseNode,
        WhileNode,
        ForNode,
        ExpressionSentenceNode,
        PrintNode,
        MoveNode, 
        FireNode,
        ForkNode,
        RandomNode} from "./AST";
import { Operator } from "./Operator";
import { scope } from "./scope";
import { code } from "./code";
import { getAlignedLevel, getAlinedOffset } from "./getAlined";

//export function codeGenerate(node: ASTNode): code[] {
export class codeGenerate {
    symbol_table_tree: scope;
    constructor(symbol_table_tree: scope) {
        this.symbol_table_tree = symbol_table_tree;
    }
    generate(node: ASTNode): code[] {
        if (node instanceof NumberNode || node instanceof BooleanNode) {
            console.log("constant");
            return [[Operator.PUSH, node.value]];
        } else if (node instanceof VariableNode) {
            console.log("name");
            const scope: scope | null = node.scope;
            if (scope === null) { console.log("Error: "); }
            //else return [[Operator.LOAD, scope.level, scope.variables[node.name][1]]];
            else return [[Operator.LOAD, getAlignedLevel(scope) as number, getAlinedOffset(node.name, scope) as number]];
        } else if (node instanceof CallFuncNode) {
            console.log("call func");
            const args: code[] =[];
            for (const e of node.args) {
                if (e instanceof ExpressionNode) args.push(...this.generate(e));
                else console.log("Error: ");
            }
            const scope: scope | null = node.getScope();
            if (scope === null) { console.log("Error: "); }
            else return [ ...args, [Operator.CALL, scope.level, node.args.length], 
                    [Operator.JMP, node.getScope() as scope, node.name]];
        } else if (node instanceof BinaryOperationNode) {
            console.log("binary");
            if (node.operator === Operator.STORE && node.left instanceof VariableNode) {
                const scope: scope | null = node.left.scope;
                if (scope === null) { console.log("Error: "); }
                else 
                //return [ ...this.generate(node.right), 
                //        [Operator.STORE, scope.level, scope.variables[(node.left as VariableNode).name][1]]];
                return [ ...this.generate(node.right), 
                        [Operator.STORE, getAlignedLevel(scope) as number,
                         getAlinedOffset(node.left.name, scope) as number]];
            }
            return [ ...this.generate(node.left), ...this.generate(node.right), [node.operator]];
        } else if (node instanceof UnaryOperationNode) {
            console.log("unary");
            return [ ...this.generate(node.child), [node.operator]];
        } else if (node instanceof FunctionNode) {
            console.log("function");
            const sentences: code[] =[];
            const functions: code[] =[];
            for (const e of node.children) {
                if (e instanceof VariableDeclarationNode) {}
                else if (e instanceof SentenceNode) sentences.push(...this.generate(e));
                else if (e instanceof FunctionNode) 
                    //functions.push([Operator.LABEL, (node.scope as scope), node.name], ...this.generate(e));
                    functions.push([Operator.LABEL, (e.scope as scope), e.name], ...this.generate(e));
            }
            return [ ...sentences, ...functions];
        } else if (node instanceof MainNode) {
            console.log("main");
            const sentences: code[] =[];
            const functions: code[] =[];
            for (const e of node.children) {
                if (e instanceof VariableDeclarationNode) {}
                else if (e instanceof SentenceNode) sentences.push(...this.generate(e));
                else if (e instanceof FunctionNode) //functions.push(...this.generate(e));
                    functions.push([Operator.LABEL, this.symbol_table_tree, e.name], ...this.generate(e));
            }
            return [ ...sentences, [Operator.RETURN, 0], ...functions ];
        } else if (node instanceof ReturnNode) {
            console.log("return");
            if (node.expression === null) return [[Operator.RETURN, (node.function_scope as scope).level]];
            else return [ ...this.generate(node.expression), [Operator.RETURN, (node.function_scope as scope).level]];
        } else if (node instanceof IfNode) {
            console.log("if");
            const sentences: code[] =[];
            const functions: code[] =[];
            for (const e of node.block) {
                if (e instanceof VariableDeclarationNode) {}
                else if (e instanceof SentenceNode) sentences.push(...this.generate(e));
                else if (e instanceof FunctionNode) //functions.push(...this.generate(e));
                    functions.push([Operator.LABEL, (e.scope as scope), e.name], ...this.generate(e));
            }
            if (node.child === null) {
                const label = Symbol();
                return [ ...this.generate(node.condition), [Operator.JMP_IF_NOT, label], 
                    ...sentences, [Operator.JMP, label], ...functions, [Operator.LABEL, label] ];
            } else {
                const before_else = Symbol();
                const after_else = Symbol();
                return [ ...this.generate(node.condition), [Operator.JMP_IF_NOT, before_else], 
                    ...sentences, [Operator.JMP, after_else], ...functions, 
                    [Operator.LABEL, before_else], ...this.generate(node.child),
                    [Operator.LABEL, after_else] ];
            }
        } else if (node instanceof ElseNode) {
            console.log("else");
            const sentences: code[] =[];
            const functions: code[] =[];
            for (const e of node.block) {
                if (e instanceof VariableDeclarationNode) {}
                else if (e instanceof SentenceNode) sentences.push(...this.generate(e));
                else if (e instanceof FunctionNode) 
                    //functions.push([Operator.LABEL, (node.scope as scope), node.name], ...this.generate(e));
                    functions.push([Operator.LABEL, (e.scope as scope), e.name], ...this.generate(e));
            }
            const label = Symbol();
            return [ ...sentences, [Operator.JMP, label], ...functions, [Operator.LABEL, label]];
        } else if (node instanceof WhileNode) {
            console.log("while");
            const sentences: code[] =[];
            const functions: code[] =[];
            for (const e of node.block) {
                if (e instanceof VariableDeclarationNode) {}
                else if (e instanceof SentenceNode) sentences.push(...this.generate(e));
                else if (e instanceof FunctionNode) //functions.push(...this.generate(e));
                    functions.push([Operator.LABEL, (e.scope as scope), e.name], ...this.generate(e));
            }
            const before_label = Symbol();
            const after_label = Symbol();
            return [ [Operator.LABEL, before_label],
                     ...this.generate(node.condition), [Operator.JMP_IF_NOT, after_label], 
                    ...sentences, [Operator.JMP, before_label], ...functions, [Operator.LABEL, after_label] ];
        } else if (node instanceof ForNode) {
            console.log("for");
            const sentences: code[] =[];
            const functions: code[] =[];
            for (const e of node.block) {
                if (e instanceof VariableDeclarationNode) {}
                else if (e instanceof SentenceNode) sentences.push(...this.generate(e));
                else if (e instanceof FunctionNode) //functions.push(...this.generate(e));
                    functions.push([Operator.LABEL, (e.scope as scope), e.name], ...this.generate(e));
            }
            const before_label = Symbol();
            const after_label = Symbol();
            let initial_codes: code[] = [];
            let conditional_codes: code[] = [];
            let update_codes: code[] = [];
            //if (node.initial_expression !== null) initial_codes = [ ...this.generate(node.initial_expression)];
            if (node.initial_expression instanceof ExpressionNode) {
                initial_codes = [ ...this.generate(node.initial_expression)];
            } else if (node.initial_expression !==null
                && node.initial_expression[0] instanceof VariableDeclarationNode
                && node.initial_expression[1] instanceof BinaryOperationNode) {
                    initial_codes = [ ...this.generate(node.initial_expression[1])];
            }
            if (node.conditional_expression !== null) {
                conditional_codes = [ ...this.generate(node.conditional_expression)];
            } else {
                conditional_codes = [[Operator.PUSH, true]];
            }
            if (node.update_expression !== null) update_codes = [ ...this.generate(node.update_expression)];
            return [ ...initial_codes, [Operator.LABEL, before_label], ...conditional_codes,
                     [Operator.JMP_IF_NOT, after_label], ...sentences, ...update_codes,
                     [Operator.JMP, before_label], ...functions, [Operator.LABEL, after_label] ];
        } else if (node instanceof ExpressionSentenceNode) {
            console.log("expression sentence");
            if (node.expression === null) return [];
            else return [ ...this.generate(node.expression), [Operator.POP]];
        } else if (node instanceof PrintNode) {
            console.log("print");
            if (node.expression === null) return [];
            else return [ ...this.generate(node.expression), [Operator.PRINT]];
        } else if (node instanceof MoveNode) {
            console.log("move");
            if (node.expression === null) return [];
            else return [ ...this.generate(node.expression), [Operator.MOVE]];
        } else if (node instanceof FireNode) {
            console.log("fire");
            if (node.expression === null) return [];
            else return [ ...this.generate(node.expression), [Operator.FIRE]];
        } else if (node instanceof ForkNode) {
            console.log("fork");
            return [[Operator.FORK]];
        } else if (node instanceof RandomNode) {
            console.log("random");
            return [[Operator.RANDOM]];
        }
            return [];
    }
}