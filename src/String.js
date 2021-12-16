Ext.define('Zan.common.String', {
    singleton: true,

    /**
     * Returns true if str starts with startVal
     *
     * Returns false if str is not a string
     *
     * @param {string} str
     * @param {string} startVal
     * @return {bool}
     */
    startsWith: function(str, startVal) {
        if (!Ext.isString(str)) return false;

        return str.indexOf(startVal) === 0;
    },

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

        if (Zan.String.startsWith(str, prefix)) {
            str = str.substr(prefix.length);
        }

        return str;
    },
});