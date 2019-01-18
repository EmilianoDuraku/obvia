/**
 * This is a Loader Element
 * 
 * Kreatx 2018
 */

//component definition
var Loader = function(_props)
{ 
    this.template = function () 
    {
        return  "<div id='" + this.domID + "-wrapper' style='display: none;'>" +
                    "<style>" +
                        ".se-pre-con {" +
                            "position: fixed;" +
                            "left: 0px;" +
                            "top: 0px;" +
                            "width: 100%;" +
                            "height: 100%;" +
                            "z-index: 999999;" +
                            "opacity: 0.9;" +
                            "background: url('lib/dependencies/images/loader.gif')center no-repeat #fff;" +
                        "}" +
                    "</style>"+
                    "<div class='se-pre-con'></div>" +                    
                "</div>";
    };
    var base = Component.call(this, _props);
    return this;
};

//component prototype
Loader.type = 'loader';