function concatenate(leadingNum, matrix){

    // base case
    if(matrix.length === 0){
        return leadingNum
    }

    let result = []

    matrix[0].forEach(element => {
        result.push(leadingNum + ' ' + concatenate(element, matrix.slice(1)))
    })

    return result
}

// works
function addMissing(complete, deficit){
    const deficitAmount = complete.length - deficit.length
    if(deficitAmount !== 0){
        return complete.slice(0,deficitAmount) + deficit
    }
    
    return deficit;
}

// works
function removeLeadingNum(toRemove){
    let copy = []

    toRemove.forEach(element => {
        copy.push(element.slice(2))
    })

    return copy;
}

function processResult(rough){
    let proper = []

    rough.forEach(element => {
        element.split(',').forEach(el => {
            proper.push(el)
        })
    })

    // parse all to add missing digits
    let cursor = 1
    for(let i =0; i< proper.length; i++){
        if(cursor < proper.length){
            proper[cursor] = addMissing(proper[i], proper[cursor])
            cursor++
        }
    }

    proper = removeLeadingNum(proper);

    return proper
}

// test
(function testRun(){
    const sample = [[1,2,3],[4,5,6]];
    console.log(processResult(concatenate('x',sample)));
})()