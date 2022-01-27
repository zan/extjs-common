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
            iconCls: 'x-fa fa-file-upload',
        },
        {
            xtype: 'button',
            text: 'Submit Form',
            handler: function(button) {
                var form = button.up('form').getForm();
                if (!form.isValid()) return;

                form.submit({
                    url: button.up('form').getUploadUrl(),
                    waitMsg: 'Uploading...',
                    success: function(form, options) {
                        // todo: notify somehow so components can update
                    }
                });
            }
        }
    ],
});