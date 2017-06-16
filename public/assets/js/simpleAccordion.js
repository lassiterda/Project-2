function renderSideBarWithLocations(locations){

		//emptying the side bar before re-populating it
		$("#side-bar").empty();

		for (i = 0; i < locations.data.length; i++){

			var $newLocation = {};

			$newLocation.isSelected = true;

			//setting properties to the object
			$newLocation = {
				accordion: {
					header: $('<button />'),
					body: $('<div />')
				}
			};

			//append all of this data into the newLocation
			$newLocation.about = {
				lat: locations.data[i].lat,
				lng: locations.data[i].lng,
				id: locations.data[i].id,
				Google_place_id: locations.data[i].Google_place_id,
				name: locations.data[i].name,
				address: {
					street: locations.data[i].address,
					city: locations.data[i].city,
					state: locations.data[i].state,
					zip: locations.data[i].zip
				},
				description: locations.data[i].description,
			};

			//link to css properties to render elements into accordion
			$newLocation.accordion.header.addClass('accordion');
			$newLocation.accordion.body.addClass('panel');

			$newLocation.accordion.header.append(locations.data[i].name);
			$newLocation.accordion.body.append(locations.data[i].description);


			//push individual div to global array
			locationsGlobal.push($newLocation);

			//append the div we just constructed and popuated to the side bar
			$(".my-side-bar").append($newLocation.accordion);
			
			

		}//end of loop
			

		console.log("Global Array: " + locationsGlobal);

	}