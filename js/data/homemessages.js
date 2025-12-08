SharkGame.HomeMessages = {
    // Priority: later messages display if available, otherwise earlier ones.
    messages: {
        // FIRST RUN
        start: [
            {
                name: "start-you-are-a-shark",
                message: "Você gostaria de comer algo.",
            },
            {
                name: "start-shark",
                unlock: { totalResource: { fish: 5 } },
                message: "Você atrai a atenção de um tubarão. Talvez ele possa ajudar você a caçar os peixes!",
            },
            {
                name: "start-sharks",
                unlock: { resource: { shark: 2 } },
                message: "Mais tubarões se aproximam, curiosos e em alerta.",
            },
            {
                name: "start-ray",
                unlock: { resource: { shark: 5 } },
                message: "Algumas arraia chegam perto.",
            },
            {
                name: "start-quite-the-group",
                unlock: { resource: { shark: 6, ray: 2 } },
                message: "Você tem um bom grupo junto de você agora.",
            },
            {
                name: "start-crab",
                unlock: { resource: { shark: 10, ray: 4 } },
                message: "Uns caranguejos curiosos vêm ver.",
            },
            {
                name: "start-tribe",
                unlock: { resource: { shark: 12, ray: 4, crab: 5 } },
                message: "Sua nova tribo está ao seu comando!",
            },
            {
                name: "start-crystals",
                unlock: { resource: { shark: 1, crystal: 10 } },
                message: "Os cristais reluzem. Alguns tubarões os observam, curiosos.",
            },
            {
                name: "start-science",
                unlock: { resource: { scientist: 1 } },
                message: "Os tubarões cientistas nadam juntos dentro do teu cardume.",
            },
            {
                name: "start-discoveries",
                unlock: { upgrade: ["crystalContainer"] },
                message: "Mais descobertas são necessárias.",
            },
            {
                name: "start-nurse",
                unlock: { resource: { nurse: 1 } },
                message: "A comunidade de tubarões cresce com o tempo.",
            },
            {
                name: "start-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Você ouve fracas músicas e cantos distantes.",
            },
            {
                name: "start-machines",
                unlock: { upgrade: ["automation"] },
                message: "Máquinas para fazer coisas para você.<br>Máquinas para fazer coisas mais rápido que você ou qualquer outro tubarão.",
            },
            {
                name: "start-chasm",
                unlock: { upgrade: ["farExploration"] },
                message: "Este lugar não é a sua casa. Você lembra de um oceano azul cristal.<br>O abismo te contempla de volta.",
            },
            {
                name: "start-gate",
                unlock: { upgrade: ["gateDiscovery"] },
                message: "O portal te chama. Seus segredos devem ser descobertos.",
            },
        ],

        // LATER RUNS
        marine: [
            {
                name: "marine-default",
                message: "Cardumes de peixe populam sua vastidão. Esse lugar te parece tão familiar.",
            },
            {
                name: "marine-noticed-lobsters",
                unlock: { upgrade: ["crystalContainer"] },
                message: "Você percebe umas criaturas na areia. Elas não fazem muita coisa e ignoram a sua presença.",
            },
            {
                name: "marine-noticed-lobsters-2",
                unlock: { upgrade: ["seabedGeology"] },
                message: "Você percebe umas criaturas na areia. Elas não fazem muita coisa e ignoram a sua presença.",
            },
            {
                name: "marine-lobsters",
                unlock: { totalResource: { lobster: 1 } },
                message: "As lagostas trabalham, mas parecem despreocupados. Eles não se estressam com nada.",
            },
            {
                name: "marine-lobsters-talk",
                unlock: { totalResource: { lobster: 125 } },
                message:
                    "As lagostas contam contos com grandiosas aventuras e riqueza incontável de um tempo há muito perdido. Eles se perguntam por que eles abandonaram essa vida.",
            },
            {
                name: "marine-calcinium",
                unlock: { totalResource: { calcinium: 1 } },
                message: "Calcinício. É áspero, duro, e branco. Ele parece frágil, mas não é.",
            },
            {
                name: "marine-robotics",
                unlock: { totalResource: { clamScavenger: 1 } },
                message: "Um membro frio e duro pesca mexilhões do solo. As lagostas assistem com atenção.",
            },
            {
                // do color transition 1 here
                name: "marine-bioengineering",
                unlock: { upgrade: ["bioengineering"] },
                message:
                    "Uma interface cérebro-pedra. Melhorias conchibernéticas. Automação populacional. As lagostas afirmam que o calcinício é uma extensão da vida em si.",
            },
            {
                // second color transition
                name: "marine-sentience",
                unlock: { upgrade: ["sentientCircuitBoards"] },
                message: "Todo o cardume tem aprimoramentos. Crianças nascem meio-máquina. As lagostas chamam de eficiente.",
                // we can't understand it, no, we could never hope to understand it like the lobsters do
                // 'they [the circuits] even die...just like us.'
            },
            {
                // final color transition
                name: "marine-abandoned",
                unlock: { upgrade: ["mobiusShells"] },
                message: "Um negrume emana do cardume. Uma névoa rançosa começa a se instalar. Esse mundo está se destruindo e vai arrastar todos junto com ele.",
            },
        ],

        haven: [
            {
                name: "haven-default",
                message: "Esse oceano está estourando de vida. Um recife próspero te cerca.",
            },
            {
                name: "haven-dolphin-observes",
                unlock: { totalResource: { coral: 75 } },
                message: "Uma... coisa nos observa de longd. Mas o que diabos é aquilo??",
            },
            {
                name: "haven-dolphins",
                unlock: { totalResource: { dolphin: 1 }, homeAction: ["getDolphin"] },
                message:
                    "Um golfinho se junta ao cardume. Nós dissemos para ele caçar peixes, mas ele voltou com coral. Ele fica insistindo que coral é mais importante.",
            },
            {
                name: "haven-dolphin-empire",
                unlock: { totalResource: { dolphin: 20 } },
                message:
                    "Os grupos sociais de golfinhos que trabalham conosco nos falam de um império golfinesco que domina estrelas inteiras. Eles perguntam onde está o nosso império. E então sorriem.",
            },
            {
                name: "haven-papyrus",
                unlock: { upgrade: ["sunObservation"] },
                message: "Pedaços de alga condensada (???) estão sendo trazidas pelas correntes.<br/>Algo foi gravado neles.",
            },
            {
                name: "haven-stories",
                unlock: { upgrade: ["delphineHistory"] },
                message:
                    "As histórias indulgentes dos golfinhos mencionam muito um portal mágico. Só que eles não sabem onde está. Ah, que conveniente, claro que não sabem.",
            },
            {
                name: "haven-whales",
                unlock: { totalResource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "As baleias quase nunca falam conosco, silenciosamente trabalhando enquanto para o oceano. Por que será que cantam?",
            },
            {
                name: "haven-history",
                unlock: { upgrade: ["retroactiveRecordkeeping"] },
                message:
                    "O compêndio de todo o conhecimento dos golfinhos está diante de nós,<br/>e é ridiculamente pequeno. Os registros originais se perderam nas areias do tempo.",
            },
            {
                name: "haven-song",
                unlock: { upgrade: ["whaleSong"] },
                message: "A música da baleia te enche com aquela sensação, a mesma do portal. Mas tão fracamente.",
            },
            {
                name: "haven-done",
                unlock: { resource: { chorus: 1 } },
                message: "O Coro ressoa pelas águas, espalhando para os quatro cantos do oceano.<br/>O portal reage.",
            },
        ],

        tempestuous: [
            {
                name: "tempestuous-default",
                message: "Ventos terríveis te chicoteiam pela água, espalhando suas coisas e aliados.",
            },
            {
                name: "tempestuous-cave",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "Você se abriga dentro da caverna. Você ainda consegue sentir o vento, mas agora está mais suave.",
            },
            {
                name: "tempestuous-cave-rustling",
                unlock: { upgrade: ["crystalBite"] },
                message: "Você ouve um barulhinho vindo do fundo da caverna.",
            },
            {
                name: "tempestuous-billfish",
                unlock: { upgrade: ["cavernousContact"] },
                message: "Os 'peixes-espada', como eles se chamaram, se desculpam por se esconderem. Eles dizem que nenhum tubarão entrou nesta caverna há um bom tempo.",
            },
            {
                name: "tempestuous-sandbags",
                unlock: { resource: { stormgoer: 10 } },
                message:
                    "Desbravadores marcham lentamente pela areia. Suas patas marcam o chão enquanto extraem erva marinha, mas eles estão pesados demais para trazer cristais também.",
            },
            {
                name: "tempestuous-stories",
                unlock: { upgrade: ["billfishBiology"] },
                message:
                    "As espadas contam histórias da vida antes da tempestade e de um antigo visitante que os trouxe prosperidade. Eles te perguntam se você também consegue trazê-los prosperidade.",
            },
            /*
                name: "tempestuous-special",
                unlock: { upgrade: ["cavernousContact"] },
                message: "The billfish watch you with awe. Hope glimmers in their eyes.",
            }, */
            {
                name: "tempestuous-bottles",
                unlock: { upgrade: ["magicBottles"] },
                message: "Uma ventania uiva gentilmente dentro de cada garrafa. Você sente a turbulência de uma tempestade tremendo o frasco.",
            },
            {
                name: "tempestuous-expeditions",
                unlock: { upgrade: ["routing"] },
                message:
                    "Os peixes-espada formam filas para se voluntariar para expedições, apesar de qualquer perigo. Eles não precisam ser convencidos, apenas do equipamento.",
            },
            {
                name: "tempestuous-map",
                unlock: { upgrade: ["cartographicCompleteness"] },
                message: "Um mapa enorme foi pregado na parede da caverna. No canto direito superior, há uma forma estranha com uma porta.",
            },
            {
                name: "tempestuous-machine",
                unlock: { upgrade: ["theExpedition"] },
                message: "Os corredores da construção ecoam com os sons de engrenagens girando. Peixes-espada nadam pelas câmaras.",
            },
            {
                name: "tempestuous-generator",
                unlock: { upgrade: ["internalExploration"] },
                message:
                    "O gerador está completamente desligada, e mesmo assim, a instalação persiste funcionando. O vento ressoa lá fora enquanto os mecânicos mexem empolgados com as máquinas.",
            },
            {
                name: "tempestuous-legends",
                unlock: { upgrade: ["cumulusControl"] },
                message: "Com o fim da tempestade, você ouve a conversa de um par de espadas. Um pergunta por que o visitante nunca voltou.",
            },
        ],

        volcanic: [
            {
                name: "volcanic-default",
                message: "Fontes ferventes enchem o mar com fumaça cinzenta. Não tem um tubarão sequer a sua volta.",
            },
            {
                name: "volcanic-shrimp-contact",
                unlock: { totalResource: { sponge: 1 } },
                message: "Um camarãozinho chega perto de você. Êlu te passa a mensagem: pare de colher as esponjas, ou entrente a ira do Camarão Rei.",
            },
            {
                name: "volcanic-shrimp-threat",
                unlock: {
                    custom() {
                        return SharkGame.flags.prySpongeGained > 200 && !SharkGame.flags.gotFarmsBeforeShrimpThreat;
                    },
                },
                message: "Um exército de camarõezinhos chega perto de você. Elus te passam a mensagem de forma ainda mais clara: coopere, ou seja obliterado. Você decide parar de colher as esponjas.",
            },
            {
                name: "volcanic-shrimp-communication",
                unlock: { upgrade: ["consistentCommunication"] },
                message: "As casas esponjosas que abandonadas pelos camarões que se juntaram ao cardume agora podem ser coletadas por nós. Perfeito.",
            },
            {
                name: "volcanic-monarchy",
                unlock: { totalResource: { queen: 1 } },
                message: "Os camarões seguem um sistema rígido de castas, onde o Camarão Rei fica no topo. Elus perguntam quem é o seu rei.",
            },
            {
                name: "volcanic-shrimps",
                unlock: { upgrade: ["sustainableSolutions"] },
                message:
                    "Os camarões contam sobre um antigo visitante que violou o mundo delus, e como querem restaurá-lo. Eles trabalham duro pelos seus futuros.",
            },
            {
                name: "volcanic-smithing",
                unlock: { totalResource: { porite: 1 } },
                message: "Porita: pedaços de vidro selados, porém porosos em seu interior: muito leve e, ainda assim, resistente.",
            },
            {
                name: "volcanic-noticed",
                unlock: { upgrade: ["glassTempering"] },
                message: "Você ouve por aí que o Rei descobriu os seus planos. Dizem que ele planeja destruir o cardume inteiro.",
            },
            {
                name: "volcanic-acolytes",
                unlock: { upgrade: ["algaeAcolytes"] },
                message: "Os seguidores se juntam. Elus rezam pelo Rei. Elus rezam pelo seu mundo. Elus rezam por você.",
            },
            // Rumor has it that the king of shrimps guards the key to a secret, sacred gate in his sandcastle.
            {
                name: "volcanic-beauty",
                unlock: { upgrade: ["finalDraft"] },
                message: "O Rei está sem palavras. Olhando a grande cidade indústrial que você criou, os súditos dele o saudam e celebram sua presença.",
            },
            {
                name: "volcanic-hope",
                unlock: { upgrade: ["apologeticAmnesty"] },
                message: "\"Talvez nem todos os tubarões sejam desprezíveis,\" diz o Camarão Rei. \"Talvez, você seja diferente.\"",
            },
        ],

        abandoned: [
            {
                name: "abandoned-default",
                message: "A graxa entope as guelras de todos aqui. Esse mundo destruído vai arrastar todos junto com ele.",
            },
            {
                name: "abandoned-octopus-scrutinizes",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "Um polvo chega junto. Julgando as suas tentativas irrisórias de organização.",
            },
            {
                name: "abandoned-octopus",
                unlock: { totalResource: { octopus: 1 } },
                message: "O polvo trabalha sem folga. 8 dias na semana.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { totalResource: { octopus: 16 } },
                message: "Mais polvos se juntam. Eles trabalham em união perfeita.",
            },
            {
                name: "abandoned-production",
                unlock: { upgrade: ["octopusMethodology"] },
                message:
                    "Os polvos se importam com produção e com agir corretamente; falam sobre união por eficiência; e nos veem com um olhar frio e apático.",
            },
            {
                name: "abandoned-spronge",
                unlock: { resource: { spronge: 1 } },
                message: "A nata circula pela espronja como sangue em veias. Em resposta, ela bate e a bombeia.",
            },
            {
                name: "abandoned-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Grandes prédios surgem na distância. Uma trama de cabos estão embolados até o horizonte.",
            },
            {
                name: "abandoned-gate",
                unlock: { upgrade: ["farAbandonedExploration"] },
                message:
                    "Esse portal está tão inerte e apagado quanto à cidade a sua volta. Seus receptáculos já estão preenchidos, mas ainda está desativado.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message:
                    "As partes giram, clicam e encaixam umas com as outras, mas não conseguimos entender para quê. Quais segredos escondem-se nesses estranhos mecanismos?",
            },
            {
                name: "abandoned-high-energy-fusion",
                unlock: { upgrade: ["highEnergyFusion"] },
                message: "A luz é capaz de cegar, mas o resultado vale a cegueira temporária. Os pedaços de um passado perdido se juntam para formar um futuro melhor.",
            },
            {
                name: "abandoned-done",
                unlock: { upgrade: ["artifactAssembly"] },
                message: "O portal acorda com um brilho fora desde mundo. Se você apertar os olhos, você quase consegue ver um oceano azul do outro lado.",
            },
            {
                name: "abandoned-tar-one",
                unlock: { resource: { tar: 5 } },
                message: "A graxa está matando tudo! Tem que ter algum jeito de limpá-la.",
                transient: true,
            },
            {
                name: "abandoned-tar-two",
                unlock: { resource: { tar: 500 } },
                message: "Apenas as máquinas resistem. Tudo foi perdido. <span class='smallDesc'>Tudo está perdido.</span>",
                transient: true,
            },
        ],

        shrouded: [
            {
                name: "shrouded-default",
                message: "Os cristais ficaram mais fáceis de se ver, mas a escuridão dificulta ver qualquer outra coisa.",
            },
            {
                name: "shrouded-eel-onlookers",
                unlock: { upgrade: ["crystalContainer"] },
                message: "Mergulhadores relatam ver coisinhas ondulantes no fundo do oceano. Eles se escondem em seus buracos quando chegamos perto.",
            },
            {
                name: "shrouded-eels",
                unlock: { totalResource: { eel: 1 } },
                message: "As enguias conversam conosco dos buracos deles. Eles gostaram de nós.",
            },
            {
                name: "shrouded-distant-chimaeras",
                unlock: { upgrade: ["exploration"] },
                message: "No véu da escuridão, nós conseguimos distinguir os formatos de alguma criatura estranha. Elas fogem quando tocados por luz.",
            },
            {
                name: "shrouded-chimaeras",
                unlock: { totalResource: { chimaera: 1 } },
                message:
                    "As quimeras sugerem que são um elo ancião de nós tubarões, reunidos novamente por coincidências incríveis. Nós não fazemos a menor ideia sobre isso, mas elas acham que nós entendemos.",
            },
            {
                name: "shrouded-arcana",
                unlock: { totalResource: { arcana: 5 } },
                message: "Esse artefatos abissais brilham levemente, mas apenas no breu completo. O brilho te faz sentir coisas que você não compreende.",
            },
            {
                name: "shrouded-power",
                unlock: { totalResource: { sacrifice: 100 } },
                message:
                    "Cada pedaço estoura em um clarão. Cada sacrifício te inundando com aquela sensação familiar. O estalo de arcana quebrada ecoa na sua mente.",
            },
            {
                name: "shrouded-city",
                unlock: { upgrade: ["arcaneHeart"] },
                message: "O som dos exploradores ecoa quase infinitamente pelos túneis da cidade esfacelada. As enguias dizem que nunca estiveram mais esperançosas.",
            },
            {
                name: "shrouded-truth",
                unlock: { totalResource: { sacrifice: 9000000000000000 } },
                message: "Um grupo de enguias chama a sua atenção. Eles trouxeram algo das cavernas: Um livro. Cheio de figuras de cristais rosas.",
            },
        ],

        frigid: [
            {
                name: "frigid-default",
                message: "Placas gigantes de gelo pontudo te cercam por todos os lados.",
            },
            {
                name: "frigid-ice-one",
                unlock: { resource: { ice: 20 } },
                message: "Você está cansando.",
            },
            {
                name: "frigid-icy-doom",
                unlock: { resource: { ice: 500 } },
                message: "Tanto frio. Tanta fome. <span class='smallDesc'>Nenhuma esperança.</span>",
            },
            {
                name: "frigid-distant-village",
                unlock: { totalResource: { science: 8 } },
                message: "Analisando o horizonte, você percebe uma fresta pelo gelo. Você dá uma olhada... e acha alguma coisa.",
            },
            {
                name: "frigid-village",
                unlock: { upgrade: ["civilContact"] },
                message:
                    "Uma pequena vila de lulas te cumprimenta. The water in this place is a little warmer, and you hear a quiet, ambient hum.",
            },
            {
                name: "frigid-urchins",
                unlock: { totalResource: { urchin: 2 } },
                message:
                    "The urchins scuttle along the ground and hop about, gathering kelp and placing it into a large, central pile. They know nothing but the kelp.",
            },
            {
                name: "frigid-teamwork",
                unlock: { totalResource: { extractionTeam: 1 } },
                message: "The squid champion the value of teamwork and the necessity of cooperation. They say they follow by example.",
            },
            {
                name: "frigid-machine",
                unlock: { totalResource: { squid: 125 } },
                message:
                    "In the center of the settlement lies a vibrating...thing, and a strange gate. The thing buzzes loudly, casting enormous energy across the water.",
            },
            {
                name: "frigid-squid",
                unlock: { totalResource: { squid: 250 } },
                message: "The squid speak of an ancient visitor who saved their world. They ask if you too, have seen this visitor.",
            },
            {
                name: "frigid-suspicion",
                unlock: { upgrade: ["automation"] },
                message: "The squid describe the machine with fascination. They ask if we feel the same. They see something we do not.",
            },
            {
                name: "frigid-battery",
                unlock: { upgrade: ["internalInquiry"] },
                message:
                    "Buried deep within the complex lies a massive, dimly glowing battery. The squid say replacing it will get the machine running at full power.",
            },
            {
                name: "frigid-heat-returns",
                unlock: { upgrade: ["rapidRecharging"] },
                message: "A wave of heat washes over you, and the dingy complex comes back to life. The gate turns on.",
            },
        ],
        /*
        {
            message:
                "The jagged seafloor looks ancient, yet pristine.<br>Sponges thrive in great numbers on the rocks.",
        },
        */
    },
};
