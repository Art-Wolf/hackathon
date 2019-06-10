# Alexa Setup

Register an account on the [Alexa Developer Console](https://developer.amazon.com/alexa/console)

# Create A Skill

Select the 'Create Skill' button on the far right.
![](./pic/1.png =250x)

# Name the Skill

You can set a generic skill name, like 'Fifa Hack'. Accept the other defaults and click the 'Create Skill' button on the top right.
![](./pic/2.png =250x)

# Skill Template

Accept the default template of 'Start from scratch' and click 'Choose'.
![](./pic/3.png =250x)

# Invocation Model

The JSON is provided to install the exact invocation model for the skill. Select the JSON Editor in the bottom of the skill menu on the left.
![](./pic/4.png =250x)

Paste the contents of [interaction-model.json](../interaction-model.json) into the text box and select 'Save Model'
![](./pic/5.png =250x)

The skill menu on the left should now reflect the updated Intents.
![](./pic/6.png =250x)

# Endpoints

Select the Endpoint in the bottom of the skill menu on the left.

Select AWS Lambda ARN
Configure Default Region to: `arn:aws:lambda:us-west-2:700164244043:function:fifa-ref-dev-alexa`

Click 'Save Endpoint'
![](./pic/8.png =250x)

# Build the Model

Click Invocation at the top of the skill menu and click the 'Build Model' button.
![](./pic/9.png =250x)

Wait for the success message to appear
![](./pic/10.png =250x)

# Testing the Skill

Select the 'Test' item from the Menu up top.

Set the mode to Development.

![](./pic/11.png =250x)

You can know initiate the skill and call the intents via the Alexa simulator:

![](./pic/12.png =250x)