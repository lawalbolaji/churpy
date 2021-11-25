function run(exp, args){
    // create global variables from object map
    for(key of Object.keys(args)){
        eval(`var ${key} = ${args[`${key}`]};`);
    };

    function compute(param){
        const [condition, truthyValue, falsyValue] = param.slice(1, param.length-1).split(',');

        switch( eval(condition) ){
            case true:
                return truthyValue
            case false:
                return falsyValue
        }
    }

    function ternary(exp){
        let localExp = exp;

        localExp = localExp.replaceAll(new RegExp('if\s*', 'g'), '');

        let openBracketPos, closeBracketPos, bracketCount;
        do{
            bracketCount = 0;
            for (let cursor = 0; cursor < exp.length; cursor++) {
                if(localExp[cursor] === '('){
                    openBracketPos = cursor;
                    bracketCount++;
                }
                if(localExp[cursor] === ')'){
                    closeBracketPos = cursor;
                    bracketCount--;

                    const evalResult = compute(localExp.slice(openBracketPos, closeBracketPos+1));
                    localExp = localExp.slice(0, openBracketPos) + evalResult + localExp.slice(closeBracketPos+1);
                    break;
                }
            }
        }while(bracketCount);

        return localExp
        
    }

    function matchBracketExtract(exp){
        let openBracketPos, closeBracketPos, bracketCount, expressions = [], operands = [], result = []

        bracketCount = 0;
        for (let cursor = 0; cursor < exp.length; cursor++) {
            if(exp[cursor] === '('){
                if(!bracketCount){ // only change openBracketPos if close bracketCount is zero
                    openBracketPos = cursor;

                    // extract the arithmetic operand
                    operands.push(exp.slice(closeBracketPos+1, openBracketPos))
                }
                bracketCount++;
            }
            if(exp[cursor] === ')'){
                closeBracketPos = cursor
                bracketCount--
                if(!bracketCount && cursor){
                    expressions.push(exp.slice(openBracketPos, closeBracketPos+1))
                }
            }
        }
        result.push(expressions, processOperands(operands))

        return result
    }

    function processOperands(operands){
        localOper = [...operands]

        for(let operand = 0; operand <localOper.length; operand++){
            localOper[operand] = localOper[operand].replaceAll(new RegExp('if', 'g'), '').trim()
        }

        return localOper.slice(1)
    }

    // workspace
    const [expressions, operands] = matchBracketExtract(exp);
    const resolvedExpressions = [];
    expressions.forEach(element => {
        resolvedExpressions.push(ternary(element))
    });

    let finalString = ``;
    resolvedExpressions.forEach(element => {
        const operand = operands.shift()
        finalString += element.trim() + (operand ? operand : '')
    })

    return eval(finalString)
}

console.log(run("if (var_1 == 2, 0, if (var_2 == 4, 15, 0)) + if (var_2 == 3, 5, 0) - if (var_4 == 2, 0, 5) + if (var_3 == 3, 5, 0)", 
{
    var_1: 1,
    var_2: 4,
    var_3: 3,
    var_4: 5
})); // test case: output -> 15

// NB: I do not use template string for the multiline if statements because "if" is natively implemented in js 