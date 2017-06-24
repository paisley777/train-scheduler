
/****Use the git ignore to upload
header parameters different from query parameters***/

/**var empStartPretty = moment.unix.(empStart).format("mm/DD/YY")**/

/****VARIABLES****/

$(document).ready(function() {

  	/*Initialize Firebase*/
 	var config = {
    	apiKey: "AIzaSyA7DcnacX1cq2cHCCP8r0fLSff28T6BIyg",
    	authDomain: "train-scheduler-358a3.firebaseapp.com",
    	databaseURL: "https://train-scheduler-358a3.firebaseio.com",
    	projectId: "train-scheduler-358a3",
    	storageBucket: "",
    	messagingSenderId: "1075378227338"
  	};

  	firebase.initializeApp(config);

  	var database = firebase.database();

  	var trainName = '';
	var destination = '';
	var firstTrainTime = '';
	var frequency = '';
	var nextArrival = '';
	var minutesAway = '';


	/****EVENTS****/

	$('#js-add-train').on('click', function(event) {
		event.preventDefault();

		trainName = $('#js-train-name').val().trim();
		destination = $('#js-destination').val().trim();
		firstTrainTime = $('#js-first-train-time').val().trim();
		frequency = $('#js-frequency').val().trim();

		/* Pushes information to database */
		database.ref().push({
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency,
		});

		clearForm();
	})

		/* Reading the newly added database record into the html */

		database.ref().on('child_added', function(childSnapshot) {

			calculateArrival(childSnapshot);

			$('#train-data').append([
				'<tr>',
    				'<td>' + childSnapshot.val().trainName + '</td>',
    				'<td>' + childSnapshot.val().destination + '</td>',
    				'<td>' + childSnapshot.val().frequency + '</td>',
    				'<td>' + moment(nextArrival).format("HH:mm") + '</td>',
    				'<td>' + minutesAway + '</td>',
				'</tr>'
			]);

		}) 

	/****FUNCTIONS****/ 
	function clearForm() {
		trainName = $('#js-train-name').val('');
		destination = $('#js-destination').val('');
		firstTrainTime = $('#js-first-train-time').val('');
		frequency = $('#js-frequency').val('');
	}

	function calculateArrival(childSnapshot) {

    	var firstTrainTime = childSnapshot.val().firstTrainTime;
    	var frequency = childSnapshot.val().frequency;

		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
		console.log(firstTrainTimeConverted);
		console.log(childSnapshot.val().firstTrainTime);


    	// Current Time
    	var currentTime = moment();
    	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    	console.log(currentTime);

   		// Difference between the times
    	var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    	console.log("DIFFERENCE IN TIME: " + diffTime);

    	// Time apart (remainder)
    	var tRemainder = diffTime % frequency;
    	console.log(tRemainder);

    	// Minute Until Train
    	minutesAway = frequency - tRemainder;
    	console.log("MINUTES TILL TRAIN: " + minutesAway);

    	// Next Train
    	nextArrival = moment().add(minutesAway, "minutes");
    	console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
    		
	}

});



