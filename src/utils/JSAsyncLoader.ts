export default class JSAsyncLoader {
    constructor(jsPath?, callback?, async?, defer?){
        if ((<any>window).attachEvent){
            (<any>window).attachEvent('onload', function () {
                JSAsyncLoader.createScriptElement(jsPath, callback, async, defer)
            });
        }else {
            (<any>window).addEventListener('load', function () {
                JSAsyncLoader.createScriptElement(jsPath, callback, async, defer)
            }, false);
        }
    }

    private static createScriptElement(url, callback, async, defer){
        if(url){
            var script: HTMLDocument | any = document.createElement("script");
            script.type = "text/javascript";
            async && (script.async = true);
            defer && (script.defer = true);

            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    var readyState = script.readyState;
                    if (readyState == "loaded" || readyState == "complete") {
                        script.onreadystatechange = null;
                        callback && callback();
                    }
                };
            } else { //Others: Firefox, Safari, Chrome, and Opera
                script.onload = function () {
                    script.onload = null;
                    callback && callback();
                };
            }
            script.src = url;
            var parent = document.getElementsByTagName("body")[0] || document.body;
            parent.appendChild(script);
        }
    }
}