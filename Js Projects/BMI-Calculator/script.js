const form = document.querySelector('form');

form.addEventListener('submit', function(e){
    e.preventDefault();

    const height = parseInt(document.querySelector('#height').value);
    const weight = parseInt(document.querySelector('#weight').value);
    const results = document.querySelector('#results');

    if(height === '' || height < 0 || isNaN(height)){
        results.innerHTML = `Please give a valid height ${height}`;
    }
    else if(weight === '' || weight < 0 || isNaN(weight)){
        results.innerHTML = `Please give a valid height ${weight}`;
    }
    else{
        const BMI = (weight / ((height*height)/10000)).toFixed(1);
        if(BMI < 18.6){
            results.innerHTML = `Your Bmi is ${BMI} and you are UnderWeight`
        }
        else if(BMI > 18.6 && BMI < 24.9){
            results.innerHTML = `Your Bmi is ${BMI} and you are Normal`
        }
        else{
            results.innerHTML = `Your Bmi is ${BMI} and you are OverWeight`
        }
    }
    

})