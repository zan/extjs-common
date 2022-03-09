/**
 * todo: lots of stuff, this is a prototype
 */
Ext.define('Zan.common.view.FileUploadButton', {
    extend: 'Ext.form.Panel',

    layout: 'hbox',

    config: {
        uploadUrl: null,
    },

    items: [
        {
            xtype: 'filefield',
            // This must be in the format form[SF_NAME][file]
            // where SF_NAME is the name of the form field as defined in Symfony
            name: 'form[uploadedFile][file]',
            buttonText: 'Upload File(s)',
            buttonOnly: true,
            listeners: {
                change: function(fileField, newValue) {
                    fileField.up('panel')._commitFile();
                }
            }
        },
    ],

    _commitFile: function() {
        console.log("committing file!");
        if (!this.isValid()) return;

        this.getForm().submit({
            url: this.getUploadUrl(),
            waitMsg: 'Uploading...',
            success: function(form, options) {
                console.log("upload done in button handler");
                this.fireEvent('uploadComplete', this);
            },
            scope: this,
        });
    },
});