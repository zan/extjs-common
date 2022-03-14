Ext.define('Zan.common.Object', {
    singleton: true,

    /**
     * Returns the maximum depth of object
     */
    getMaxDepth: function(object) {
        var keys = Ext.Object.getKeys(object);

        var maxKeyDepth = 1;
        for (var i=0; i < keys.length; i++) {
            var key = keys[i];
            var keyDepth = 0;

            if (Ext.isObject(object[key]) || Ext.isArray(object[key])) {
                keyDepth = 1 + this.getMaxDepth(object[key]);
            }

            if (keyDepth > maxKeyDepth) maxKeyDepth = keyDepth;
        }

        return maxKeyDepth;
    }
});