/**
 * Customized file upload UI element that supports more advanced features
 */
Ext.define('Zan.common.view.FileUploadButton', {
    extend: 'Ext.form.Panel',

    layout: 'hbox',

    config: {
        /**
         * @cfg string This URL will receive the file upload
         */
        uploadUrl: null,

        /**
         * @cfg bool If true, the file is sent to the server as soon as the user selects it
         *
         * Otherwise, you can listen for the 'fileSelected' event to know when the user has
         * chosen a file.
         */
        submitOnChange: true,
    },

    /**
     * @event uploadComplete
     * Fires after the file has been successfully uploaded to the server
     * @param {Zan.common.view.FileUploadButton} uploadButton
     * @param {object} result The form action's result: {@link Ext.form.action.Action.result}
     * @param {Ext.form.action.Action} action The {@link Ext.form.action.Action} that completed
     */

    /**
     * @event fileSelected
     * Fires when a file is chosen (but before it's uploaded).
     * @param {Zan.common.view.FileUploadButton} uploadButton
     * @param {FormData} formData FormData that includes the file element
     * @param {Element} fileInputDom DOM element for the file input field
     * @param {ArrayBuffer} fileContents Raw content of the selected file
     */

    items: [
        {
            xtype: 'filefield',
            itemId: 'fileField',
            // This must be in the format form[SF_NAME][file]
            // where SF_NAME is the name of the form field as defined in Symfony
            name: 'form[uploadedFile][file]', // NOTE: referenced in _parseErrorMessageFromAction
            buttonText: 'Upload File',
            buttonOnly: true,
            fieldStyle: 'margin-left: 0px;',
            listeners: {
                change: function(fileField, newValue) {
                    if (fileField.up('panel').getSubmitOnChange()) {
                        fileField.up('panel')._commitFile();
                    }
                }
            }
        },
    ],

    constructor: function(config) {
        this._fileContentArrayBuffer = null;

        this.callParent([ config ]);
    },

    afterRender: function() {
        var me = this;

        this.callParent(arguments);

        // Attach native event listener so we can provide access to the file's data
        // NOTE: addEventListener is a native javascript method, not an Ext method!
        var fileInputDom = this.down("#fileField").fileInputEl.dom;
        fileInputDom.addEventListener('change', function(files) {
            var reader = new FileReader();

            reader.onload = function(e) {
                me._fileContentArrayBuffer = reader.result;

                // Build a FormData object for easier uploading
                var formData = new FormData();
                formData.append(me.down("#fileField").getName(), fileInputDom.files[0]);

                me.fireEvent('fileSelected', this, formData, fileInputDom, me._fileContentArrayBuffer);

                // Reset field value so that "change" event will fire if the same file is re-picked
                fileInputDom.value = null;
            };

            reader.readAsArrayBuffer(this.files[0]);
        });

        // Fix for text field causing extra spacing even though it's hidden
        // Recommended by Sencha support in ticket #58614
        this.down("#fileField").getEl()
            .down(".x-form-text-field-body-default")
            .setStyle({ minWidth: "inherit", minHeight: "inherit" });
    },

    _commitFile: function() {
        if (!this.isValid()) return;

        this.getForm().submit({
            url: this.getUploadUrl(),
            waitMsg: 'Uploading...',
            success: function(form, action) {
                this.fireEvent('uploadComplete', this, action.result, action);

                // Reset field value so that "change" event will fire if the same file is re-picked
                this.down("#fileField").fileInputEl.dom.value = null;
            },
            failure: function(form, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.SERVER_INVALID:
                        var errorMsg = this._parseErrorMessageFromAction(action);
                        Ext.Msg.alert('Error', errorMsg);
                        break;
                    case Ext.form.action.Action.LOAD_FAILURE:
                        Ext.Msg.alert('Error', 'File upload failed (empty response from the server)');
                        break;
                    case Ext.form.action.Action.CLIENT_INVALID:
                        Ext.Msg.alert('Error', 'Form fields may not be submitted with invalid values');
                        break;
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        Ext.Msg.alert('Error', 'Error communicating with the server. Please retry your upload.');
                        break;
                    default:
                        Ext.Msg.alert('Error', 'File upload failed');
                        break;
                }

                // Reset field value so that "change" event will fire if the same file is re-picked
                this.down("#fileField").fileInputEl.dom.value = null;
            },
            scope: this,
        });
    },

    _parseErrorMessageFromAction: function(action) {
        // Check if the data is available
        if (!action || !action.result || !action.result.errors) return 'Error uploading file(s)';

        var errors = action.result.errors.uploadedFile;

        // One error: just return it
        if (!Ext.isArray(errors)) return errors;

        // Otherwise, build a nicely-formatted list
        var html = '<ul>';
        for (var i=0; i < errors.length; i++) {
            html += '<li>' + errors[i];
        }
        html += '</ul>';

        return html;
    }
});