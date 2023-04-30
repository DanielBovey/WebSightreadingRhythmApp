const rhythmContainer = document.querySelector('#rhythm-container');
const rhythmDisplayLine1 = document.querySelector('.rhythm-display');
const timeSignatureDisplay = document.querySelector('#time-sig');
let timeSignatureValue = 4;
let bars = 2;
let rhythm = [];
const newRhythmButton = document.querySelector('#new-rhythm');
const playbackButton = document.querySelector('#playback');
let rhythmDisplayLine2;
let line2IsPresent = false;
let currentDisplayLine = rhythmDisplayLine1;
let barsFilled = 0;

const images = [];

const imagePaths = ['Images/newbarline.png', //0
                    'Images/newdoublebarline.png', //1
                    'Images/newquaver.png', //2
                    'Images/newtwoquavers.png',//3
                    'Images/newquaverrest.png',//4
                    'Images/newcrotchet.png',//5
                    'Images/newcrotchetrest.png',//6
                    'Images/newminim.png',//7
                    'Images/newminimrest.png',//8
                    'Images/newdottedminim.png',//9
                    'Images/newsemibreve.png']//10

for(let i = 0; i<imagePaths.length; i++) {
    let image = new Image();
    image.src = imagePaths[i];
    image.classList.add('notation', 'fade-in');
    images.push(image);
}

const timeSigRadios = document.getElementsByName('time-sig-selection');
const rhythmsCheckBoxes = document.getElementsByName('values-included');
const numBarsRadios = document.getElementsByName('num-bars');

timeSigRadios[0].checked = true; //the 44 time signature button is selected by default when the page loads
numBarsRadios[1].checked = true; //the 2 bars button is selected by default when the page loads

rhythmsCheckBoxes.forEach((checkBox) => {
    checkBox.checked = true;
})

for (let i = 0; i < timeSigRadios.length; i++) {
  timeSigRadios[i].addEventListener('change', function() {
    timeSignatureValue = parseInt(this.value); 
  });
}

for (let i = 0; i < numBarsRadios.length; i++) {
    numBarsRadios[i].addEventListener('change', function() {
        bars = parseInt(this.value);
    })
}



class rhythmValue {
    constructor(length, isRest){
        this.length = length;
        this.isRest = isRest;
    }
}

const rhythmsMap = {
    'crotchet': new rhythmValue(1, false),
    'minim': new rhythmValue(2, false),
    'dottedMinim': new rhythmValue(3, false),
    'semibreve': new rhythmValue(4, false),
    'quaver': new rhythmValue(0.5, false),
    'crotchetRest': new rhythmValue(1, true),
    'minimRest': new rhythmValue(2, true),
    'quaverRest': new rhythmValue(0.5, true)
}


function generateRhythm() {
    let rhythm = [];
    let nextValue;
    let rhythmsIncluded = [];
    

    for (let i = 0; i < rhythmsCheckBoxes.length; i++) {
        if(rhythmsCheckBoxes[i].checked) {
            rhythmsIncluded.push(rhythmsMap[rhythmsCheckBoxes[i].value]);
        }
    }
    let possibleValues = [];
    for (i = 0; i<rhythmsIncluded.length; i++) {
        possibleValues.push(rhythmsIncluded[i]);
        if(!rhythmsIncluded[i].isRest) { //adding extra non-rest values to create a bias against rests
            possibleValues.push(rhythmsIncluded[i]);
        }
    }
    
    totalTimeRemaining = bars*timeSignatureValue;
    timeRemainingInBar = timeSignatureValue;
    
    while (totalTimeRemaining > 0) {
        if (timeRemainingInBar == 4) {
            nextValue = possibleValues[Math.floor(Math.random()*possibleValues.length)];
        } else if (timeRemainingInBar >= 3) {
            possibleValues = possibleValues.filter(value => value.length<=3);
            nextValue = possibleValues[Math.floor(Math.random()*possibleValues.length)];
        } else if (timeRemainingInBar >= 2) {
            possibleValues = possibleValues.filter(value => value.length<=2);
            nextValue = possibleValues[Math.floor(Math.random()*possibleValues.length)];
        } else if (timeRemainingInBar >= 1) {
            possibleValues = possibleValues.filter(value => value.length<=1);
            nextValue = possibleValues[Math.floor(Math.random()*possibleValues.length)];
        } else {
            possibleValues = possibleValues.filter(value => value.length<=0.5);
            nextValue = possibleValues[Math.floor(Math.random()*possibleValues.length)];
        }

        rhythm.push(nextValue);

        timeRemainingInBar -= nextValue.length;
        if(timeRemainingInBar == 0) {
            timeRemainingInBar = timeSignatureValue;
            possibleValues = [];
            for (i = 0; i<rhythmsIncluded.length; i++) {
                possibleValues.push(rhythmsIncluded[i]);
                if(!rhythmsIncluded[i].isRest) {
                    possibleValues.push(rhythmsIncluded[i]);
                }
            }

        }

        totalTimeRemaining -= nextValue.length;
        
    }
    return rhythm;
}

function addRhythmImageToDisplay(value) {

    let imageToAdd;
    
    switch(value) {
        case rhythmsMap['crotchet']:
            imageToAdd = images[5].cloneNode();
            break;
        case rhythmsMap['minim']:
            imageToAdd = images[7].cloneNode();
            break;
        case rhythmsMap['semibreve']:
            imageToAdd = images[10].cloneNode();
            break;
        case rhythmsMap['quaver']:
            imageToAdd = images[2].cloneNode();
            break;
        case rhythmsMap['dottedMinim']:
            imageToAdd = images[9].cloneNode();
            break;
        case rhythmsMap['crotchetRest']:
            imageToAdd = images[6].cloneNode();
            break;
        case rhythmsMap['minimRest']:
            imageToAdd = images[8].cloneNode();
            break;
        case rhythmsMap['quaverRest']:
            imageToAdd = images[4].cloneNode();
            break;
    }

    currentDisplayLine.appendChild(imageToAdd);
}

function displayRhythm() {
    rhythm = generateRhythm();
    if(bars <=2 && line2IsPresent){
        rhythmContainer.removeChild(rhythmDisplayLine2);
        line2IsPresent = false;
        rhythmContainer.style.marginTop = "10%";
    } 
    
    if(bars > 2 && !line2IsPresent){
        line2IsPresent = true;
        rhythmContainer.style.marginTop = "5%";
        rhythmDisplayLine2 = document.createElement('div');
        rhythmDisplayLine2.classList.add('rhythm-display');
        rhythmDisplayLine2.setAttribute('id', 'display-line-2');
        rhythmContainer.appendChild(rhythmDisplayLine2);
    }
    switch(timeSignatureValue){
        case 3:
            timeSignatureDisplay.setAttribute('src', 'Images/new34Timesig.png');
            break;
        case 4:
            timeSignatureDisplay.setAttribute('src', 'Images/new44timesig.png');
            break;
    }
    while(rhythmDisplayLine1.firstChild) {
        rhythmDisplayLine1.removeChild(rhythmDisplayLine1.lastChild); 
    }
    if(line2IsPresent) {
        while(rhythmDisplayLine2.firstChild) {
            rhythmDisplayLine2.removeChild(rhythmDisplayLine2.lastChild);
        }
    }
    let timeRemainingInBar = timeSignatureValue
    for(i = 0; i < rhythm.length; i++) {
        if(timeRemainingInBar >= 1 && timeRemainingInBar %1 ==0 && rhythm[i] == rhythmsMap['quaver'] && rhythm[i+1] == rhythmsMap['quaver']) {
            currentDisplayLine.appendChild(images[3].cloneNode()); //add two beamed quavers
            timeRemainingInBar -= 0.5;
            i++;
        } else {
            addRhythmImageToDisplay(rhythm[i]);
        }
        timeRemainingInBar -= rhythm[i].length;
        if(timeRemainingInBar == 0 && i != (rhythm.length-1)){
            currentDisplayLine.appendChild(images[0].cloneNode()); //add a barline
            timeRemainingInBar = timeSignatureValue;
            barsFilled++;
            if(barsFilled==2){
                currentDisplayLine = rhythmDisplayLine2;
            }
        }
    }
    currentDisplayLine.appendChild(images[1].cloneNode()); //add a double barline
    currentDisplayLine = rhythmDisplayLine1;
    barsFilled = 0;
    setTimeout(function() {
        var imagesOnScreen = document.querySelectorAll(".fade-in");
        for (var i = 0; i < imagesOnScreen.length; i++) {
          imagesOnScreen[i].style.opacity = 1;
        }
      }, 10);

}

newRhythmButton.addEventListener('click', displayRhythm);
  
  
  
  



