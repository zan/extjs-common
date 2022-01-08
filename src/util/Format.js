Ext.define('Zan.common.util.Format', {
    singleton: true,

    /**
     * Converts a snake case string to a normal string
     *
     * For example:
     *
     *      REQUESTED -> Requested
     *      IN_PROCESS -> In Process
     *      requester_id -> Requester Id
     *
     * @param {String} text
     * @returns {String|string}
     */
    snakeCaseToTitleCase: function(text) {
        console.log("snake to titling %o", text);
        var formattedDisplayString = '';

        if (Ext.isEmpty(text)) return '';

        // Split by underscores and uppercase the first letter of each word
        var parts = text.split('_');
        Ext.Array.forEach(parts, function(part) {
            formattedDisplayString += Ext.String.capitalize(part.toLowerCase()) + " ";
        });

        return Ext.String.trim(formattedDisplayString);
    },

}, function(me) {
    // Add methods to Ext.util.Format so that these can be used in binds, XTemplates, etc.
    Ext.util.Format.zanSnakeCaseToTitleCase = me.snakeCaseToTitleCase;
});