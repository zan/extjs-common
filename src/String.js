Ext.define('Zan.common.String', {
    singleton: true,

    /**
     * Removes prefix from str
     *
     * If str is not a string it is returned unchanged
     *
     * @param {string} str
     * @param {string} prefix
     * @return {*}
     */
    removePrefix: function(str, prefix) {
        if (!Ext.isString(str)) return str;

        if (Ext.String.startsWith(str, prefix)) {
            str = str.substr(prefix.length);
        }

        return str;
    },

    /**
     * Returns a string by automatically detecting its value and calling one of the other from* methods
     *
     * This method supports the following options (in addition to options supported by other from* methods):
     *      nullValueString - the string to return when a null or undefined value is passed
     */
    from: function(value, options) {
        options = options || {};
        options = Ext.applyIf(options, {
            nullValueString: '',
        });

        if (value === null || value === undefined) return options.nullValueString;

        if (Ext.isString(value)) {
            return value;
        }
        if (Ext.isBoolean(value)) {
            return this.fromBoolean(value, options);
        }
        if (Ext.isObject(value)) {
            return value + '';
        }
    },

    /**
     * Converts a Boolean to a String
     *
     * Supported options:
     *      trueText: 'Yes'
     *      falseText: 'No'
     *      nullText: ''
     */
    fromBoolean: function(value, options) {
        options = Ext.applyIf(options, {
            trueText: 'Yes',
            falseText: 'No',
            nullText: '',
        });

        if (value === null || value === undefined) return options.nullText;
        if (value === true) return options.trueText;
        if (value === false) return options.falseText;
    }
});