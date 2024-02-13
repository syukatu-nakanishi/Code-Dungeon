import { Operator } from "./Operator";
import { code } from "./code";

type return_address = number | null;
//type return_value = number | boolean | null;
type return_display = number | null;
type local_variables = number | boolean;

export class StackMachine {
    pc: number;
    codes: code[];
    private stack: (number|boolean)[];
    private frames: [return_address, return_display, local_variables[]][];
    private display: (number)[]; // level -> frame

    x: number; //キャラクターのx座標
    y: number;
  
    isFire: boolean;
    fireAngle: number;
    isFork: boolean;
  
    constructor(
      x: number, y: number, 
      codes: code[], pc: number = 0, 
      stack = [], frames: [return_address, return_display, local_variables[]][] = [[null, null, []]],
      display: (number)[] = [0]) {
        this.pc = pc;
        this.codes = codes;
        this.stack = stack;
        //this.frames = [[null, null, []]];
        this.frames = frames;
        //this.display = [0];
        this.display = display;
        this.x = x;
        this.y = y;
        this.isFire = false;
        this.fireAngle = 0;
        this.isFork = false;
    }

    store(level: number, offset: number): void {
      const a = this.stack.pop();
      if (typeof a === "number" || typeof a === "boolean") {
        this.frames[this.display[level]][2][offset] = a;
      }
    }

    load(level: number, offset: number): void{
      this.stack.push(this.frames[this.display[level]][2][offset]);
    }

    uadd(): void{
      const a = this.stack.pop();
      if (typeof a === "number") {
        this.stack.push(a);
      } else {
        console.log("Error");
      }
    }
    
    usub(): void{
      const a = this.stack.pop();
      if (typeof a === "number") {
        this.stack.push(-a);
      } else {
        console.log("Error");
      }
    }

    add(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a + b);
      } else { console.log("Error: "); }
    }
  
    subtract(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a - b);
      } else console.log("Error :");
    }
  
    multiply(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a * b);
      } else console.log("Error: ");
    }
  
    divide(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a / b);
      } else console.log("Error: ");
    }
  
    modulo(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a % b);
      } else console.log("Error: ");
    }

    less_than(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a < b);
      } else console.log("Error: ");
    }

    less_than_equal(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a <= b);
      } else console.log("Error: ");
    }

    greater_than(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a > b);
      } else console.log("Error: ");
    }

    greater_than_equal(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "number" && typeof b === "number") {
        this.stack.push(a >= b);
      } else console.log("Error: ");
    }

    equal(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      this.stack.push(a === b);
    }

    not_equal(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      this.stack.push(a !== b);
    }

    not(): void {
      const a = this.stack.pop();
      if (typeof a === "boolean") {
        this.stack.push(!a);
      } else console.log("Error: ");
    }

    and(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "boolean" && typeof b === "boolean") {
        this.stack.push(a && b);
      } else console.log("Error: ");
    }

    or(): void {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof a === "boolean" && typeof b === "boolean") {
        this.stack.push(a || b);
      } else console.log("Error: ");
    }

    execute(): void {
      //for (let pc = 0; pc<this.codes.length; pc++) {
        //console.log("frame = " + this.frames);
        console.log();
        console.log(this.frames);
        console.log("stack = " + this.stack);
        console.log("display = " + this.display);
        if (this.codes[this.pc].length === 1) {
          console.log(`${this.pc} ${Operator[this.codes[this.pc][0]]}`);
        } else if (this.codes[this.pc].length === 2) {
          console.log(`${this.pc} ${Operator[this.codes[this.pc][0]]}, ${this.codes[this.pc][1]}`);
        } else if (this.codes[this.pc].length === 3) {
          console.log(`${this.pc} ${Operator[this.codes[this.pc][0]]}, ${this.codes[this.pc][1]}, ${this.codes[this.pc][2]}`);
        }

        console.log("this.x = " + this.x);
        console.log("this.y = " + this.y);
        switch (this.codes[this.pc][0]) {
          case Operator.PUSH:
            if (typeof this.codes[this.pc][1] === "number" || typeof this.codes[this.pc][1] === "boolean")
            this.stack.push(this.codes[this.pc][1] as number|boolean);
            break;
          case Operator.POP:
            this.stack.pop();
            break;
          case Operator.STORE:
            if (this.codes[this.pc].length === 3 && typeof this.codes[this.pc][1] === "number" && typeof this.codes[this.pc][2] === "number") {
              this.store(this.codes[this.pc][1] as number, this.codes[this.pc][2] as number);
            }
            break;
          case Operator.LOAD:
            if (this.codes[this.pc].length === 3 && typeof this.codes[this.pc][1] === "number" && typeof this.codes[this.pc][2] === "number") {
              this.load(this.codes[this.pc][1] as number, this.codes[this.pc][2] as number);
            }
            break;
          case Operator.UADD:
            this.uadd();
            break;
          case Operator.USUB:
            this.usub();
            break;
          case Operator.ADD:
            this.add();
            break;
          case Operator.SUB:
            this.subtract();
            break;
          case Operator.MUL:
            this.multiply();
            break;
          case Operator.DIV:
            this.divide();
            break;
          case Operator.MOD:
            this.modulo();
            break;
          case Operator.LESS_THAN:
            this.less_than();
            break;
          case Operator.LESS_THAN_EQUAL:
            this.less_than_equal();
            break;
          case Operator.GREATER_THAN:
            this.greater_than();
            break;
          case Operator.GREATER_THAN_EQUAL:
            this.greater_than_equal();
            break;
          case Operator.EQUAL:
            this.equal();
            break;
          case Operator.NOT_EQUAL:
            this.not_equal();
            break;
          case Operator.NOT:
            this.not();
            break;
          case Operator.AND:
            this.and();
            break;
          case Operator.OR:
            this.or();
            break;
          case Operator.CALL: //[CALL, level, arity]
            //新しいフレームを作成
            this.frames.push([this.pc+2, this.display[this.codes[this.pc][1] as number + 1], this.stack.splice(-(this.codes[this.pc][2] as number))]);
            //呼び出し側のレベルのディスプレイが今作ったフレームを指すようにする
            this.display[this.codes[this.pc][1] as number + 1] = this.frames.length - 1;
            break;
          case Operator.RETURN: //[RETURN, level, haveArg]
            //level 0の場合プログラムを終了
            if (this.codes[this.pc][1] === 0) { return ;}
              ////返り値があるなら呼び出し側フレームのreturn_valueへセット
              //if (this.stack.length>0) {
              //  this.frames[this.frames.length-2][1] = this.stack.pop() as number | boolean;
              //}
            //呼び出され側関数のレベルのディスプレイを，退避していた値に戻す
            this.display[this.codes[this.pc][1] as number] =  this.frames[this.frames.length-1][1] as number;
            //退避していたthis.pcを回復
            this.pc = this.frames[this.frames.length-1][0] as number -1; //+1されてしまうので-1している
            //現フレームを削除
            this.frames.pop();
            break;
          case Operator.JMP: //[JMP, address]
            this.pc = this.codes[this.pc][1] as number - 1; //+1されてしまうので-1している
            break;
          case Operator.JMP_IF: //[JMP_IF, address]
            if (this.stack.pop()) this.pc = this.codes[this.pc][1] as number - 1;
            break;
          case Operator.JMP_IF_NOT: //[JMP_NOT_IF, address]
            if (!this.stack.pop()) this.pc = this.codes[this.pc][1] as number - 1;
            break;
          case Operator.PRINT: //[PRINT]
            console.log(this.stack[this.stack.length-1]);
            break;
          case Operator.MOVE: //[MOVE]
            const radiansMove: number = (this.stack[this.stack.length-1] as number * Math.PI) / 180;
            const vxMove: number = Math.cos(radiansMove);
            const vyMove: number = Math.sin(radiansMove);
            this.x += 10 * vxMove;
            this.y -= 10 * vyMove; // コンピュータの座標と逆
            break;
          case Operator.FIRE: //[FIRE]
            this.isFire = true;
            this.fireAngle = this.stack[this.stack.length-1] as number;
            break;
          case Operator.FORK: //[FORK]
            this.isFork = true;
            this.stack.push(true);
            break;
          case Operator.RANDOM: //[RANDOM]
            this.stack.push(Math.random());
            break;
          default:
            console.log("Error: Not an operation.")
            break;
        }
        this.pc++;
    }
  
    getResult(): number | boolean | undefined {
      return this.stack[0];
    }
  }