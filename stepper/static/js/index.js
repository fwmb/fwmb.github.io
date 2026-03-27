window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

    // Video thumbnail navigation
    setupVideoNavigation();
    
    // Lock video aspect ratio to prevent layout jumps
    lockVideoAspectRatio();
    
    // Initialize quantitative results tabs
    setupQuantitativeTabs();
})

function setupVideoNavigation() {
    // Baseline videos
    var baselineThumbnails = $('.thumbnail-strip[data-section="baseline"] .thumbnail-wrapper');
    var baselineMainVideo = $('#main-video');

    baselineThumbnails.each(function() {
        $(this).on('click', function() {
            var videoSrc = $(this).data('video');
            var thumbnailSrc = $(this).data('thumb');
            
            baselineMainVideo.find('source').attr('src', videoSrc);
            baselineMainVideo[0].load();
            baselineMainVideo[0].play();
            
            baselineThumbnails.removeClass('active');
            $(this).addClass('active');
            
            $(this)[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // Flythrough videos
    var flythroughThumbnails = $('.thumbnail-strip[data-section="flythrough"] .thumbnail-wrapper');
    var flythroughMainVideo = $('#main-video-flythrough');

    flythroughThumbnails.each(function() {
        $(this).on('click', function() {
            var videoSrc = $(this).data('video');
            var thumbnailSrc = $(this).data('thumb');
            
            flythroughMainVideo.find('source').attr('src', videoSrc);
            flythroughMainVideo[0].load();
            flythroughMainVideo[0].play();
            
            flythroughThumbnails.removeClass('active');
            $(this).addClass('active');
            
            $(this)[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // Set initial active state
    baselineThumbnails.first().addClass('active');
    flythroughThumbnails.first().addClass('active');
}

function lockVideoAspectRatio() {
    var videos = [
        { selector: '#main-video', sectionId: 'baseline-section' },
        { selector: '#main-video-flythrough', sectionId: 'flythrough-section' }
    ];
    
    videos.forEach(function(videoInfo) {
        var video = $(videoInfo.selector)[0];
        var section = $('#' + videoInfo.sectionId)[0];
        
        if (!video || !section) return;
        
        var container = section.querySelector('.main-video-container');
        if (!container) return;
        
        var updateHeight = function() {
            if (!video.videoWidth) return;
            
            var aspectRatio = video.videoWidth / video.videoHeight;
            var maxWidth = container.clientWidth;
            var maxHeight = window.innerHeight * 0.8;
            
            var height = maxWidth / aspectRatio;
            if (height > maxHeight) {
                height = maxHeight;
            }
            
            container.style.height = height + 'px';
            container.style.minHeight = height + 'px';
        };
        
        video.addEventListener('loadedmetadata', updateHeight);
        window.addEventListener('resize', updateHeight);
    });
}

function setupQuantitativeTabs() {
    var tabButtons = document.querySelectorAll('.tabs li[data-dataset]');
    var tableContainers = document.querySelectorAll('.quantitative-table-container');
    
    tabButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            var targetDataset = this.getAttribute('data-dataset');
            
            tabButtons.forEach(function(btn) {
                btn.classList.remove('is-active');
            });
            
            tableContainers.forEach(function(container) {
                container.style.display = 'none';
            });
            
            this.classList.add('is-active');
            document.getElementById('table-' + targetDataset).style.display = 'block';
        });
    });
}
