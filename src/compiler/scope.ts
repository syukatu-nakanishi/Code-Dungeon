export enum scope_kind { MAIN, FUNCTION, IF, WHILE, FOR };
export interface variables { [key: string]: [string, number] }; //名前 -> 型, offset
interface functions { [key: string]: [string[], number|null] }; //名前 -> [出力の型，入力1の型，入力2の型，...], address

class node { //木のノード
    parent: node | null; //ルートのparentはnullとする
    children: (node)[];
    constructor(parent: node | null, children: (node)[]) {
        this.parent = parent;
        this.children = children;
    }
}

export class scope extends node {
    kind: scope_kind;
    parent: scope | null;
    children: (scope)[];
    level: number;
    variables: variables;
    functions: functions;
    constructor(kind: scope_kind, parent: scope | null, children: (scope)[], level: number, 
        variables: variables, functions: functions){
        super(parent, children);
        this.parent = parent;
        this.children = children
        this.kind = kind;
        this.level = level;
        this.variables = variables;
        this.functions = functions;
    }
    pushChild(child: scope) {
        this.children.push(child);
    }

    //変数名 -> その変数が宣言されているスコープ
    getScopeVar(key: string): scope | null {
        if (key in this.variables) return this;
        else if (this.parent === null) return null;
        else return this.parent.getScopeVar(key);
    }

    //関数名 -> その関数が宣言されているスコープ
    getScopeFunc(key: string): scope | null {
        if (key in this.functions) return this;
        else if (this.parent === null) return null;
        else return this.parent.getScopeFunc(key);
    }

    //void -> 最内の関数のスコープ
    getScopeInnerFunc(): scope | null {
        if (this.kind === scope_kind.FUNCTION) return this;
        else if (this.kind === scope_kind.MAIN) return this;
        else return (this.parent as scope).getScopeInnerFunc();
    }
}
