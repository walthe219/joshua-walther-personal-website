//Setup maps for field Ids -> field elements and variable values
const variableFields = new Map();
const vars = new Map();
const variableIDs = ["v0","theta0","t0","vf","thetaf","tf","x","v0x","vfx","ax","y","v0y","vfy","ay","deltat"];
for (const id of variableIDs){
    const field = document.getElementById(id)
    if(field==null){
        console.warn("ID " + id + "does not reference an existing textfield");
    }
    else{
        variableFields.set(id,field);
    } 
}


//reads current field values and tries to calculate unknown values if possible
function calculate(){
    console.log("Calculating values...");
    readFields();

    // const _v0 = vars.get("v0");
    // const _theta0 = vars.get("theta0");
    // if(notNaN(_v0) && notNaN(_theta0)){
    //     vars.set("v0x", _v0 * Math.cos(_theta0 *180/Math.PI));
    //     vars.set("v0y", _v0 * Math.sin(_theta0 *180/Math.PI));
    // }
    // const _vf = vars.get("v0");
    // const _thetaf = vars.get("theta0");
    // if(notNaN(_vf) && notNaN(_thetaf)){
    //     vars.set("vfx", _vf * Math.cos(_thetaf *180/Math.PI));
    //     vars.set("v0y", _vf * Math.sin(_thetaf *180/Math.PI));
    // }


    //Calculate x and y variables
    let xvars = calc1D(getValues(["x","v0x","vfx","ax","deltat"]));
    let yvars = calc1D(getValues(["y","v0y","vfy","ay","deltat"]));

    if(xvars){
        setValues(["x","v0x","vfx","ax","deltat"],xvars);
    }
    if(yvars){
        setValues(["y","v0y","vfy","ay","deltat"],yvars);
    }
    if(xvars==null && yvars){
        xvars = calc1D(getValues(["x","v0x","vfx","ax","deltat"]));
        if(xvars)setValues(["x","v0x","vfx","ax","deltat"],xvars);
    }
    else if(yvars==null && xvars){
        yvars = calc1D(getValues(["y","v0y","vfy","ay","deltat"]));
        if(yvars)setValues(["y","v0y","vfy","ay","deltat"],yvars);
    }

    writeFields();
    console.log("Complete!");
}


// calculates kinematic variables in one dimension, 
// give values for displacement, initial velocity, finial velocity, accelaration time
// values are null if unknown
// if atleast 3 values know can calculate the rest, return array 5 calculate variables
// if not return null
function calc1D(valArr){
    let d =  valArr[0];
    let v0 =  valArr[1];
    let vf =  valArr[2];
    let a =  valArr[3];
    let t =  valArr[4];
    console.log(`Calculating 1D: [${d},${v0},${vf},${a},${t}]` );
    
    if(t==0){ //if time is 0 then there is no change
        console.log(`Returnng ${valArr}`)
        return valArr;
    }

    if(a==0){ //both velocities most be equal and can use v=xt equation instead of kinematics
        
        if(notNaN(d) && notNaN(t)){ //n
            v0=d/t;
            vf=d/t;
        }
        else{ //atleast one of the v's are known
            if(v0) vf=v0;
            if(vf) v0=vf; 
        }

        if(notNaN(v0) && notNaN(t)){
            d=v0*t;
        }
        if(notNaN(d) && notNaN(v0)){
            t=d/v0;
        }
        console.log(`Returnng ${[d,v0,vf,a,t]}`)
        return [d,v0,vf,a,t]; // return newly calculated values
    }

    //kinematic forumlas, need three knows
    if(notNaN(d) && notNaN(v0) && notNaN(vf)){
        a = (vf**2-v0**2)/(2*d);
        console.log([d,v0,vf,a,t]);
        t = 2*d/(vf+v0);
        console.log([d,v0,vf,a,t]);

    } else if(notNaN(d) && notNaN(v0) && notNaN(a)){
        vf = Math.sqrt(v0**2 + 2*a*d);
        t = (vf-v0)/a;
        //  t = Math.max(quadraticForm(0.5*a**2,v0,-d));

    } else if(notNaN(d) && notNaN(v0) && notNaN(t)){
        vf = 2*d/t -v0;
        a = 2*(d-v0*t)/t**2;

    } else if(notNaN(d) && notNaN(vf) && notNaN(a)){
        v0 =Math.sqrt(vf**2 - 2*a*d);
        t = (vf-v0)/a;
        //t = Math.max(quadraticForm(-0.5*a**2,vf,-d)); //bug here 

    } else if(notNaN(d) && notNaN(vf) && notNaN(t)){
        v0 = 2*d/t - vf;
        a = 2*(d+vf*t)/t**2;

    } else if(notNaN(d) && notNaN(a) && notNaN(t)){
        v0 = (d -0.5 *a*t**2)/t;
        vf = (d+0.5*a*t**2)/2;

    } else if(notNaN(v0) && notNaN(vf) && notNaN(a)){
        d = (vf**2-v0**2)/(2*a);
        t = (vf-v0)/a;

    } else if(notNaN(v0) && notNaN(vf) && notNaN(t)){
        d = 0.5*(v0+vf)*t;
        a = (vf-v0)/t;

    } else if(notNaN(v0) && notNaN(a) && notNaN(t)){
        d = v0*t + 0.5*a*t**2;
        vf = v0 + a*t;

    } else if(notNaN(vf) && notNaN(a) && notNaN(t)){
        d = vf*t-0.5*a*t**2;
        v0 = vf-a*t;

    } else{ //know less than three variables, no new information can be calculated
        console.log(`Returnng ${null}`)
        return null
    }
    console.log(`Returnng ${[d,v0,vf,a,t]}`)         
    return [d,v0,vf,a,t]; // return newly calculated values
}


function getValues(idArray){
    let valArr = new Array(idArray.length);
    idArray.forEach((id,i)=>{
        valArr[i] = vars.get(id);
    });
    return valArr;
}

//takes an array of varialbe ids and corresponding values to set them to 
function setValues(idArray,valArray){
    idArray.forEach((id,i)=>{
        value = valArray[i];
        vars.set(id,value);
    });
}

/* 
////////////////////////
READ AND WRITE FUNCTIONS
////////////////////////
*/

//Get values from textfields and add them to variable map
function readFields(){
    variableFields.values().forEach((field, i) => {
        const id = variableIDs[i];
        let value = field.value;
        if(value.length==0 || value==undefined||value==NaN){
            value = undefined ;
        }
        else{
            //known = known +1;
        }
        vars.set(id,+value);
    });
}


//Set values of textfields from variable map
function writeFields(){
    variableFields.values().forEach((field, i) => {
        const id = variableIDs[i];
        let value = vars.get(id);
        field.value = value===value?value:"";
    });
}


//sets value of all textfields to null
function resetFields(){
    for(id of variableIDs){
        vars.set(id,null);
    }
    writeFields();
}

/* 
////////////////////////
MATH FUNCTIONS
////////////////////////
*/

function notNaN(num){
    return num===num;
}

//returns hypotenuse side c with two sides a b
 function pythTheorem(a,b){
    return Math.sqrt(a**2 + b**2);
}


//returns side length a give hypotenuse side c and side b
 function revPythTheorem(c,b){
    return Math.sqrt(c**2 - b**2);
}


//returns two values from quadratic formula based on constants a b and c
 function quadraticForm(a,b,c){
    const right_side = Math.sqrt(b**2 -4*(a)*(c))/2*a;
    return[-b/2*a + right_side,-b/2*a + right_side];
}
