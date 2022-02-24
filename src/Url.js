Ext.define('Zan.common.Url', {
    singleton: true,

    /**
     * Sets varName to varValue in baseUrl
     *
     * If baseUrl does not include a ? one will be added.
     *
     * URL variables are escaped by default. To prevent this, set escapeVal to false
     *
     * @param {string} baseUrl
     * @param {string} varName
     * @param {string|Date} varValue
     * @param {boolean} escapeVal
     * @returns {string}
     */
    setUrlVar: function(baseUrl, varName, varValue, escapeVal) {
        // Handling for special values
        if (Ext.isDate(varValue)) {
            varValue = Ext.Date.format(varValue, 'c');
        }

        if (Ext.isEmpty(escapeVal)) escapeVal = true;

        if (escapeVal) varValue = encodeURIComponent(varValue);

        var qpos = baseUrl.indexOf("?");
        // No existing query string, append our varname and value
        if (qpos == -1) {
            return baseUrl + "?" + varName + "=" + varValue;
        }

        var queryString = baseUrl.substr(qpos + 1);
        var baseURL = baseUrl.substr(0, qpos);

        var pairs = queryString.split("&");
        var replaced = false;       // we had to replace the value
        for (var i=0; i < pairs.length; i++) {
            var varParts = pairs[i].split("=");
            if (varParts[0] === varName) {
                varParts[1] = varValue;
                replaced = true;
            }
            pairs[i] = varParts.join("=");
        }

        if (!replaced) {
            pairs[pairs.length] = varName + "=" + varValue;
        }

        var newQueryString = pairs.join("&");

        return baseURL + "?" + newQueryString;
    },

    /**
     * Gets variable value from url
     *
     * @param {string} varName
     * @param {string} url
     * @returns {string}
     */
    getUrlVar: function(varName, url) {
        if (!url) {
            url = document.URL;
        }

        var getParams = url.split("?");
        if (getParams.length > 1) {
            var params = Ext.Object.fromQueryString(getParams[1]);
            if (params[varName]) {
                return params[varName];
            }
        }

        return null;
    },

    /**
     * Sets varName in baseUrl to varValue if varValue is truthy
     *
     * @param baseUrl
     * @param varName
     * @param varValue
     * @param escapeVal
     * @returns string
     */
    setUrlVarIf: function(baseUrl, varName, varValue, escapeVal) {
        if (!varValue) return baseUrl;

        return Zan.Url.setUrlVar(baseUrl, varName, varValue, escapeVal);
    },

    /**
     * Returns the decoded URL parameter $value
     *
     * For example: "some%20value" is returned as "some value"
     *
     * @param value
     * @returns {string}
     */
    urlDecode: function(value) {
        // Ext has an implementation of this, but it's designed to take a full query
        // string and convert it to an object, so it always returns an object
        var extDecoded = Ext.Object.fromQueryString(value, true);

        // At this point, extDecoded will be an object with a key of the decoded value
        // The first key of the object stores the value we want
        return Ext.Object.getKeys(extDecoded)[0];
    },

    /**
     * Updates the browsers URL without triggering any routing events
     *
     * @param {string} newUrl
     */
    setBrowserUrl: function(newUrl) {
        Ext.route.Router.suspend(false);

        location.hash = newUrl;

        // Work around an issue where immediately resuming triggers a navigation event
        setTimeout(function() {
            Ext.route.Router.resume();
        }, 50);
    }
});