// parser for ternary operation named x
function x(condition, truthyValue, falsyValue){

    switch(condition){
        case true:
            return truthyValue
        case false:
            return falsyValue
    }
}

// create local variables from object map and evaluate expression
(function run(exp, args){
    // create global variables from object map
    for(key of Object.keys(args)){
        eval(`var ${key} = ${args[`${key}`]};`)
    };

    console.log(eval(exp))
})(`x(var_1 == 2, 0, x(var_2 == 4, 15, 0)) 
+ x(var_2 == 3, 5, 0) 
- x(var_4 == 2, 0, 5) 
+ x(var_3 == 3, 5, 0)`, {
                            var_1: 1,
                            var_2: 4,
                            var_3: 3,
                            var_4: 5
                        }); // test case: output -> 15



