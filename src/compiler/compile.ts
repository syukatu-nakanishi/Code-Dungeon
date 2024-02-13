import { Parser, Grammar } from "nearley";
import grammar from "./grammar";
import { codeGenerate } from "./codeGenerate";
import { Operator } from "./Operator";
import { scope_kind, scope } from "./scope";
import { typeCheck } from "./typeCheck";
import { scopeCheck } from "./scopeCheck";
import { backPatch } from "./backPatch";

export function compile(source: string) {
    console.log("source = " + source);

    // 構文解析  source code -> AST 
    const parser = new Parser(Grammar.fromCompiled(grammar));
    try {
    	parser.feed(source);
    } catch (parseError) {
    	console.log(parseError);
    }

    // スコープチェック・記号表の作成
    const symbol_table: scope = scopeCheck(parser.results[0], new scope(scope_kind.MAIN ,null, [], 0, {}, {}));

    // 型検査
    console.log("Type check");
    typeCheck(parser.results[0]);

    // コード生成
    const codeGen = new codeGenerate(symbol_table);
    let codes = codeGen.generate(parser.results[0]);
    //console.log("reference = " + codeGen.reference);

    //バックパッチ
    const backPt = new backPatch();
    backPt.fillAddress(codes);
    backPt.backPatch(codes);

    //シンボルテーブルの表示
    console.log("symbol_table_tree:");

    //コードの表示
    console.log("CODE:");
    let loop = 0;
    for (const e of codes) {
    	if (e.length === 1) {
    		console.log(`${loop++} ${Operator[e[0]]}`);
    	} else if (e.length === 2) {
    		console.log(`${loop++} ${Operator[e[0]]}, ${e[1]}`);
    	} else if (e.length === 3) {
    		console.log(`${loop++} ${Operator[e[0]]}, ${e[1]}, ${e[2]}`);
    	}
    }

    return codes;
}

