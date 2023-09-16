const {
        ComponentDialog,
        TextPrompt,
        ChoicePrompt,
        NumberPrompt,
        WaterfallDialog,
} = require("botbuilder-dialogs");

const TOP_LEVEL_DIALOG = "TOP_LEVEL_DIALOG";
const {
        ReviewSelectionDialog,
        REVIEW_SELECTION_DIALOG,
} = require("./reviewSelectionDialog");
const { UserProfile } = require("../userProfile");
const { CancelAndHelpDialog } = require("./cancelAndHelpDialog");

const TEXT_PROMPT = "TEXT_PROMPT";
const NUMBER_PROMPT = "NUMBER_PROMPT";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";

class TopLevelDialog extends CancelAndHelpDialog {
        constructor(id) {
                super(id || TOP_LEVEL_DIALOG);
                this.addDialog(new TextPrompt(TEXT_PROMPT));
                this.addDialog(new NumberPrompt(NUMBER_PROMPT));

                this.addDialog(new ReviewSelectionDialog());

                this.addDialog(
                        new WaterfallDialog(WATERFALL_DIALOG, [
                                this.nameStep.bind(this),
                                this.ageStep.bind(this),
                                this.startSelectionStep.bind(this),
                                this.acknowledgementStep.bind(this),
                        ])
                );
                this.initialDialogId = WATERFALL_DIALOG;
        }

        async nameStep(step) {
                step.values.userInfo = new UserProfile();

                return await step.prompt(
                        TEXT_PROMPT,
                        "Please enter your name."
                );
        }

        async ageStep(step){
                step.values.userInfo.name = step.result;
                return await step.prompt(NUMBER_PROMPT, "Please enter your age")
        }

        async startSelectionStep(step){
                step.values.userInfo.age = step.result;
                if(step.result< 25){
                        await step.context.sendActivity("You must be older than 25 to participate");
                        return await step.next();
                }else{
                        return await step.beginDialog(REVIEW_SELECTION_DIALOG);
                }
        }

        async acknowledgementStep(stepContext) {
                const userProfile = stepContext.values.userInfo;
                userProfile.companiesToReview = stepContext.result || [];
        
                await stepContext.context.sendActivity(`Thanks for participating ${ userProfile.name }`);

                return await stepContext.endDialog(userProfile);
            }
        
}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;
