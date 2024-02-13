import { BinaryOperationNode, BooleanNode, 
        VariableNode, NumberNode, UnaryOperationNode,
        CallFuncNode, 
        ASTNode,
        FunctionNode,
        MainNode,
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
        ForkNode} from "./AST";
import { scope_kind, variables, scope } from "./scope";

/*
    機能：
    記号表を作る（出力）
    変数名・関数名の二重登録のチェックを行う
    変数名・関数名のスコープを確定する
*/
export function scopeCheck(node: ASTNode, current_scope: scope): scope {
    if (node instanceof MainNode) {
        for (const e of node.children) {
            scopeCheck(e, current_scope);
        }
    } else if (node instanceof VariableDeclarationNode) {
        //二重登録のチェック
        if (node.name in current_scope.variables || node.name in current_scope.functions) {
            console.log(`Error: ${node.name} is already declared in this scope.`);
        } else {
            //二重登録されていなかったらプッシュ
            current_scope.variables[node.name]= [node.type, Object.keys(current_scope.variables).length];
        }
    } else if (node instanceof FunctionNode) {
        //二重登録のチェック
        if (node.name in current_scope.variables || node.name in current_scope.functions) {
            console.log(`Error: ${node.name} is already declared in this scope.`);
        } else {
            //二重登録されていなかったらプッシュ
            const signature: string[] = [node.params[0], ...node.params[1].map(array => array[1])];
            current_scope.functions[node.name] = [signature, null];
        }
        //スコープの確定
        node.scope = current_scope;
        //新しいスコープの作成
        const params: variables = {};
        for (const e of node.params[1]) {
            params[e[0]] = [e[1], Object.keys(params).length];
        }
        const child_scope: scope = 
            new scope(scope_kind.FUNCTION, current_scope, [], current_scope.level+1, params, {});
        current_scope.pushChild(child_scope);
        for (const e of node.children) {
            scopeCheck(e, child_scope);
        }
    } else if (node instanceof VariableNode) {
        //登録されているかチェック & 変数のスコープを確定
        node.scope = current_scope.getScopeVar(node.name);
        if (node.scope === null) console.log(`Error: ${node.name} is not found.`);
    } else if (node instanceof UnaryOperationNode) {
        scopeCheck(node.child, current_scope);
    } else if (node instanceof BinaryOperationNode) {
        scopeCheck(node.left, current_scope);
        scopeCheck(node.right, current_scope);
    } else if (node instanceof CallFuncNode) {
        //スコープを確定
        node.scope = current_scope;
        for (const e of node.args) {
            scopeCheck(e, current_scope);
        }
    } else if (node instanceof ReturnNode) {
        node.function_scope = current_scope.getScopeInnerFunc();
        if (node.expression === null) {}
        else scopeCheck(node.expression, current_scope);
    } else if (node instanceof IfNode) {
        scopeCheck(node.condition, current_scope);
        const block_scope: scope = new scope(scope_kind.IF, current_scope, [], current_scope.level+1, {}, {});
        current_scope.pushChild(block_scope);
        for (const e of node.block) {
            scopeCheck(e, block_scope);
        }
        if (node.child !== null) {
            const child_scope: scope = new scope(scope_kind.IF, current_scope, [], current_scope.level+1, {}, {});
            current_scope.pushChild(child_scope);
            scopeCheck(node.child, child_scope);
        }
    } else if (node instanceof ElseNode) {
        for (const e of node.block) {
            scopeCheck(e, current_scope);
        }
    } else if (node instanceof WhileNode) {
        scopeCheck(node.condition, current_scope);
        const block_scope: scope = new scope(scope_kind.WHILE, current_scope, [], current_scope.level+1, {}, {});
        current_scope.pushChild(block_scope);
        for (const e of node.block) {
            scopeCheck(e, block_scope);
        }
    } else if (node instanceof ForNode) {
        const block_scope: scope = new scope(scope_kind.FOR, current_scope, [], current_scope.level+1, {}, {});
        current_scope.pushChild(block_scope);
        if (node.initial_expression instanceof ExpressionNode) {
            scopeCheck(node.initial_expression, block_scope);
        } else if (node.initial_expression !== null 
            && node.initial_expression[0] instanceof VariableDeclarationNode
            && node.initial_expression[1] instanceof BinaryOperationNode) {
                scopeCheck(node.initial_expression[0], block_scope);
                scopeCheck(node.initial_expression[1], block_scope);
        }
        if (node.conditional_expression !== null) scopeCheck(node.conditional_expression, block_scope);
        if (node.update_expression !== null) scopeCheck(node.update_expression, block_scope);
        for (const e of node.block) {
            scopeCheck(e, block_scope);
        }
    } else if (node instanceof ExpressionSentenceNode) {
        if (node.expression !== null) scopeCheck(node.expression, current_scope);
    } else if (node instanceof PrintNode) {
        if (node.expression !== null) scopeCheck(node.expression, current_scope);
    } else if (node instanceof MoveNode) {
        if (node.expression !== null) scopeCheck(node.expression, current_scope);
    } else if (node instanceof FireNode) {
        if (node.expression !== null) scopeCheck(node.expression, current_scope);
    }
    return current_scope;
}