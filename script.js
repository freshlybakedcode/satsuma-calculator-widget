//This object to be created server-side somehow:

//From columns A/B/C etc
var data =  [
{
	"Region": "Unit",
	"Average rental April 16": "\u00a3",
	"Average rental March 15": "\u00a3",
	"Monthly variance": "%",
	"Average rental April 15": "\u00a3",
	"Annual variance": "\u00a3",
	"Average": "\u00a3"
},
{
	"Region": "Scotland",
	"Average rental April 16": "704",
	"Average rental March 15": "677",
	"Monthly variance": "104",
	"Average rental April 15": "632",
	"Annual variance": "111",
	"Average": "-82"
},
{
	"Region": "North East",
	"Average rental April 16": "532",
	"Average rental March 15": "531",
	"Monthly variance": "100",
	"Average rental April 15": "524",
	"Annual variance": "102",
	"Average": "-254"
},
{
	"Region": "Yorks and Humber",
	"Average rental April 16": "627",
	"Average rental March 15": "627",
	"Monthly variance": "100",
	"Average rental April 15": "598",
	"Annual variance": "105",
	"Average": "-159"
},
{
	"Region": "North West",
	"Average rental April 16": "659",
	"Average rental March 15": "648",
	"Monthly variance": "102",
	"Average rental April 15": "659",
	"Annual variance": "100",
	"Average": "-127"
},
{
	"Region": "East Midland",
	"Average rental April 16": "646",
	"Average rental March 15": "646",
	"Monthly variance": "100",
	"Average rental April 15": "599",
	"Annual variance": "108",
	"Average": "-140"
},
{
	"Region": "West Midlands",
	"Average rental April 16": "659",
	"Average rental March 15": "656",
	"Monthly variance": "100",
	"Average rental April 15": "644",
	"Annual variance": "102",
	"Average": "-127"
},
{
	"Region": "East Anglia",
	"Average rental April 16": "809",
	"Average rental March 15": "803",
	"Monthly variance": "101",
	"Average rental April 15": "776",
	"Annual variance": "104",
	"Average": "23"
},
{
	"Region": "Greater London",
	"Average rental April 16": "1543",
	"Average rental March 15": "1536",
	"Monthly variance": "100",
	"Average rental April 15": "1433",
	"Annual variance": "108",
	"Average": "757"
},
{
	"Region": "South East",
	"Average rental April 16": "963",
	"Average rental March 15": "950",
	"Monthly variance": "101",
	"Average rental April 15": "916",
	"Annual variance": "105",
	"Average": "177"
},
{
	"Region": "South West",
	"Average rental April 16": "891",
	"Average rental March 15": "880",
	"Monthly variance": "101",
	"Average rental April 15": "863",
	"Annual variance": "103",
	"Average": "105"
},
{
	"Region": "Northern Ireland",
	"Average rental April 16": "608",
	"Average rental March 15": "608",
	"Monthly variance": "100",
	"Average rental April 15": "590",
	"Annual variance": "103",
	"Average": "-178"
}
]

//From the AA/AB/etc columns (right hand side!)
var averages =  { "Average rental April 16"	: 786,
"Average rental March 15" : 778,
"Monthly variance"     	: 101,
"Average rental April 15"	: 749,
"Annual variance" 		: 105
};


//Take the averages JSON and put the data into arrays for easier manipulation
var averagesKeysArray = [];
var averagesValuesArray = [];
for(var i in averages){
	averagesKeysArray.push(i);
	averagesValuesArray.push(averages[i]);
}
console.log("Keys from UK averages sheet (averagesKeysArray): " + averagesKeysArray);
console.log("Values from UK averages sheet (averageValuesArray): " + averagesValuesArray);

//Before anything else happens, we need to see if there's an average column entered: this will be treated differently.
//If there is, then we grab the data, store it in an array and remove it from the dataset until we need it.

var averageColumnValues = [];
var averageRowInAverageValues;
var numberOfDataItems = Object.keys(data);

if (Object.keys(data[0]).indexOf("Average") !== -1 ) {		//If there is no "Average" column defined then this won't run and we won't worry about it
	console.log("An average column is detected...");
for (i=0; i<numberOfDataItems.length; i++) {
    	averageColumnValues.push(data[i].Average);    		//Get the value in the average column and push it into our special array
	    delete data[i].Average;            					//Then remove the average from the data array
	}
 	averageRowInAverageValues = averages.Average;			//Get the value in the average column from the UK Averages sheet

 	console.log("Here are all the average values for the main data sheet (averageColumnValues): " + averageColumnValues);
 	console.log("The overall UK average from the averages data sheet (averageRowInAverageValues): " + averageRowInAverageValues);      
 };

//To calculate the amount the average bar (+/-) will have to fill up, we need to know the max/min values for the average:
averageColumnValues.shift();    //First value will === "£" (or another unit) which is no good for Math
maxAverageColumnValue = Math.max.apply(null, averageColumnValues);
minAverageColumnValue = Math.min.apply(null, averageColumnValues);
console.log("The maxAverageColumnValue = " + maxAverageColumnValue + " and the minAverageColumnValue = " + minAverageColumnValue);

//Set up the rest of the variables
var numberOfColumns = Object.keys(data[0]).length;	//Will be one less than the spreadsheet as we've taken the average column away previously
var numberOfRows = numberOfDataItems.length;
var numberOfAverages = averagesKeysArray.length;

var calculatedAverages = [];    //Array to hold the programmatically defined averages
var calculatedMaximums = [];    //Array to hold the programmatically defined max values (to calculate bar widths)
var needRightHandColumn = true; //TODO: Determine if we need a right hand column based on data (removed from spec)
var unitArray = [];				//Array to hold the units of measurement (£/%/etc)

var calculatorSelectField = document.getElementById("calculator-select-field");
var calculatorOutputArea = document.getElementById("calculator-output-area");

console.log("This particular dataset gives us " + numberOfColumns + " columns and " + numberOfRows + " rows");

function populateDropdown() {
  //Add a "Please select" item to the dropdown
  var el = document.createElement("option");
  el.textContent = "Please select";
  el.value = 0;
  calculatorSelectField.appendChild(el);
  //Get the first value of each array in the object and add to the dropdown
  for (i = 1; i < numberOfRows; i++) {
  	var el = document.createElement("option");
  	el.textContent = Object(data[i])[Object.keys(Object(data[0]))[0]];
  	el.value = i;
  	calculatorSelectField.appendChild(el);
  }
}

// Pull out the units from the data (eg: £/%/etc)
function getUnitArray() {	
	for (i=1; i<numberOfColumns; i++) {
		unitArray.push(Object(data[0])[Object.keys(Object(data[0]))[i]]);
	}
	console.log("The units of measurement are: " + unitArray);
}

// We need to get the maximum values for each column in order to work out how much to fill the UK average bars up
function setUpData() {
	for (i=1; i<numberOfColumns; i++) {
		var temp = [];
		for (j=1; j<numberOfRows; j++) {
			temp.push((Object(data[j])[Object.keys(Object(data[0]))[i]]));
		}
		calculatedMaximums.push(Math.max.apply(null, temp)); //Push the highest value into the array
	}
	console.log("The maximum values for each column: " + calculatedMaximums);
}

function calculatorSelectFieldChange() {
	var screenOutput = "";
	var averageBarOutput = "";
	var currentlySelected = calculatorSelectField.value;
	console.log("You chose: " + (Object(data[currentlySelected])[Object.keys(Object(data[0]))[0]]) + " - that's option number " + currentlySelected);
	//Delete the contents of the output area (remove all existing bars etc)
	while (calculatorOutputArea.hasChildNodes()) {
		calculatorOutputArea.removeChild(calculatorOutputArea.firstChild);
	}
	
	if (currentlySelected != 0) {		//Just in case the user selects "Please select" all that will happen is the output will clear and nothing further
		var displayedFigure;			//The number shown on the right of each line in the bar chart with the % or £ or whatever; for the left hand side chart
		var displayedFigureAverages;	//The number shown on the right of each line in the bar chart with the % or £ or whatever; for the right hand side chart
		if (needRightHandColumn) {
		//Create the relevant column on the left
		screenOutput   += '<div class="col-sm-6">';
		for (i=1; i<numberOfColumns; i++) {
		  	if (unitArray[i-1] === "%") {		// If there's a % sign then it needs to go at the end of the number
				displayedFigure = Object(data[currentlySelected])[Object.keys(Object(data[0]))[i]] + unitArray[i-1]; 
		  	}
			else {
				displayedFigure = unitArray[i-1] + Object(data[currentlySelected])[Object.keys(Object(data[0]))[i]];
			};

		screenOutput 	+=   '<span class="label">'
						+     [Object.keys(Object(data[currentlySelected]))[i]]
		  				+   '</span>'
						+   '<span class="bar-outer bar">'
						+     '<span class="bar-inner bar bar-red" style="width: ' + Object(data[currentlySelected])[Object.keys(Object(data[0]))[i]]*100/calculatedMaximums[i-1] + '%;"></span>'
		  				+   '</span>'
		  				+   '<span class="text-bar text-red">' + displayedFigure + '</span>';
		}
		screenOutput	+= '</div>';
	    
	    //Create the averages column on the right
	    screenOutput	+= '<div class="col-sm-6">';
	    for (i=0; i<numberOfAverages; i++) {
			if (unitArray[i] === "%") {		// If there's a % sign then it needs to go at the end of the number
		 		displayedFigureAverages = averagesValuesArray[i] + unitArray[i]; 
			}
			else {
				displayedFigureAverages = unitArray[i] + averagesValuesArray[i];
			};    	
		screenOutput	+=   '<span class="label">'
						+    averagesKeysArray[i]
						+   '</span>'
						+   '<span class="bar-outer bar">'
						+     '<span class="bar-inner bar bar-orange" style="width: ' + averagesValuesArray[i]*100/calculatedMaximums[i] + '%;"></span>'
						+   '</span>'
						+   '<span class="text-bar text-orange">' + displayedFigureAverages + '</span>';
		}
		screenOutput	+= '</div>';
		}
		else {    
		    //If NO right hand column required (Removed from spec!)
		    screenOutput += '</div>';
		}

	  //Now make the special average bar to show variance
	  if (averageColumnValues.length != 0) {                  //Only if there is an average column on the spreadsheet
	    //This is the current difference: console.log(averageColumnValues[(calculatorSelectField.value)-1]);
	    var negativeBarPercentage;
	    var positiveBarPercentage;
	    var currentAverageColumnValue = averageColumnValues[(calculatorSelectField.value)-1];
	    if (currentAverageColumnValue < 0) {
	    	negativeBarPercentage = (currentAverageColumnValue/minAverageColumnValue) * 100;
	    };
	    if (currentAverageColumnValue > 0) {
	    	positiveBarPercentage = (currentAverageColumnValue/maxAverageColumnValue) * 100;
	    };

	    averageBarOutput  		+=  '<div class="col-sm-12 average">'
							    +    '<span class="label">'
							    +      Object(data[currentlySelected])[Object.keys(Object(data[0]))[0]] + ' variance from UK average:'
							    +    '</span>'
							    +    '<span class="label-zero">'
							    +      0
							    +    '</span>'
							    +    '<div class="average-container">'
							    +      '<div class="col-sm-6">';
	    if (currentAverageColumnValue < 0) {
	    	averageBarOutput  	+=      '<span class="average-negative-number">- &pound;'
		                      	+         Math.abs(currentAverageColumnValue)     //We need this to be shown as a positive number as the negative symbol is automatically output before thr £ symbol
		                      	+       '</span>'
	  	};
	  	averageBarOutput  		+=      '<span class="bar-outer average-bar average-bar-left bar">'
			                  	+         '<span class="minus-symbol">-</span>'
			                  	+         '<span class="bar-inner bar bar-grey" style="width: ' + negativeBarPercentage + '%;"></span>'
			                  	+       '</span>'
			                  	+      '</div>'
			                  	+      '<div class="col-sm-6">'
			                  	+        '<span class="bar-outer average-bar average-bar-right bar">'
			                  	+         '<span class="plus-symbol">+</span>'
			                  	+         '<span class="bar-inner bar bar-grey" style="width: ' + positiveBarPercentage + '%;"></span>'
			                  	+        '</span>'
	  	if (currentAverageColumnValue > 0) {
	  		averageBarOutput  	+=      '<span class="average-positive-number">+ &pound;'
	              				+         currentAverageColumnValue
	              				+       '</span>'
	  	};
	  	averageBarOutput  		+=       '</div>'
	                  			+     '</div>'
	                  			+   '</div>'
	  	}					
		calculatorOutputArea.innerHTML = screenOutput + averageBarOutput;
	}
	
}

populateDropdown();
getUnitArray();
setUpData();