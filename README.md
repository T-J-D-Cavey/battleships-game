# Battleships game UI

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tim-caveys-projects/v0-battleships-game-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Q5PS8ZvKCBw)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/tim-caveys-projects/v0-battleships-game-ui](https://vercel.com/tim-caveys-projects/v0-battleships-game-ui)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/Q5PS8ZvKCBw](https://v0.app/chat/projects/Q5PS8ZvKCBw)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository+


## Bugs / enhancements to fix


- When the player's battleship suffers a direct hit the ship visuals is lost (I did implement a fix for this but I was able to replicate the bug once in prod - one to watch out for)

- Anchor icons on homepage appear small in PROD

- There is local storage logic but the game state doesn't persist across refresh. It should. Refactor needed onLoad to check if game state is stored in local storage and if it is, to use that and not default state. This state should then be wiped when 'retreat' or game end is reached. Otherwise when the browser refreshes, the game state resets!

- Images aren't using Next.js Image component 

- Page changes aren't using Next.js Link component

- Reset deployment button on position-ships page has a bug with hover border on wide desktop screens

- Enhancement: make it more dificult, the bot gets two random grid shots per round
