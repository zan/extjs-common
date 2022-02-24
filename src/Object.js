Ext.define('Zan.common.Object', {
    singleton: true,

    /**
     * Returns the maximum depth of object
     */
    getMaxDepth: function(object) {
        var keys = Ext.Object.getKeys(object);

        for (var i=0; i < keys.length; i++) {
            var key = keys[i];

            if (Ext.isObject(object[key])) {
                return 1 + this.getMaxDepth(object[key]);
            }
        }

        // No objects below this one, depth is 1
        return 1;
    }
});