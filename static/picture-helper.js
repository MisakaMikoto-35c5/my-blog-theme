(function() {
    function _showImageMask(imgSrc) {
        var closeMask = function() {
            document.body.removeChild(maskElement);
        }

        var maskElement = document.createElement('div');
        maskElement.style = 'position: fixed; top: 0; left: 0; z-index: 999; background-color: rgba(0, 0, 0, 0.5); width: 100%; height: 100%';
        maskElement.id = "maskElement";
        maskElement.onclick = closeMask;

        var imgElement = document.createElement('img');
        imgElement.style = 'display: block; max-height: 100%; max-width: 100%;';
        imgElement.src = imgSrc;

        var linkElement = document.createElement('a');
        linkElement.style = 'display: block; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;';

        var closeButtonElement = document.createElement('div');
        closeButtonElement.style = 'display: block; position: fixed; top: 0; right: 0; z-index: 1000; cursor: pointer;';
        closeButtonElement.innerHTML = '<img src="/css/close-24px.svg">';
        closeButtonElement.onclick = closeMask;

        linkElement.appendChild(imgElement);
        maskElement.appendChild(linkElement);
        maskElement.appendChild(closeButtonElement);
        document.body.appendChild(maskElement);
    }
    var images = document.getElementsByTagName("img");
    var imgCount = images.length;
    for (var i = 0; i < imgCount; i++) {
        var img = images[i];
        img.style = 'max-height: 200px; width: 100%; object-fit: contain;';
        img.onclick = function(event) {
            if (event.target != null) {
                _showImageMask(event.target.src);
            }
        };
    }
})();