console.log('STARTING phantomtest.js');
var url = 'https://incoming.shopify.com/';
var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36';
page.viewportSize = { width: 1024, height: 768 };

var startToken = '__OUTPUT_SENTINEL_START__';
var endToken = '__OUTPUT_SENTINEL_END__';

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.open(url, function(status) {
    if(status === "success") {
        console.log('Loaded page successfully.');
        setTimeout(function() {
            
            console.log('Loading jQuery...');
            page.includeJs("//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", function() {                

                setInterval(function () {
                    var links = page.evaluate(function() {
                        var urls = [];
                        $('#products a').each(function(index,a) {
                            urls.push($(a).attr('href'));
                        });
                        return urls;
                    });
                    console.log(startToken+JSON.stringify(links)+endToken);
                },5000);
            });
        },200);
    } else {
        phantom.exit();
    }
});
