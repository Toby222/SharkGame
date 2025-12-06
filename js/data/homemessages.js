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
                message: "Scorching vents fill the sea with white and black smoke. There's not a shark in sight.",
            },
            {
                name: "volcanic-shrimp-contact",
                unlock: { totalResource: { sponge: 1 } },
                message: "You are approached by a single shrimp. They relay a message to you: stop harvesting sponges, or face the wrath of the king of shrimps.",
            },
            {
                name: "volcanic-shrimp-threat",
                unlock: {
                    custom() {
                        return SharkGame.flags.prySpongeGained > 200 && !SharkGame.flags.gotFarmsBeforeShrimpThreat;
                    },
                },
                message: "You are approached by an army of shrimp. They relay a very clear message to you: cooperate, or be destroyed. You decide to stop harvesting sponges.",
            },
            {
                name: "volcanic-shrimp-communication",
                unlock: { upgrade: ["consistentCommunication"] },
                message: "The sponge homes left behind by shrimp joining the frenzy may now be taken for ourselves.",
            },
            {
                name: "volcanic-monarchy",
                unlock: { totalResource: { queen: 1 } },
                message: "The shrimps follow a caste system with the king of shrimps on top. They ask who your king is.",
            },
            {
                name: "volcanic-shrimps",
                unlock: { upgrade: ["sustainableSolutions"] },
                message:
                    "The shrimp speak of an ancient visitor who violated their world, and how they wish to restore it. They work hard for their future.",
            },
            {
                name: "volcanic-smithing",
                unlock: { totalResource: { porite: 1 } },
                message: "Porite: glassy hunks sealed on the outside but porous on the inside: it's lightweight, yet it stays strong.",
            },
            {
                name: "volcanic-noticed",
                unlock: { upgrade: ["glassTempering"] },
                message: "Rumors say the king has caught wind of your plans. They say he plans to destroy the entire frenzy.",
            },
            {
                name: "volcanic-acolytes",
                unlock: { upgrade: ["algaeAcolytes"] },
                message: "The acolytes gather. They pray for their king. They pray for their world. They pray for you.",
            },
            // Rumor has it that the king of shrimps guards the key to a secret, sacred gate in his sandcastle.
            {
                name: "volcanic-beauty",
                unlock: { upgrade: ["finalDraft"] },
                message: "The king is speechless. As he views the great industrial city, his subjects gather and cheer, celebrating his arrival.",
            },
            {
                name: "volcanic-hope",
                unlock: { upgrade: ["apologeticAmnesty"] },
                message: "\"Perhaps not all sharks are so vile,\" says the king of shrimps. \"Perhaps, you will be different.\"",
            },
        ],

        abandoned: [
            {
                name: "abandoned-default",
                message: "The tar clogs the gills of everyone here. This dying world drags everyone down with it.",
            },
            {
                name: "abandoned-octopus-scrutinizes",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "An octopus wanders over. It scrutinizes your attempt at organization.",
            },
            {
                name: "abandoned-octopus",
                unlock: { totalResource: { octopus: 1 } },
                message: "The octopus works tirelessly.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { totalResource: { octopus: 16 } },
                message: "More octopuses join. They work in perfect unison.",
            },
            {
                name: "abandoned-production",
                unlock: { upgrade: ["octopusMethodology"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency. They regard us with cold, neutral eyes.",
            },
            {
                name: "abandoned-spronge",
                unlock: { resource: { spronge: 1 } },
                message: "Residue pumps through spronge like blood. It pulses and throbs.",
            },
            {
                name: "abandoned-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Great spires loom in the distance. Loose cables are strung together on the horizon.",
            },
            {
                name: "abandoned-gate",
                unlock: { upgrade: ["farAbandonedExploration"] },
                message:
                    "This gate stands inert and lifeless like the city around it. The slots are already filled, but it looks like it's turned off.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message:
                    "The components spin and whirr and click together, but their purpose eludes us. What secrets are you hiding in your mechanisms?",
            },
            {
                name: "abandoned-high-energy-fusion",
                unlock: { upgrade: ["highEnergyFusion"] },
                message: "The light is blinding, but the output is worth it. The pieces of a broken past unite to create a brighter future.",
            },
            {
                name: "abandoned-done",
                unlock: { upgrade: ["artifactAssembly"] },
                message: "The gate buzzes to life, glowing ethereally. If you squint, you can barely make out a blue ocean on the other side.",
            },
            {
                name: "abandoned-tar-one",
                unlock: { resource: { tar: 5 } },
                message: "The tar is killing everything! Maybe a filter could save us?",
                transient: true,
            },
            {
                name: "abandoned-tar-two",
                unlock: { resource: { tar: 500 } },
                message: "Only machines will remain. All is lost. <span class='smallDesc'>All is lost.</span>",
                transient: true,
            },
        ],

        shrouded: [
            {
                name: "shrouded-default",
                message: "The crystals are easier to find, but the darkness makes it hard to find anything else.",
            },
            {
                name: "shrouded-eel-onlookers",
                unlock: { upgrade: ["crystalContainer"] },
                message: "Divers have reported sightings of wiggly things on the ocean floor. They dart into their holes when approached.",
            },
            {
                name: "shrouded-eels",
                unlock: { totalResource: { eel: 1 } },
                message: "The eels chatter among their hiding places. They like the sharks.",
            },
            {
                name: "shrouded-distant-chimaeras",
                unlock: { upgrade: ["exploration"] },
                message: "In the fog of darkness, the shapes of strange creatures can be made out. They dart away when light approaches.",
            },
            {
                name: "shrouded-chimaeras",
                unlock: { totalResource: { chimaera: 1 } },
                message:
                    "The chimaeras imply they are ancient kin of the shark kind, reunited through wild coincidence. We don't understand, but they seem to think we do.",
            },
            {
                name: "shrouded-arcana",
                unlock: { totalResource: { arcana: 5 } },
                message: "These hadal artifacts glow faintly, only in pitch blackness. That glow makes you feel something that you don't understand.",
            },
            {
                name: "shrouded-power",
                unlock: { totalResource: { sacrifice: 100 } },
                message:
                    "Every broken shard disintegrates in a blinding flash of light. That familiar feeling washes over you with every sacrifice. The sharp snap of broken arcana echoes in your mind.",
            },
            {
                name: "shrouded-city",
                unlock: { upgrade: ["arcaneHeart"] },
                message: "The sounds of explorers echo endlessly through the tunnels of the broken city. The eels say they are filled with hope.",
            },
            {
                name: "shrouded-truth",
                unlock: { totalResource: { sacrifice: 9000000000000000 } },
                message: "A team of eels get your attention. They have something from the caverns: it's a book, filled with images of pink crystals.",
            },
        ],

        frigid: [
            {
                name: "frigid-default",
                message: "Giant shards of glassy ice surround you on all sides.",
            },
            {
                name: "frigid-ice-one",
                unlock: { resource: { ice: 20 } },
                message: "You feel tired.",
            },
            {
                name: "frigid-icy-doom",
                unlock: { resource: { ice: 500 } },
                message: "So cold. So hungry. <span class='smallDesc'>So hopeless.</span>",
            },
            {
                name: "frigid-distant-village",
                unlock: { totalResource: { science: 8 } },
                message: "While scanning the horizon, you notice a gap in the ice. You peer through it, and spot something else.",
            },
            {
                name: "frigid-village",
                unlock: { upgrade: ["civilContact"] },
                message:
                    "A small village of squid greets you respectfully. The water in this place is a little warmer, and you hear a quiet, ambient hum.",
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
