/**
 * This is a TokenRenderer Element, the default item renderer for an Autocomplete
 * 
 * Kreatx 2018
 */

//component definition
var TokenRenderer = function(_props)
{
    let _self = this, _value, _label, _closeIconSide, _link, _span;
    /*

    this.beforeAttach = function () 
    {
        this.$closeIcon = this.$el.find('#'+ this.domID + '_closeIcon');
        this.$label = this.$el.find('#'+ this.domID + '_label');
    };

    registerEvents: function () {
        return [
            {
                registerTo: this.$closeIcon, events: {
                    'click': this.closeIconClickHandler.bind(this)
                }
            },
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                    'mousedown' : this.mouseDownHandler.bind(this),
                    'click': this.clickHandler.bind(this),
                    'dblclick': this.doubleClickHandler.bind(this)
                }
            }
        ]
    },
    closeIconClickHandler: function(){
        if (typeof this.closeiconclickhandler == 'function')
            this.closeiconclickhandler.apply(this, arguments);
    },
    mouseDownHandler: function () {
        if (typeof this.onmousedown == 'function')
            this.onmousedown.apply(this, arguments);
    },
    clickHandler: function () {
        if (typeof this.onclick == 'function')
            this.onclick.apply(this, arguments);
    },
    doubleClickHandler: function () {
        if (typeof this.ondblclick == 'function')
            this.ondblclick.apply(this, arguments);
    },
    afterAttach: function (e) {        
        this.trigger('creationComplete');
    }*/
    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _link = this.linkCmp;
            _span = this.labelCmp;
        }
    }
    
    this.beforeAttach = function(e) 
    {
        if (e.target.id == this.domID) 
        {
            if(_props.value)
                _value = _props.value;
            if(_props.label)
                _label = _props.label;
        }
    }
    
    let _closeIconClick = function(e)
    {
        _self.trigger("closeiconclick");
    };
    
    Object.defineProperty(this, "value", 
    {
        get: function value() 
        {
            return _value;
        },
        set: function value(v) 
        {
            if(_value != v)
            {
                _value = v;
                if (_span)
                    if (v || v === false)
                        _span.attr.value = v;
                    else
                        delete _span.attr.value;
            }
        }
    });

    Object.defineProperty(this, "label", 
    {
        get: function label() 
        {
            return _label;
        },
        set: function label(v) 
        {
            if(_label != v)
            {
                _label = v;
                if (_span)
                    _span.label = v;
            }
        }
    });
    
    //"font-size: 14px; margin:2px"
    var _defaultParams = {
        closeIconSide: "left",
        components: [],
        "type": ContainerType.NONE,
        classes: ["badge", "badge-info"],
        css: {"font-size": "14px", "margin":"2px"}
    };
    _props = extend(false, false, _defaultParams, _props);
    if (!_props.attr) { 
        _props.attr = {};
    }
    _props.attr["data-triggers"] = "closeiconclick";
    
    let _spanLit = {
        ctor: Label,
        props: {
            id: 'labelCmp',
            labelType: LabelType.span,
            attr: { "tabindex": "-1" }
        }
    };
    
    let _linkLit = {
        ctor: Link,
        props: {
            id: "linkCmp",
            classes: ["badge", "badge-info"],
            click: _closeIconClick,
            label: "x"
        }
    };
    
    if (_closeIconSide == "left")
    {
        _props.components.push(_linkLit);
        _props.components.push(_spanLit);
    } else 
    { 
        _props.components.push(_spanLit);
        _props.components.push(_linkLit);
    }
    Container.call(this, _props);
};
TokenRenderer.prototype.ctor = 'TokenRenderer';