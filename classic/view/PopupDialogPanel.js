/**
 * todo: clicking 'X' in upper right should also call the cancelHandler (need to add a flag to track whether "ok" was clicked)
 *
 * todo: make this more declarative?
 *
 * todo: check that popups containing a grid have a width specified. If this is missing, you get "layout run failed"
 */
Ext.define('Zan.common.view.PopupDialogPanel', {
    extend: 'Ext.panel.Panel',

    config: {
        /**
         * @cfg {function} Function to call when OK is pressed and the popup is valid
         *
         * Return false to leave the popup open
         *
         * The popup is considered valid if isValid() returns true
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         * todo: document arguments correctly
         * Arguments:
         *  {Zan.common.view.PopupDialogPanel} panel
         */
        handler: Ext.emptyFn,

        /**
         * @cfg {function} Function to call when OK is pressed
         *
         * Return false to leave the popup open
         * todo Return an Ext.deferred to set the form's state to "loading" until it resolves
         *
         */
        cancelHandler: Ext.emptyFn,

        /**
         * @cfg {boolean} If true, include a "Cancel" button that closes the popup
         */
        showCancelButton: true,

        /**
         * @cfg {*} scope to use when calling functions
         */
        scope: null,
    },

    // Allow tracking references
    referenceHolder: true,

    // Set defaults for parent class
    floating: true,
    closable: true,
    resizable: true,
    draggable: true,
    modal: true,
    autoShow: true,

    minHeight: 200,
    minWidth: 200,

    initComponent: function () {
        this.callParent(arguments);

        // todo: remove this and use 'bbar'?
        // https://docs.sencha.com/extjs/7.3.1/classic/Ext.grid.Panel.html#cfg-bbar
        this.addDocked(this._buildDockedItems());
    },

    /**
     * Template method to detect whether the popup is in a valid state
     *
     * When "OK" is clicked this method is called. The popup's handler is only called if this method returns true.
     *
     * @template
     */
    isValid: function(popup) {
        return true;
    },

    _buildDockedItems: function() {
        var docked = [];

        docked.push({
            xtype: 'panel',
            dock: 'bottom',
            bodyPadding: 8,
            layout: {
                type: 'hbox',
                pack: 'center',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'OK',
                    scale: 'medium',
                    handler: function() {
                        if (!this.isValid(this)) return;

                        var r = this.getHandler().call(this.getScope() || this, this);
                        if (r === false) return;

                        // todo: deferred support
                        this.close();
                    },
                    scope: this
                },
                {
                    xtype: 'button',
                    text: 'Cancel',
                    scale: 'medium',
                    margin: '0 0 0 10',
                    hidden: !this.getShowCancelButton(),
                    handler: function() {
                        var r = this.getCancelHandler().call(this.getScope() || this, this);

                        if (r === false) return;

                        this.close();
                    },
                    scope: this
                }
            ]
        });

        return docked;
    }
});