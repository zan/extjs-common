/**
 * 
 */
Ext.define('Zan.common.form.field.Text', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.zan-textfield',

    config: {
        /**
         * @cfg {boolean} If true, focus this component immediately after it's rendered
         */
        autoFocus: false,
    },

    afterRender: function() {
        this.callParent(arguments);

        if (this.getAutoFocus()) {
            this.focus();
        }
    },
});