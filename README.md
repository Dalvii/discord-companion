# Discord Companion
A tiny version of Discord that is Always on top, so you can chat with your friends while doing something else!
***VERSION FRANCAIS TOUT EN BAS !!!***

***CAUTION: This software is in French only, I will translate in the future***
My inspiration is from this [Reddit Post](https://www.reddit.com/r/discordapp/comments/ivhydn/discord_window_minimize_concept/)

## Node install
You need Node.js to run this script: [Download](https://nodejs.org/en/download/)
Then download the repo,
and type in the directory console:
```
npm install
```

## Run
```
npm run start
// or
node main.js
```

## Compile
Better methods exists, this is just the simplier one
```
electron-packager .
```

## Configuration
You need to modify the script to match your Discord Bot account.
Configuration is in `config.json` file
```
{
    "token": "YOUR_DISCORD_BOT_TOKEN"
}
```

[To create a Discord Bot](https://discord.com/developers/applications)

## To do
There is a lot to do, this is just an alpha version that I made few month ago
- Emojis support (Currently displaying weird emojis ID `<:check:797170017691107328>`)
- People who are writting animation
- Videos supports
- Markdown messages
- Add English

## About Selfbot
This software is using a Discord Bot user, but obviously, using this software with your Discord account seems to be much better, but it is similar as selfbot:
According to [this tweet](https://twitter.com/discord/status/938576069690560513), Discord forbids this use case.

## Infos
- Discord : `Dalvi#3682`

## Example: Choose Servers/Channels
![Example channels](https://i.imgur.com/606FJDO.png)

## Example: Chatting
![Example chat](https://i.imgur.com/AFdGETB.png)


# Traduit en français

L'idée me vient de ce post sur [Reddit](https://www.reddit.com/r/discordapp/comments/ivhydn/discord_window_minimize_concept/)

## Installation de Node.js
Vous devrez installer Node.JS pour faire fonctionner cette application: [Télécharger](https://nodejs.org/en/download/)
Puis, téléchargez ce Repo
Ouvrez une console et tapez:
```
npm install
```

## Lancer
```
npm run start
// ou
node main.js
```

## Compiler
Il y a des meilleures solutions pour compiler, mais voici la plus simple:
```
electron-packager .
```

## Configuration
Vous devrez modifier le fichier de configuration avec le Token de votre Bot Discord
Le fichier de configuration se nomme: `config.json`
```
{
    "token": "VOTRE_TOKEN_BOT_DISCORD"
}
```

[Pour créer un bot Discord](https://discord.com/developers/applications)

## A Faire
Il y a encore beaucoup d'amélioration que je dois apporter, c'est seulement une version Alpha
- Support des émojis (Actuellement affichés en brut `<:check:797170017691107328>`)
- Animation quand des utilisateurs écrivent
- Support des vidéos
- Messages mise en formes (markdown)
- Traduire en Anglais

## A propos des SelfBot
Ce logiciel utilise un Bot Discord pour fonctionner, mais utiliser son compte personel Discord serait bien mieux, malheuresement d'après [ce tweet](https://twitter.com/discord/status/938576069690560513), Discord ban tout ceux qui utilise cette méthode.

## Infos
- Discord : `Dalvi#3682`

## Exemple: Menu des serveurs/channels
![Example channels](https://i.imgur.com/606FJDO.png)

## Exemple: Chat
![Example chat](https://i.imgur.com/AFdGETB.png)

