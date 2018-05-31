/**
 * This is a ComboBox/Dropdown Element
 * 
 * Kreatx 2018
 */

//component definition
var ComboBox = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
        }
    },

    getData: function (provider) {
        if (typeof provider == "string") {
            //ajax call
            return $.get(provider);
        } else {
            //json 
            return provider;
        }  
    },

    setData: function (data, element) {
        $(element).children().remove();
        $(element).closest('.multiselect-container').children().remove();
        $(element).append(
            $("<option></option>")
                .val("0")
                .text("Zgjidh")
        );
        $(element).append(
            $("<option></option>").attr("data-role", "divider")
        );

        for (var i = 0; i < data.length; i++)
            $(element).append(
                $("<option></option>").val(data[i][this.valueField]).text(data[i][this.textField]).attr("title", data[i][this.textField])
            );
    },

    beforeAttach: function () {
        this.$input = this.$el.find('#' + this.domID)
        this.$popup = this.$el.find('#' + this.domID + ' _popup');
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this),
                }
            },
            {
                registerTo: this.$input, events: {
                    'change': this.handleChange.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        var _self = this;
        
        if (e.target.id == this.domID + '-wrapper' && !this.attached) {
            var element = "#" + this.domID;
            KxRequest.promise(this.getData(this.dataProvider)).done(function (result) {
                if (typeof result == "string")
                    result = JSON.parse(result);
                
                _self.setData(result, element);

                $(element).multiselect({
                    enableFiltering: true,
                    maxHeight: 250,
                    minWidth: 350,
                    templates: {
                        divider: "<div class=\"divider\" data-role=\"divider\"></div>"
                    }
                });
                if (_self.value && _self.value.length > 0) {
                    $(element).multiselect('select', _self.value);
                }
            });
        }
        
        this.attached = true;
        this.trigger('creationComplete');
    },

    handleChange: function (e) {
        e.stopPropagation();
        
        var thisVal = this.$input.val();
        this.value = thisVal;

        if (thisVal[0] == '#' + this.domID + '_new') {
            this.$popup.fadeIn();
            this.$input.multiselect('deselect', '#' + this.domID + ' _new');
        }

        this.validate();
    },

    validate: function () {
        if (this.required) {
            if (this.value == "0" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];

                this.$el.find('.multiselect').addClass('invalid');

                return false;
            } else {
                this.errorList = [];
                this.$el.find('.multiselect').removeClass('invalid');
                return true;
            }
        } else
            return true;
    },

    setValue: function (value) {
        if (this.value != value) {
            this.value = value;
            if (value == "")
                this.$input.multiselect('deselcetAll'); 
            else this.$input.multiselect('select', value);
            this.trigger('change');
        }
        
        return this;
    },

    pushItem: function (item) {
        this.$input.append("<option value='" + item.id + "'>" + item.value + "</option>");
        this.$input.multiselect('rebuild');
        return this;
    },

    enable: function () {
        this.$input.multiselect('enable');
        this.enabled = true;
        return this;
    },

    disable: function () {
        this.$input.multiselect('disable');
        this.enabled = false;
        return this;
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='col-sm-" + this.colspan + " form-group rowspan" + this.rowspan + " resizable'>" +
                    "<div id='" + this.domID + "-block'>" +
                    "<label rv-style='versionStyle' rv-for='fieldName'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                    "<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
                    "<select class='form-control' name='" + this.domID + "[]' control-blocked='controlBlocked' style='min-width: 250px;' id='" + this.domID + "'></select>" +
                "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
ComboBox.type = 'combobox';

//register dom element for this component
KxGenerator.registerDOMElement(ComboBox, 'kx-combobox');