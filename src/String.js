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
});