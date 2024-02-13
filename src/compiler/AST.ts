import { scope } from "./scope";
import { Operator } from "./Operator";


export class ASTNode {}

export class MainNode extends ASTNode {
    children: ASTNode[];
    constructor(children: ASTNode[]) {
        super();
        this.children = children;
    }
}

export class FunctionNode extends ASTNode {
    name: string;
    params: [string, [string, string][]]; //[出力の型，[[第一引数，型], [第二引数，型], ...]]
    scope: scope | null;
    children: ASTNode[];
    constructor(name: string, params: [string, [string, string][]], scope: scope | null, children: ASTNode[]) {
        super();
        this.name = name;
        this.params = params;
        this.scope = scope;
        this.children = children;
    }
}

export class SentenceNode extends ASTNode {
    constructor() {
        super();
    }
}

export class ExpressionSentenceNode extends SentenceNode {
    expression: ExpressionNode | null;
    constructor(expression: ExpressionNode|null) {
        super();
        this.expression = expression;
    }
}

export class ExpressionNode extends SentenceNode {
    constructor() {
        super();
    }
};

export class NumberNode extends ExpressionNode {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
}

export class BooleanNode extends ExpressionNode {
    value: boolean;
    constructor(value: boolean) {
        super();
        this.value = value;
    }
}

export class VariableNode extends ExpressionNode {
    name: string;
    scope: scope | null; //対応する宣言のスコープ
    constructor(name: string, scope: scope | null) {
        super();
        this.name = name;
        this.scope = scope;
    }
    //getScope(): scope | null {
    //    if (this.scope === null) return null;
    //    else return this.scope.getScopeVar(this.name);
    //}
    getType(): string | null {
        const scope: scope | null = this.scope;
        if (scope === null) return null;
        else if (this.name in scope.variables) return scope.variables[this.name][0];
        else return null;
    }
}

export class UnaryOperationNode extends ExpressionNode {
    operator: Operator;
    child: ExpressionNode;
    constructor(operator: Operator, child: ExpressionNode) {
        super();
        this.operator = operator;
        this.child = child;
    }
}

export class BinaryOperationNode extends ExpressionNode {
    operator: Operator;
    left: ExpressionNode;
    right: ExpressionNode;
    constructor(operator: Operator, left: ExpressionNode, right: ExpressionNode) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

export class CallFuncNode extends ExpressionNode {
    name: string;
    args: ExpressionNode[];
    scope: scope | null; //callされているスコープ
    constructor(name: string, args: ExpressionNode[], scope: scope | null) {
        super();
        this.name = name;
        this.args = args;
        this.scope = scope;
    }
    getScope(): scope | null { //call対象の関数のスコープを取得する
        if (this.scope === null) return null;
        else return this.scope.getScopeFunc(this.name);
    }
    getSignature(): string[] | null {
        const scope: scope | null = this.getScope();
        if (scope === null) return null;
        else if (this.name in scope.functions) return scope.functions[this.name][0];
        else return null;
    }
}

export class VariableDeclarationNode extends SentenceNode {
    name: string;
    type: string;
    constructor(name: string, type: string) {
        super();
        this.name = name;
        this.type = type;
    }
}

export class ReturnNode extends SentenceNode {
    expression: ExpressionNode | null;
    function_scope: scope | null;
    constructor(expression: ExpressionNode | null, function_scope: scope | null) {
        super();
        this.expression = expression;
        this.function_scope = function_scope;
    }
}

export class IfNode extends SentenceNode {
    condition: ExpressionNode;
    block: ASTNode[];
    child: IfNode | ElseNode | null;
    constructor(condition: ExpressionNode, block: ASTNode[], child: IfNode | ElseNode | null) {
        super();
        this.condition = condition;
        this.block = block;
        this.child = child;
    }
}

export class ElseNode extends SentenceNode {
    block: ASTNode[];
    constructor(block: ASTNode[]) {
        super();
        this.block = block;
    }
}

export class WhileNode extends SentenceNode {
    condition: ExpressionNode;
    block: ASTNode[];
    constructor(condition: ExpressionNode, block: ASTNode[]) {
        super();
        this.condition = condition;
        this.block = block;
    }
}

export class ForNode extends SentenceNode {
    initial_expression: ExpressionNode | [VariableDeclarationNode, BinaryOperationNode] | null;
    conditional_expression: ExpressionNode | null;
    update_expression: ExpressionNode | null;
    block: ASTNode[];
    constructor(initial_expression: ExpressionNode | VariableDeclarationNode | null,
                conditional_expression: ExpressionNode | null,
                update_expression: ExpressionNode |null,
                block: ASTNode[]) {
        super();
        this.initial_expression = initial_expression;
        this.conditional_expression = conditional_expression;
        this.update_expression = update_expression;
        this.block = block;
    }
}

export class PrintNode extends SentenceNode {
    expression: ExpressionNode | null;
    constructor(expression: ExpressionNode | null) {
        super();
        this.expression = expression;
    }
}

export class MoveNode extends SentenceNode {
    expression: ExpressionNode | null;
    constructor(expression: ExpressionNode | null) {
        super();
        this.expression = expression;
    }
}

export class FireNode extends SentenceNode {
    expression: ExpressionNode | null;
    constructor(expression: ExpressionNode | null) {
        super();
        this.expression = expression;
    }
}

export class ForkNode extends SentenceNode {
    constructor() {
        super();
    }
}

export class RandomNode extends SentenceNode {
    constructor() {
        super();
    }
}