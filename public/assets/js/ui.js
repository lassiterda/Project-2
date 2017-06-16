$(document).ready(function() {

	//===== DEFINE
	var jumbo;

	// set up the jumbotron class toggle effect
	function initJumbotronEffect() {
		var t = null;
		jumbo = document.querySelector('.jumbotron');
		jumbo.addEventListener('touchstart', function(evt) {
			jumboHovered(true);
		});
		jumbo,addEventListener('touchend', function(evt) {
			jumboHovered(false);
		});
		jumbo.addEventListener('mouseover', function(evt) {
			jumboHovered(true);
		});
		jumbo,addEventListener('mouseout', function(evt) {
			jumboHovered(false);
		});
	}

	function jumboHovered(toggleOn) {
		if (!jumbo) return;
		if (toggleOn) {
			jumbo.classList.add('hovered');
			return;
		}
		jumbo.classList.remove('hovered');
	}

	// call setup/init functions
	initJumbotronEffect();

});
