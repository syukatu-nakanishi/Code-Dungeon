import { scope, scope_kind } from "./scope";

export function getAlignedLevel(scope: scope): number | null { //変数のスコープからalignされたレベルを得る
    if (scope.getScopeInnerFunc() === null) return null;
    else return (scope.getScopeInnerFunc() as scope).level;
}

export function getAlinedOffset(name: string, scope: scope): number | null { //変数の名前とスコープからalignされたオフセットを得る
    let offset: number = scope.variables[name][1];
    let s: scope = scope;
    if (s === null) return null;
    while (s.kind !== scope_kind.FUNCTION && s.kind !== scope_kind.MAIN) {
        s = s.parent as scope;
        offset += Object.keys(s.variables).length;
    }
    return offset;
}