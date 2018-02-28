// any link that is not part of the current domain is modified
// copy from https://stackoverflow.com/a/27091870

(function() {
    var links = document.links;
    for (var i = 0, linksLength = links.length; i < linksLength; i++) {
        // can also be
        //  links[i].hostname != 'subdomain.example.com'
        if (links[i].hostname != window.location.hostname) {
            links[i].target = '_blank';
        }
    }
})();
