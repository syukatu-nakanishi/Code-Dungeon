import { Operator } from "./Operator";
import { code } from "./code";
import { scope } from "./scope";

export class backPatch {
    private reference: { [key: symbol]: number };
    constructor() {
        this.reference = {};
    }
    fillAddress(codes: code[]): code[] {
        for (let i=0; i<codes.length; i++) {
            if (codes[i][0] === Operator.LABEL) {
                //関数のラベルの場合
                if (codes[i][1] instanceof scope) {
                    (codes[i][1] as scope).functions[codes[i][2] as string][1] = i;
                    codes.splice(i,1);
                    return this.fillAddress(codes);
                //JMP先のラベルの場合
                } else if (typeof codes[i][1] === "symbol") {
                    this.reference[codes[i][1] as symbol] = i;
                    codes.splice(i,1);
                    return this.fillAddress(codes);
                }
            }
        }
        return codes;
    }
    backPatch(codes: code[]): code[] {
        for (const code of codes) {
            if (code[1] instanceof scope && typeof code[2] === "string") {
                code[1] = (code[1] as scope).functions[code[2] as string][1] as number;
            }
            if (typeof code[1] === "symbol") {
                code[1] = this.reference[code[1] as symbol];
            }
        }
        return codes;
    }
}