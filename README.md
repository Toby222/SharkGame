# Shark Game

Shark Game is a web game made entirely in HTML, CSS and JavaScript. It is a game belonging to the "incremental" genre, though is not an "idle" game.

It was originally conceived for Seamergency 2014 by Cirrial, who spent a few years working on it before moving on to other projects. In 2020, spencers145 (AKA base4) and Toby222 picked up the project to continue developemnt. spencers145 made a fork, where an older version of the project currently sits. Toby222 forked that to make this repo, which holds the up-to-date game.

The hub branch holds the landing page for the game, which disambiguates the available versions of it, both current and historical. The alpha branch is for stable releases, and the dev branch is for development builds.

The hub, alpha, and dev branches are deployed at https://shark.tobot.dev, https://alpha.shark.tobot.dev, and https://dev.shark.tobot.dev respectively.

## Sprite Packing

We use a free sprite packer at https://free-tex-packer.com/app/ for sprites.js, sprites.png, homemessagesprites.png, and homemessagesprites.js.

To generate sprites.js and sprites.png, use the following custom Format:
```
SharkGame.Sprites = {
    {{#rects}}
    "{{{name}}}": {
      frame: {
        x: {{frame.x}},
        y: {{frame.y}},
        w: {{frame.w}},
        h: {{frame.h}}
      },
    },
    {{/rects}}
}
```
To generate homemessagesprites.png and homemessagesprites.js, replace `SharkGame.Sprites` with `SharkGame.HomeMessageSprites` above.
