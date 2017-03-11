$(document).ready(function () {


    var md = new MobileDetect(window.navigator.userAgent);

    // if (checkBadInternetExplorer()) $('html *').css({'font-family' : "NotoSansCJK"});
    if (!md.mobile())
    {
        $('html *').css({'font-family' : "NotoSansCJK"});
    }
});