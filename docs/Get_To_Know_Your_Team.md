# Demo: Get To Know Your Team

This Alexa skill demonstrates a way to connect new fans to their national team by raising awareness around the players.

This demo will only consist of information regarding the US Woman's national soccer team.

Each player on the team plays for a club that is associated with the  US's National Women's Soccer League. This league contains 9 teams, and so we want users to learn which players play for the nearest club.


# Design

There are multiple components that are deployed.

## AWS

### Alexa Handler
The primary logic is maintained by the AWS Lambda utilizing the Alexa SDK. Each intent is broken into a separate class.

### Parsers
To automate the retrieval of additional information not maintained by FIFA, we scrape the info from the USA team's website. This is maintained in a dyanmodb table.

## Invoking

The AWS Lambda is not skill id locked, this allows testers to setup a private Alexa skill, build a model with the provided interaction model, and call the lambda via the testing tab.

[Testing Instructions](./Alexa_Setup.md)

## Testing

### Look Player Info

Get info on the player.

'fifa hack'
'look up emily'

### Find your club

WHat is your local club?

'fifa hack'
'whats my local team?'
'Chiacgo'
