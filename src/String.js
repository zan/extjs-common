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
     *      arrayValueDelimiter - the string to use when combining an array of values into a single string
     *      stringProperty - the property to use when converting an object or model to a string
     */
    from: function(value, options) {
        options = options || {};
        options = Ext.applyIf(options, {
            nullValueString: '',
            arrayValueDelimiter: "\n",
            stringProperty: null,
        });

        if (value === null || value === undefined) return options.nullValueString;

        // Convert stores to array values before continuing
        if (value instanceof Ext.data.Store) {
            value = value.getRange();
        }

        // For arrays, build a string by calling from() on each element
        if (Ext.isArray(value)) {
            var strValueParts = [];
            for (var i=0; i < value.length; i++) {
                strValueParts.push(this.from(value[i], options));
            }

            return strValueParts.join(options.arrayValueDelimiter);
        }

        if (Ext.isString(value)) {
            return value;
        }
        if (Ext.isBoolean(value)) {
            return this.fromBoolean(value, options);
        }
        if (Ext.isDate(value)) {
            return this.fromDate(value, options);
        }
        if (value instanceof Ext.data.Model) {
            // If available, use the objectProperty option
            if (options.stringProperty) {
                return Zan.data.util.ModelUtil.getValue(value, options.stringProperty);
            }

            // Fall back to string conversion
            return value + '';
        }
        if (Ext.isObject(value)) {
            // If available, use the objectProperty option
            if (options.stringProperty) {
                return value[options.stringProperty];
            }

            // Fall back to string conversion
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
    },

    /**
     * Converts a Date to a String
     *
     * Supported options:
     *      includeDate: boolean (default true), if true include Ext.Date.defaultFormat
     *      includeTime: boolean (default false), if true, include Ext.Date.defaultTimeFormat
     *
     * @returns {String}
     */
    fromDate: function(value, options) {
        options = Ext.applyIf(options, {
            includeDate: true,
            includeTime: false,
        });

        var formatParts = [];

        if (options.includeDate) {
            formatParts.push(Ext.Date.defaultFormat);
        }

        if (options.includeTime) {
            formatParts.push(Ext.Date.defaultTimeFormat);
        }

        return Ext.Date.format(value, formatParts.join(' '));
    },

    /**
     * Newline-aware htmlEncode()
     *
     * @param {string} value
     * @returns {string}
     */
    htmlEncode: function(value) {
        if (!value) return '';

        // html encode string
        value = Ext.htmlEncode(value);

        // Convert newlines to line breaks
        value = value.replaceAll("\n", "<br>");

        return value;
    },
});