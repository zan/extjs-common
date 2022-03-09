/**
 * Wrappers and extensions of Ext's MessageBox class
 */
Ext.define('Zan.common.MessageBox', {
    singleton: true,

    requires: [
        // Even though this is required as this class it must be used as Ext.MessageBox
        'Ext.window.MessageBox',
    ],

    /**
     * Provides a version of Ext.MessageBox.confirm() with promise support
     *
     * @see Ext.MessageBox.confirm
     * @return {Promise}
     */
    confirm: function(title, message, callbackFn, callbackFnScope) {
        var deferred = new Ext.Deferred();

        callbackFn = callbackFn || Ext.emptyFn;

        // Wrap the original callback with one that resolves the promise
        var resolverCb = Ext.Function.createSequence(callbackFn, function(buttonId) {
            if ('yes' === buttonId) deferred.resolve(true);
        });

        Ext.MessageBox.confirm(title, message, resolverCb, callbackFnScope);

        return deferred.promise;
    },

    /**
     * Displays a confirmation prompt and if the user confirmed it call whenConfirmedFn
     *
     * @see Zan.common.MessageBox.confirm
     * @see Ext.MessageBox.confirm
     */
    confirmAndThen: async function(title, message, whenConfirmedFn, scope) {
        var isConfirmed = await this.confirm(title, message);
        if (!isConfirmed) return;

        // Confirmed, call the callback
        whenConfirmedFn.call(scope);
    },

}, function(me) {
    Ext.onInternalReady(function() {
        Zan.common.Msg = me;
    });
});