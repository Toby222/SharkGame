# Jogo do Tubarão

O Jogo do Tubarão (Shark Game) é um jogo de navegador feito inteiramente me HTML, CSS e JavaScript. É um jogo do gênero "incremental", mas não consideramos ele um jogo "idle".

Foi originalmente feito para o evento "Seamergency 2014" por Cirrial, que ficou alguns anos trabalhando nele antes de ir para outros projetos. Em 2020, spencers145 (também conhecido como base4) e Toby222 pegaram o jogo para tocar a frente o seu desenvolvimento. spencers145 fez um fork (isso é expressão de programador que o tradutor que vos digita não sabe traduzir), onde uma versão antiga do projeto ainda pode ser achada. Toby222 forkout aquilo para fazer este repositório, que é o que mantém o mod atual. No início de 2025 spencers145 se convidou a si mesmo a se retirar do desenvolvimento e Toby222 agora é o líder do projeto. Se você está lendo este texto em português, é porque um dos artistas do jogo, conhecido como Biggest Brian, que entrou no projeto em 2025, um dia decidiu traduzir o jogo inteiro para que a vó dele pudesse jogar. 

O "menu principal" é onde fica a página de entrada para o jogo, que apresenta as diferentes versões do jogo, ambas atuais e historicas. A versão "alpha" é para versões estáveis, a versão "dev" é para versões de desenvolvimento.

O menu e as versões alpha, and dev estão nos links https://shark.tobot.dev, https://alpha.shark.tobot.dev e https://dev.shark.tobot.dev respectivamente.

## Empacotamento de Imagens

Nós usamos um empacotador de imagem em https://free-tex-packer.com/app/ para os arquivos sprites.js, sprites.png, homemessagesprites.png e homemessagesprites.js.

Para gerar sprites.js e sprites.png, use a seguinte formatação customizada:
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
Para gerar homemessagesprites.png e homemessagesprites.js, substitua `SharkGame.Sprites` para `SharkGame.HomeMessageSprites` acima.
