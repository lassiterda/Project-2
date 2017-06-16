$(document).on('click', '.select-add', function() {


	var panel = this.parentNode.parentNode.nextElementSibling;
	this.parentNode.classList.toggle("active");

		if (panel.style.maxHeight){
			panel.style.maxHeight = null;
			this.setAttribute("src", "/assets/icons/core/plus-circle.svg")
		} else {
			panel.style.maxHeight = panel.scrollHeight + "px";
			this.setAttribute("src", "/assets/icons/core/minus-circle.svg")
		}
})//end of document.ready

$(document).on("click", " .accordion-expand", function(){
	this.parentNode.classList.toggle("location-selected")
	this.parentNode.setAttribute("selected", "true")
})
