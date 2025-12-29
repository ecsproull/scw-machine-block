// Frontend slideshow functionality
document.addEventListener('DOMContentLoaded', function() {
	const slideshows = document.querySelectorAll('.scw-machine-block__slideshow');

	slideshows.forEach(slideshow => {
		const images = slideshow.querySelectorAll('.scw-machine-block__image');
		
		if (images.length <= 1) {
			return; // No need for slideshow with single image
		}

		let currentIndex = 0;

		function showNextImage() {
			// Remove active class from current image
			images[currentIndex].classList.remove('active');

			// Move to next image
			currentIndex = (currentIndex + 1) % images.length;

			// Add active class to next image
			images[currentIndex].classList.add('active');
		}

		// Change image every 5 seconds
		setInterval(showNextImage, 5000);
	});
});
