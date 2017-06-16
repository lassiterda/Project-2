function renderSideBarWithLocations(locations){

		//emptying the side bar before re-populating it
		$("#side-bar").empty();

		for (i = 0; i < locations.data.length; i++){

			var $newLocation = {};

			//setting properties to the object
			$newLocation.card = {
				mainContainer: $("<div />"),
				cardHeader: {
					container: $("<div />"),
					content: $("<h6 />")
				},
				collapsableBody: $("<div />"),
				cardBlock: {
					container: $("<div />"),
					content: {
						address: $("<p />"),
						description: $("<p />")
					}
				},

			};

			$newLocation.isSelected = true;

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


			// $newLocation.box.body.addClass('location-box');
			$newLocation.card.mainContainer.attr('location-id', locations.data[i].id);


			$newLocation.card.cardHeader.content.append(locations.data[i].name);
			$newLocation.card.cardHeader.container.addClass('card-header');
			$newLocation.card.mainContainer.append($newLocation.card.cardHeader.content);


			$newLocation.card.cardBlock.content.address.append(locations.data[i].address);
			$newLocation.card.cardBlock.content.description.append(locations.data[i].description);
			$newLocation.card.cardBlock.container.append($newLocation.card.cardBlock.content.address);
			$newLocation.card.cardBlock.container.append($newLocation.card.cardBlock.content.description);
			$newLocation.card.collapsableBody.append($newLocation.card.cardBlock.container);
			$newLocation.card.mainContainer.append($newLocation.card.collapsableBody);


			//add all bootstrap classes to make accordion work
			$newLocation.card.collapsableBody.attr("id", "collapse"+locations.data[i].id);
			$newLocation.card.collapsableBody.addClass("collapse show");
			$newLocation.card.collapsableBody.attr("role", "tabpanel");
			$newLocation.card.collapsableBody.attr("aria-labelledby", "heading"+locations.data[i].id);


			// $newLocation.card.cardHeader.container.attr("role", "tab");
			$newLocation.card.cardHeader.content.attr('data-toggle', "collapse");
			$newLocation.card.cardHeader.content.attr('data-parent', "#accordion");
			$newLocation.card.cardHeader.content.attr('aria-expanded', "false");
			$newLocation.card.cardHeader.content.attr('id', "heading"+locations.data[i].id);

			$newLocation.card.cardBlock.container.addClass('card-block');
			$newLocation.card.cardHeader.content.addClass('mb-0');
			$newLocation.card.mainContainer.addClass('card');



			//push individual div to global array
			locationsGlobal.push($newLocation);

			//append the div we just constructed and popuated to the side bar
			$(".my-side-bar").append(locationsGlobal[i].card.mainContainer);
			
			

		}//end of loop
			

		console.log("Global Array: " + locationsGlobal);

	}