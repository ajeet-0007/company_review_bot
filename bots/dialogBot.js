const { ActivityHandler } = require("botbuilder");

class DialogBot extends ActivityHandler {
        constructor(userState, conversationState, dialog) {
                super();
                if (!userState) throw new Error("UserState required!");
                if (!conversationState)
                        throw new Error("ConversationState required!");
                if (!dialog) throw new Error("DialogState required!");

                this.userState = userState;
                this.conversationState = conversationState;
                this.dialog = dialog;

                this.dialogState =
                        this.conversationState.createProperty("DIALOG_STATE");

                this.onMessage(async (context, next) => {
                        await this.dialog.run(context, this.dialogState);
                        await next();
                });
        }

        async run(context, next) {
                await super.run(context);
                await this.userState.saveChanges(context, false);

                await this.conversationState.saveChanges(context, false);
        }
}

module.exports.DialogBot = DialogBot;
