var URL = require('url');
var phantomjs = require('phantomjs-prebuilt');
var fetch = require('node-fetch');
var BloomFilter = require('bloomfilter').BloomFilter;

var bloom = new BloomFilter(
    1000000, // 10mb, number of bits to allocate.
    16        // number of hash functions.
);


var program = phantomjs.exec('incoming.js', 'arg1', 'arg2');
//program.stdout.pipe(process.stdout);
program.stderr.pipe(process.stderr);
program.on('exit', code => {
    // do something on end
});



var string = '';
program.stdout.on('data',function(buffer){
    var string = buffer.toString();
    //console.log(string);
    var startToken = '__OUTPUT_SENTINEL_START__';
    var endToken = '__OUTPUT_SENTINEL_END__';
    if (string.indexOf(startToken) != -1 && string.indexOf(endToken) != -1) {
        var res = JSON.parse(string.substring(string.indexOf(startToken)+startToken.length,string.indexOf(endToken)));
        res.map(link => {
            var parts = URL.parse(link);
            var domain = parts.protocol + '//' + parts.host;
            fetch(domain,{timeout:5000}).then(res => {
                if (!bloom.test(res.url)) {
                    console.log(res.url + ' # ' + domain + ' ## ' + (new Date().toISOString()));
                    bloom.add(res.url);
                }
            });
        });
    }
});

program.stdout.on('end',function(){
});
