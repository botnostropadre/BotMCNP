// ======================================================
// CATÁLOGO OFICIAL DE AÇÕES
// COSA NOSTRA
// ======================================================

const ACOES = [

// ==================================================
// PEQUENO PORTE
// ==================================================

{
    chave:
        "companhia_gas",

    nome:
        "Companhia de Gás",

    porte:
        "Pequeno",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Todos de Pistola • GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 6
🚔 Policiais: Obrigatório 8
🚗 Máximo de veículos dos bandidos: 3
🔫 Armamento: Todos de Pistola (GLOCK RAJADA)
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "teatro",

    nome:
        "Teatro",

    porte:
        "Pequeno",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 7 • Máximo 9
🚔 Policiais: 3 a mais que os bandidos
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "auditorio",

    nome:
        "Auditório",

    porte:
        "Pequeno",

    contingente:
        5,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 5
🚔 Policiais: Obrigatório 7
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "yellow_jack",

    nome:
        "Yellow Jack",

    porte:
        "Pequeno",

    contingente:
        3,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 3 • Máximo 5
🚔 Policiais: 2 a mais que os bandidos
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "atom_food",

    nome:
        "Atom Food",

    porte:
        "Pequeno",

    contingente:
        3,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 3
🚔 Policiais: Obrigatório 4
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "comedy_club",

    nome:
        "Comedy Club",

    porte:
        "Pequeno",

    contingente:
        5,

    reservas:
        2,

    armamento:
        "Todos de Pistola",

    resumoRegras:
`👥 Bandidos: Obrigatório 5
🚔 Policiais: Obrigatório 7
🔫 Armamento: Todos de Pistola
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.

📍 DROP FIXO
• Bandidos começam no fundo (parte em amarelo).
• Policiais começam em frente ao estacionamento.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "aeroporto_abandonado",

    nome:
        "Aeroporto Abandonado",

    porte:
        "Pequeno",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 6
🚔 Policiais: Obrigatório 8
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Liberada a rotação dentro do perímetro após o final do balão.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "mergulhador",

    nome:
        "Mergulhador",

    porte:
        "Pequeno",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 6
🚔 Policiais: Obrigatório 8
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• A ação é totalmente TETI CHÃO.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "loja_bebidas",

    nome:
        "Loja de Bebidas",

    porte:
        "Pequeno",

    contingente:
        3,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 3
🚔 Policiais: 4
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos

• A ação é totalmente TETI CHÃO.
• Proibido veículo dentro do perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "ammunation",

    nome:
        "Ammunation",

    porte:
        "Pequeno",

    contingente:
        2,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 2 • Máximo 3
🚔 Policiais: 1 a mais que os bandidos
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos

• Proibido veículo dentro do perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "loja_departamento",

    nome:
        "Loja de Departamento",

    porte:
        "Pequeno",

    contingente:
        3,

    reservas:
        2,

    armamento:
        "Todos de Pistola • exceto GLOCK RAJADA",

    resumoRegras:
`👥 Bandidos: Obrigatório 3 • Máximo 5
🚔 Policiais: 1 a mais que os bandidos
🔫 Armamento: Todos de Pistola • exceto GLOCK RAJADA
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Smokes: Proibidos

• Proibido veículo dentro do perímetro.
• Proibido atirar contra os policiais entrando no perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},
// ==================================================
// MÉDIO PORTE
// ==================================================

{
    chave:
        "petroleo",

    nome:
        "Petróleo",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Obrigatório 9
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 3

• Liberado o HELI DRONE.
• Proibido marcar drop da polícia.
• Proibido veículo dentro do perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "motel",

    nome:
        "Motel",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Somente Submetralhadora",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Máximo 10
🔫 Armamento: Somente Submetralhadora
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 3

• Proibido veículo dentro do perímetro.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "hotel_abandonado",

    nome:
        "Hotel Abandonado",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Obrigatório 9
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 3

• Proibido veículo dentro do perímetro.
• Liberado o HELI DRONE.
• Proibido marcar drop da polícia.
• Essa ação é teti-chão.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "estacionamento_marrom",

    nome:
        "Estacionamento Marrom",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Obrigatório 9
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 3

• Proibido veículo dentro do perímetro.
• Proibido o uso de 2 andares ou mais (TETI CHÃO).
• Proibido o HELI DRONE.
• Somente térreo e subsolo podem ser utilizados.
• Demais andares são proibidos.
• Liberada rotação dentro do perímetro após o final do balão.
• Drop fixo: bandidos começam no fundo, em frente ao posto de gasolina.
• Policiais começam na lateral do estacionamento.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "pink_hotel",

    nome:
        "Pink Hotel",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Obrigatório 9
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 3

• Proibido veículo dentro do perímetro.
• Proibido o uso de 2 andares ou mais (TETI CHÃO).
• Liberado o HELI DRONE.
• Proibido marcar drop da polícia.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "acougue",

    nome:
        "Açougue",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Obrigatório 9
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 4

• Proibido veículo dentro do perímetro.
• Liberada rotação dentro do perímetro após o final do balão da ação.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "life_invader",

    nome:
        "Life Invader",

    porte:
        "Médio",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Somente Pistola",

    resumoRegras:
`👥 Bandidos: Obrigatório 6
🚔 Policiais: Máximo 9
🚗 Veículos dos bandidos: Mínimo 2 • Máximo 3
🔫 Armamento: Somente Pistola
👤 Reféns: Máximo 3
🤝 Negociação: Obrigatória

⚠️ Essa ação é apenas para FUGA.
• É proibido transformar a ação em confronto armado.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "joalheria",

    nome:
        "Joalheria",

    porte:
        "Médio",

    contingente:
        7,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 7
🚔 Policiais: Obrigatório 9
🚗 Veículos dos bandidos: Mínimo 2 • Máximo 3
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Obrigatória
👤 Reféns: Opcional • Máximo 3
💨 Limite de Smoke: 4

• Máximo 4 bandidos dentro e 3 fora.
• Proibido veículo dentro do perímetro.
• Proibido usar o corrimão da escada do metrô para vantagem de glitch.
• Proibido utilizar o interior da Prefeitura.
• Permitidos interiores de Loja de Roupas e Barbearia no perímetro.
• Permitido utilizar o interior do metrô da Joalheria.
• Com atirador, prédios são permitidos.
• Sem atirador, aplica-se teti-chão.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

// ==================================================
// FLEECAS
// ==================================================

{
    chave:
        "fleeca_praia",

    nome:
        "Fleeca Praia",

    porte:
        "Médio",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 6 • Máximo 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Obrigatória
👤 Reféns: Máximo 3
💨 Limite de Smoke: 4

• Proibido veículo dentro do perímetro.
• Começar com 3 dentro do banco.
• Permitido sair do banco ao final do balão.
• Helicóptero policial pode entrar sozinho no perímetro por 2 minutos.
• Após 2 minutos, o restante do contingente policial deve entrar.

REGRAS ESPECÍFICAS:
• Heli Drone obrigatório.
• Proibido dropar ou rotacionar jogadores com o helicóptero.
• Enquanto estiver como Heli Drone, piloto e helicóptero não podem ser alvejados.
• Caso fique abaixo da altura das palmeiras, o helicóptero pode ser alvejado.
• Máximo 3 bandidos na casa da madeira.
• Proibido interior da lojinha de departamento/cofre.
• Proibido polícia ou bandido subir/dropar na montanha perto das casas.
• Essa ação é teti-chão.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "fleeca_rota_68",

    nome:
        "Fleeca Rota 68",

    porte:
        "Médio",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 6 • Máximo 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Obrigatória
👤 Reféns: Máximo 3
💨 Limite de Smoke: 4

• Proibido veículo dentro do perímetro.
• Começar com 3 dentro do banco.
• Permitido sair do banco ao final do balão.
• Helicóptero policial pode entrar sozinho no perímetro por 2 minutos.
• Após 2 minutos, o restante do contingente policial deve entrar.

REGRAS ESPECÍFICAS:
• Proibidos interiores das lojinhas de roupa e departamento.
• Heli Drone obrigatório.
• Proibido dropar ou rotacionar jogadores com o helicóptero.
• Enquanto estiver como Heli Drone, piloto e helicóptero não podem ser alvejados.
• Caso fique abaixo da altura dos postes, o helicóptero pode ser alvejado.
• Essa ação é teti-chão.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "fleeca_life_invader",

    nome:
        "Fleeca Life Invader",

    porte:
        "Médio",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 6 • Máximo 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Obrigatória
👤 Reféns: Máximo 3
💨 Limite de Smoke: 4

• Proibido veículo dentro do perímetro.
• Começar com 3 dentro do banco.
• Permitido sair do banco ao final do balão.
• Helicóptero policial pode entrar sozinho no perímetro por 2 minutos.
• Após 2 minutos, o restante do contingente policial deve entrar.

REGRAS ESPECÍFICAS:
• Proibido o interior da piscina.
• Proibido qualquer tipo de interior dentro do perímetro.
• Com atirador: máximo 3 bandidos em prédios acessíveis com escada.
• Sem atiradores: regras de teti-chão entram automaticamente em vigor.
• Em teti-chão, somente o térreo dos estacionamentos pode ser utilizado.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "fleeca_shopping",

    nome:
        "Fleeca Shopping",

    porte:
        "Médio",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 6 • Máximo 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Obrigatória
👤 Reféns: Máximo 3
💨 Limite de Smoke: 4

• Proibido veículo dentro do perímetro.
• Começar com 3 dentro do banco.
• Permitido sair do banco ao final do balão.
• Helicóptero policial pode entrar sozinho no perímetro por 2 minutos.
• Após 2 minutos, o restante do contingente policial deve entrar.

REGRAS ESPECÍFICAS:
• Proibido o uso do metrô.
• Proibido qualquer tipo de interior/prédio dentro do perímetro.
• Com atirador: máximo 4 bandidos em prédios acessíveis com escada.
• Sem atiradores: regras de teti-chão entram automaticamente em vigor.
• Em teti-chão, somente o térreo dos estacionamentos pode ser utilizado.`,

    imagemPerimetro:
        null,

    ativo:
        true
},

{
    chave:
        "fleeca_chaves",

    nome:
        "Fleeca Chaves",

    porte:
        "Médio",

    contingente:
        6,

    reservas:
        2,

    armamento:
        "Mínimo Submetralhadora • Fuzil opcional",

    resumoRegras:
`👥 Bandidos: Obrigatório 6 • Máximo 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Mínimo Submetralhadora
💥 Fuzil: Opcional
🤝 Negociação: Obrigatória
👤 Reféns: Máximo 3
💨 Limite de Smoke: 4

• Proibido veículo dentro do perímetro.
• Começar com 3 dentro do banco.
• Permitido sair do banco ao final do balão.
• Helicóptero policial pode entrar sozinho no perímetro por 2 minutos.
• Após 2 minutos, o restante do contingente policial deve entrar.

REGRAS ESPECÍFICAS:
• Quando for teti-chão, interiores são proibidos.
• Com atirador: máximo 3 bandidos em prédios acessíveis com escada.
• Máximo 3 bandidos no interior do resort.
• Sem atiradores: regras de teti-chão entram automaticamente em vigor.
• Em teti-chão, somente o térreo dos estacionamentos pode ser utilizado.`,

    imagemPerimetro:
        null,

    ativo:
        true
},


    // ==================================================
    // GRANDE PORTE
    // ==================================================

    // ==================================================
    // NIÓBIO - LABORATÓRIO HUMANE
    // ==================================================

    {
        chave:
            "niobio",

        nome:
            "Nióbio - Laboratório Humane",

        porte:
            "Grande",

        contingente:
            12,

        reservas:
            2,

        armamento:
            "Somente Fuzil • Permitido 01 Shotgun policial/bandido",

        resumoRegras:
`👥 Bandidos: Obrigatório 12
🚔 Policiais: Obrigatório 17
🔫 Armamento: Somente Fuzil
💥 Shotgun: Permitido 01 policial/bandido
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 5

• Proibido marcar a porta que dá acesso à água.
• A água só pode ser acessada para entrar ou sair do túnel.
• Proibido marcar a P2 da escada.
• Só é permitido marcar a partir da porta automática.
• Limite de 04 bandidos no fundo (parte rosa) e quadrado do quebrado (parte azul).
• Proibido permanecer do lado de fora do Nióbio.
• Proibido sair pela P2 para rushar para fora do Nióbio.`,

        imagemPerimetro:
            null,

        ativo:
            true
    },

    // ==================================================
    // BANCO PALETO
    // ==================================================

    {
        chave:
            "banco_paleto",

        nome:
            "Banco Paleto",

        porte:
            "Grande",

        contingente:
            10,

        reservas:
            2,

        armamento:
            "Somente Fuzil",

        resumoRegras:
`👥 Bandidos: Obrigatório 10
🚔 Policiais: Obrigatório 12
🔫 Armamento: Somente Fuzil
🤝 Negociação: Obrigatória
👤 Reféns: Opcional — máximo 4
💨 Limite de Smoke: 5

• Proibido veículo dentro do perímetro.
• Obrigatório manter até 04 jogadores no banco.
• Os outros 06 jogadores permanecem fora.
• No galinheiro, o limite é de 03 jogadores.`,

        imagemPerimetro:
            null,

        ativo:
            true
    },

    // ==================================================
    // BANCO CENTRAL
    // ==================================================

    {
        chave:
            "banco_central",

        nome:
            "Banco Central",

        porte:
            "Grande",

        contingente:
            10,

        reservas:
            2,

        armamento:
            "Somente Fuzil • Permitido 01 Shotgun policial/bandido",

        resumoRegras:
`👥 Bandidos: Obrigatório 10
🚔 Policiais: Obrigatório 12
🚗 Máximo de veículos dos bandidos: 4
🔫 Armamento: Somente Fuzil
💥 Shotgun: Permitido 01 policial/bandido
🤝 Negociação: Obrigatória
👤 Reféns: Máximo 4
💨 Limite de Smoke: 5

• Máximo de 03 bandidos em prédios ou 05 bandidos no chão.
• Proibido veículo dentro do perímetro.
• Proibido ficar em cima do lustre do caracol.
• Proibido ficar em cima dos móveis do escritório no blindado.
• Na negociação: pode retirar os atiradores OU proibir o reposicionamento com helicóptero.
• As duas condições não podem ser utilizadas ao mesmo tempo.`,

        imagemPerimetro:
            null,

        ativo:
            true
    },

    // ==================================================
    // SANDY
    // ==================================================

    {
        chave:
            "sandy",

        nome:
            "Sandy",

        porte:
            "Grande",

        contingente:
            8,

        reservas:
            2,

        armamento:
            "Somente Fuzil",

        resumoRegras:
`👥 Bandidos: Obrigatório 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Somente Fuzil
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 4

• Liberado até 03 pessoas na trincheira.
• Liberado apenas o HELI DRONE.
• Proibido utilizar interiores.
• Proibido utilizar loja de departamento, tatuagem e Ammu-Nation.
• Proibido marcar drop da polícia.
• Proibido veículo dentro do perímetro.`,

        imagemPerimetro:
            null,

        ativo:
            true
    },

    // ==================================================
    // FACULDADE
    // ==================================================

    {
        chave:
            "faculdade",

        nome:
            "Faculdade",

        porte:
            "Grande",

        contingente:
            8,

        reservas:
            2,

        armamento:
            "Somente Fuzil",

        resumoRegras:
`👥 Bandidos: Obrigatório 8
🚔 Policiais: Obrigatório 10
🔫 Armamento: Somente Fuzil
🤝 Negociação: Inexistente
🚫 Reféns: Proibidos
💨 Limite de Smoke: 4

• Liberado o HELI DRONE.
• Liberado ficar 03 pessoas no telhado.
• Proibido marcar drop da polícia.
• Proibido veículo dentro do perímetro.
• Proibido bugar head-glitch.`,

        imagemPerimetro:
            null,

        ativo:
            true
    }

];

module.exports = {
    ACOES
};