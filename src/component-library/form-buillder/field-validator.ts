const performValidations = (validations : any[], value : any) => {
    let validationResult = false;
    validations.every(validation => {
        if(validation.rule==="compound"){
            validationResult = validationResult || validation.validationSpec(value);
        }
        if(validation!==false){
            return false;
        }
        return true;
    });
    return validationResult;
}

export default performValidations;