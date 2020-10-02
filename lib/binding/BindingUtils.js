var BindingUtils = function () {

};
/**
 *  Binds a public property, <code>prop</code> on the <code>site</code>
 *  Object, to a bindable property or property chain. 
 *  If a ChangeWatcher instance is successfully created, <code>prop</code>
 *  is initialized to the current value of <code>chain</code>.
 */
BindingUtils.bindProperty = function (site, site_chain, host, host_chain) {
    let w = ChangeWatcher.getInstance(host);
    w.watch(host, host_chain, function (e) {
        setChainValue(site, site_chain, e.newValue)
    });
};
BindingUtils.getIdentifier = function (bindingExpression) {
    let r = null;
    let tokens = tokenize(bindingExpression).all();
    let m = getMatching(tokens, "type", "IDENTIFIER", true);
    if (m.objects.length > 0) {
        r = m.objects[0].value;
    }
    return r;
};
/*
    s: String binding Expression
    site: Object Host object
    chain: String|Array property path or property chain
*/
BindingUtils.getPropertyChains = function (bindingExpression) {
    let tokens = tokenize(bindingExpression).all();
    let toBind = [];
    let kndex = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === "IDENTIFIER" || (tokens[i].type === "STRING" && tokens[i].value.trim() != "") || (tokens[i].type === "INTEGER" && tokens[i - 1] && tokens[i - 1].type === "LEFT_BRACKET")) {
            if (toBind[kndex] == undefined) {
                toBind[kndex] = [];
            }
            toBind[kndex].push(tokens[i].value);

        } else
        if (!(tokens[i].type === "DOT" || tokens[i].type === "LEFT_BRACKET" || tokens[i].type === "RIGHT_BRACKET" || (tokens[i].type === "LEFT_BRACKET" && tokens[i + 1] && tokens[i + 1].type === "LEFT_BRACKET")) && toBind[kndex] != undefined) {
            kndex++;
        }
    }
    return toBind;
};
BindingUtils.watchersCount = 0;
BindingUtils.watchers = [];
BindingUtils.bindingFunctions = [];
BindingUtils.totalBindings = 0;
//TODO: check for duplicate chains to avoid adding multiple watcher for same host and chain
//TODO: defaultContextProperty implement the possibility for this param to be a property chain
BindingUtils.getValue = function (context, bindingExpression, site, site_chain, defaultContextProperty) {
    let toBind = this.getPropertyChains(bindingExpression);
    //alert(JSON.stringify(toBind));
    let generatedBindingFn = "";
    let generatedBinding1StTimeFn = "";
    let watchers = [];
    if (toBind.length > 0) {

        if (site != null && site_chain != undefined && Array.isArray(site_chain) && site_chain.length > 0) {
            context = context || {};

            let varsIn_defaultContextProperty = "";

            for (let i = 0; i < toBind.length; i++) {
                if ((defaultContextProperty != null) && Object.prototype.hasOwnProperty.call(context, defaultContextProperty) && (Object.prototype.hasOwnProperty.call(context[defaultContextProperty], toBind[i][0]) || (toBind[i][0] in context[defaultContextProperty]))) {
                    varsIn_defaultContextProperty += "var " + (toBind[i][0]) + " = context['" + defaultContextProperty + "']['" + (toBind[i][0]) + "'];\n";
                    toBind[i].unshift(defaultContextProperty);
                } else {
                    if (Object.prototype.hasOwnProperty.call(context, toBind[i][0])) {
                        varsIn_defaultContextProperty += "var " + (toBind[i][0]) + " = context['" + (toBind[i][0]) + "'];\n";
                    } else {
                        let str = toBind[i][0] + " property not found on specified context. Please specify a valid 'defaultContextProperty' parameter.";
                        //throw str
                        console.log('%c ' + str, 'background: #222; color: #bada55');
                    }
                }
            }
            BindingUtils.bindingFunctions[this.totalBindings] = function () {
                //console.log("Binding Fn: ", varsIn_defaultContextProperty+'setChainValue(site, site_chain, ('+bindingExpression+'))');
                eval(varsIn_defaultContextProperty + 'setChainValue(site, site_chain, (' + bindingExpression + '));');
            }.bind(context);

            //TODO:Reduce watchers by grouping them based on host and toBind[i]
            for (let i = 0; i < toBind.length; i++) {
                let host = toBind[i].shift();
                if (context[host]) {
                    //watchers[i] = BindingUtils.watchers[this.watchersCount] = new ChangeWatcher();
                    watchers[i] = BindingUtils.watchers[this.watchersCount] = ChangeWatcher.getInstance(context[host]);
                    BindingUtils.watchers[this.watchersCount].watch(context[host], toBind[i], BindingUtils.bindingFunctions[this.totalBindings]);
                    //generatedBindingFn += "var w_"+this.watchersCount+" = new ChangeWatcher();"
                    //generatedBindingFn += "w_"+this.watchersCount+".watch("+host+", "+JSON.stringify(toBind[i])+", "+name+");";
                    this.watchersCount++;
                }
            }
            BindingUtils.bindingFunctions[this.totalBindings]();
            this.totalBindings++;
        }
    }
    //TODO:Return the watchers Collection, so we can unwatch :) 
    return watchers;
};