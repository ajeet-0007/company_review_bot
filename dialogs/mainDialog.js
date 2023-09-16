const {
        ComponentDialog,
        DialogSet,
        DialogTurnStatus,
        WaterfallDialog,
        DialogEvents
} = require("botbuilder-dialogs");

const { TopLevelDialog, TOP_LEVEL_DIALOG } = require("./topLevelDialog");

const MAIN_DIALOG = "MAIN_DIALOG";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
const USER_PROFILE_PROPERTY = "USER_PROFILE_PROPERTY";

class MainDialog extends ComponentDialog {
        constructor(id, userState) {
                super(id);
                this.userState = userState;
                this.userProfileAccessor = this.userState.createProperty(
                        USER_PROFILE_PROPERTY
                );
                this.addDialog(new TopLevelDialog());

                this.addDialog(
                        new WaterfallDialog(WATERFALL_DIALOG, [
                                this.initialStep.bind(this),
                                this.secondStep.bind(this),
                        ])
                );
                this.initialDialogId = WATERFALL_DIALOG;
        }

        async run(context, accessor) {
               
                const dialogSet = new DialogSet(accessor);
                
                dialogSet.add(this);
             
                const dialogContext = await dialogSet.createContext(context);
                const results = await dialogContext.continueDialog(context);

                

                if (results.status === DialogTurnStatus.empty) {
                        await dialogContext.beginDialog(this.id);
                }
        }

        async initialStep(step) {
                return await step.beginDialog(TOP_LEVEL_DIALOG);
        }

        async secondStep(step) {
                const userInfo = step.result;
                if(userInfo!== undefined){
                
                console.log("serinfo", userInfo);
                const status = 'You are signed up to review ' +
                    (userInfo?.companiesToReview.length === 0 ? 'no companies' : userInfo?.companiesToReview.join(' and ')) + '.';
                await step.context.sendActivity(status);
                
                await this.userProfileAccessor.set(step.context, userInfo);
                const d = await this.userProfileAccessor.get(step.context)
              
                return await step.endDialog();}else{
                        await step.context.sendActivity("You have cancelled the survey");
                        return await step.endDialog();
                }
        }
}

module.exports.MAIN_DIALOG = MAIN_DIALOG;
module.exports.MainDialog = MainDialog;
