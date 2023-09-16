const { ComponentDialog, DialogTurnStatus } = require("botbuilder-dialogs");

const CANCEL_AND_HELP_DIALOG = "CANCEL_AND_HELP_DIALOG";

class CancelAndHelpDialog extends ComponentDialog {
        constructor(id) {
                super(id);
        }
        async onContinueDialog(innerDc) {
                const result = await this.interrupt(innerDc);
                if (result) {
                        return result;
                }
                return await super.onContinueDialog(innerDc);
        }

        async interrupt(innerDc) {
                if (innerDc.context.activity.text) {
                        const text =
                                innerDc.context.activity.text.toLowerCase();

                        switch (text) {
                                case "help":
                                case "?": {
                                        const helpMessageText =
                                                "Show help here";
                                        await innerDc.context.sendActivity(
                                                helpMessageText,
                                                helpMessageText
                                        );
                                        return {
                                                status: DialogTurnStatus.waiting,
                                        };
                                }
                                case "cancel":
                                case "quit": {
                                        const cancelMessageText =
                                                "Cancelling...";
                                        await innerDc.context.sendActivity(
                                                cancelMessageText,
                                                cancelMessageText
                                        );
                                        return await innerDc.cancelAllDialogs();
                                }
                        }
                }
        }
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
module.exports.CANCEL_AND_HELP_DIALOG = CANCEL_AND_HELP_DIALOG;
