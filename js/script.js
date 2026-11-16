const url = "https://pokeapi.co/api/v2/pokemon?limit=1351";
const listaPokemons = document.getElementById("lista-pokemons");

const tiposPokemon = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Planta",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada"
};

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("Não foi possível acessar a PokéAPI.");
        }
        return response.json();
    })
    .then(data => {
        const promessas = data.results.map((pokemon, index) => {
            const id = index + 1;
            return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then(response => response.json());
        });
        return Promise.all(promessas);
    })
    .then(listaDeDadosPokemons => {
        listaDeDadosPokemons.sort((a, b) => a.id - b.id);

        listaDeDadosPokemons.forEach(dadosPokemon => {
            const card = document.createElement("div");
            card.classList.add("card-pokemon");

            card.dataset.tipos = dadosPokemon.types
                .map(item => item.type.name)
                .join(" ");

            card.dataset.nome = dadosPokemon.name;
            card.dataset.numero = dadosPokemon.id;
            card.dataset.imagem = dadosPokemon.sprites.front_default;
            card.dataset.altura = dadosPokemon.height / 10;
            card.dataset.peso = dadosPokemon.weight / 10;

            const imagem = document.createElement("img");
            imagem.src = dadosPokemon.sprites.front_default;
            imagem.alt = dadosPokemon.name;

            const nome = document.createElement("h3");
            nome.textContent = dadosPokemon.name;

            const numero = document.createElement("p");
            numero.textContent = `Nº ${dadosPokemon.id}`;

            const tipos = document.createElement("div");
            tipos.classList.add("tipos-pokemon");

            dadosPokemon.types.forEach(item => {
                const tipo = document.createElement("span");
                const nomeTipo = item.type.name;

                tipo.textContent = tiposPokemon[nomeTipo] || nomeTipo;
                tipo.classList.add("tipo", `tipo-${nomeTipo}`);
                tipos.appendChild(tipo);
            });

            card.appendChild(imagem);
            card.appendChild(nome);
            card.appendChild(numero);
            card.appendChild(tipos);

            // EVENTO DE CLIQUE PARA ABRIR O MODAL
            card.addEventListener("click", () => {
                document.getElementById("modal-img").src = card.dataset.imagem;
                document.getElementById("modal-nome").textContent = card.dataset.nome.toUpperCase();
                document.getElementById("modal-numero").textContent = `Nº ${card.dataset.numero}`;
                document.getElementById("modal-altura").textContent = `${card.dataset.altura} m`;
                document.getElementById("modal-peso").textContent = `${card.dataset.peso} kg`;

                const modalTipos = document.getElementById("modal-tipos");
                modalTipos.innerHTML = "";
                modalTipos.appendChild(tipos.cloneNode(true));

                const modal = document.getElementById("modal-pokemon");
                if (modal) {
                    modal.classList.add("ativo");
                }
            });

            listaPokemons.appendChild(card);
        });

        filtrarPokemons();
    })
    .catch(error => {
        console.error("Erro ao conectar com a PokéAPI:", error);
    });

const campoPesquisa = document.getElementById("pesquisar-pokemon");
const filtroTipo = document.getElementById("filtro-tipo");
const mensagemVazia = document.getElementById("mensagem-vazia");

function filtrarPokemons() {
    if (!campoPesquisa || !filtroTipo) return;
    
    const pesquisa = campoPesquisa.value.toLowerCase().trim();
    const tipoSelecionado = filtroTipo.value;
    const cards = document.querySelectorAll(".card-pokemon");

    let encontrados = 0;

    cards.forEach(card => {
        const nomePokemon = card.querySelector("h3").textContent.toLowerCase();
        const tipos = card.dataset.tipos.split(" ");

        const correspondeNome = nomePokemon.includes(pesquisa);
        const correspondeTipo = tipoSelecionado === "" || tipos.includes(tipoSelecionado);

        if (correspondeNome && correspondeTipo) {
            card.style.display = "block";
            encontrados++;
        } else {
            card.style.display = "none";
        }
    });

    if (mensagemVazia) {
        mensagemVazia.hidden = encontrados > 0;
    }
}

if (campoPesquisa) campoPesquisa.addEventListener("input", filtrarPokemons);
if (filtroTipo) filtroTipo.addEventListener("change", filtrarPokemons);

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-pokemon");
    const botaoFechar = document.getElementById("fechar-modal");

    if (modal && botaoFechar) {
        botaoFechar.addEventListener("click", () => {
            modal.classList.remove("ativo");
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("ativo");
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                modal.classList.remove("ativo");
            }
        });
    } else {
        console.warn("Aviso: Elemento do modal ou botão de fechar não foram encontrados no HTML.");
    }
});
