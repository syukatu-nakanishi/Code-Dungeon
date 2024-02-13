import { BinaryOperationNode, BooleanNode, 
        NumberNode, UnaryOperationNode,
        CallFuncNode, 
        ASTNode,
        FunctionNode,
        MainNode,
        VariableNode,
        VariableDeclarationNode,
        ReturnNode,
        IfNode,
        ElseNode,
        WhileNode,
        ForNode,
        ExpressionNode,
        ExpressionSentenceNode,
        PrintNode,
        MoveNode, 
        FireNode,
        ForkNode,
        RandomNode} from "./AST";
import { Operator } from "./Operator";
import { scope } from "./scope";

export function typeCheck(node: ASTNode): string | null {
    if (node instanceof VariableNode) {
        return node.getType();
    } else if (node instanceof NumberNode) {
        return "number";
    } else if (node instanceof BooleanNode) {
        return "boolean";
    } else if (node instanceof UnaryOperationNode) {
        if ([Operator.UADD, Operator.USUB].includes(node.operator)) {
            if (typeCheck(node.child) === "number") return "number";
            else {
                console.log("Type error:  uadd, usub");
                return null;
            }
        } else if (node.operator === Operator.NOT) {
            if (typeCheck(node.child === "boolean")) return null;
            else {
                console.log("Type error: not");
                return null;
            }
        }
        console.log("Error: UnaryOperationNode");
        return null;
    } else if (node instanceof BinaryOperationNode) {
        if ([Operator.ADD,Operator.SUB,Operator.MUL,Operator.DIV,Operator.MOD].includes(node.operator)) {
            if (typeCheck(node.left) === "number" && typeCheck(node.right) === "number") {
                return "number";
            } else {
                console.log("Type error: add, sub, mul, div, mod");
                return null;
            }
        } else if ([Operator.LESS_THAN,Operator.LESS_THAN_EQUAL,Operator.GREATER_THAN,Operator.GREATER_THAN_EQUAL].includes(node.operator)) {
            if (typeCheck(node.left) === "number" && typeCheck(node.right) === "number") {
                return "boolean";
            } else {
                console.log("Type error: less_than, less_than_equal, greater_than, greater_than_equal");
                return null;
            }
        } else if ([Operator.EQUAL,Operator.NOT_EQUAL,Operator.STORE].includes(node.operator)) {
            if (typeCheck(node.left) === typeCheck(node.right)) {
                return "boolean";
            } else {
                console.log("Type error: equal, not_equal");
                return null;
            }
        } else if ([Operator.AND, Operator.OR].includes(node.operator)) {
            if (typeCheck(node.left) === "boolean" && typeCheck(node.right) === "boolean") {
                return "boolean";
            } else {
                console.log("Type error: and, or");
                return null;
            }
        }
        console.log("Error: BinaryOperationNode");
        return null;
    } else if (node instanceof CallFuncNode) {
        const signature: string[] | null = node.getSignature();
        if (signature === null) {
            console.log(`Error: ${node.name} is not found.`);
            return null;
        } else {
            for (let i=0; i<node.args.length; i++) {
                if (typeCheck(node.args[i]) !== signature[i+1]) {
                    console.log("Type error: ");
                    return null;
                }
            }
            return signature[0];
        }
    } else if (node instanceof FunctionNode || node instanceof MainNode) {
        for (const e of node.children) {
            typeCheck(e);
        }
        return null;
    } else if (node instanceof VariableDeclarationNode) {
        return null;
    } else if (node instanceof ReturnNode) {
        if (node.expression === null) {
            return null;
        } else {
            typeCheck(node.expression);
            return null;
        }
    } else if (node instanceof IfNode) {
        typeCheck(node.condition);
        for (const e of node.block) {
            typeCheck(e);
        }
        if (node.child !== null) typeCheck(node.child);
        return null;
    } else if (node instanceof ElseNode) {
        for (const e of node.block) {
            typeCheck(e);
        }
        return null;
    } else if (node instanceof WhileNode) {
        typeCheck(node.condition);
        for (const e of node.block) {
            typeCheck(e);
        }
        return null;
    } else if (node instanceof ForNode) {
        if (node.initial_expression instanceof ExpressionNode) {
            typeCheck(node.initial_expression);
        } else if (node.initial_expression !== null
            && node.initial_expression[0] instanceof VariableDeclarationNode
            && node.initial_expression[1] instanceof BinaryOperationNode) {
                typeCheck(node.initial_expression[0]);
                typeCheck(node.initial_expression[1]);
        }
        if (node.conditional_expression !== null) typeCheck(node.conditional_expression);
        if (node.update_expression !== null) typeCheck(node.update_expression);
        for (const e of node.block) {
            typeCheck(e);
        }
        return null;
    } else if (node instanceof ExpressionSentenceNode) {
        if (node.expression !== null) typeCheck(node.expression);
        return null;
    } else if (node instanceof PrintNode) {
        if (node.expression !== null) return typeCheck(node.expression);
        return null;
    } else if (node instanceof MoveNode) {
        if (node.expression !== null) {
            if (typeCheck(node.expression) === "number") return "number";
            else console.log("Type error: ");
            return null;
        }
    } else if (node instanceof FireNode) {
        if (node.expression !== null) {
            if (typeCheck(node.expression) === "number") return "number";
            else console.log("Type error: ");
            return null;
        }
    } else if (node instanceof ForkNode) {
        return "boolean";
    } else if (node instanceof RandomNode) {
        return "number";
    }
    console.log("Error: not ASTNode.");
    console.log(node);
    return null;
}