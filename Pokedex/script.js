// Récupérer les données des Pokémon depuis l'API
fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/100")
  .then(response_obj => response_obj.json())
  .then(pokemons_arr => {
    const loadingTag_elem = document.querySelector(".loading");
    loadingTag_elem.remove();
    const pokemonsGrid_elem = document.querySelector(".pokemons-grid");

    // Parcourir chaque objet Pokémon dans le tableau
    pokemons_arr.forEach(pokemon_obj => {
      // Créer un élément div pour chaque Pokémon
      const pokemonCard_elem = document.createElement("div");
      pokemonCard_elem.classList.add("pokemon-item");

      // Créer un élément p pour l'ID du Pokémon
      const idTag_elem = document.createElement("p");
      idTag_elem.textContent = `N° ${pokemon_obj.id}`;

      // Créer un élément p pour le nom du Pokémon
      const pTag_elem = document.createElement("p");
      pTag_elem.textContent = pokemon_obj.name;

      // Créer un élément img pour le sprite du Pokémon
      const spriteTag_elem = document.createElement("img");
      spriteTag_elem.src = pokemon_obj.sprite;
      spriteTag_elem.alt = pokemon_obj.name;

      // Ajouter les éléments à la carte
      pokemonCard_elem.appendChild(idTag_elem);
      pokemonCard_elem.appendChild(pTag_elem);
      pokemonCard_elem.appendChild(spriteTag_elem);

      
      // Ajouter un gestionnaire d'événements pour afficher les détails du Pokémon
      pokemonCard_elem.addEventListener('click', () => {
        // Sélectionner les éléments de détails dans le HTML
        const idElement = document.querySelector('.pokemon-image .id');
        const nameElement = document.querySelector('.pokemon-image .name');
        const imgElement = document.querySelector('.pokemon-image .pokemon-img');
        
        // Remplir l'ID
        idElement.textContent = `N° ${pokemon_obj.id}`;

        // Remplir le nom
        nameElement.textContent = `${pokemon_obj.name}`;

        // Remplir l'image - créer un élément img si ce n'est pas déjà fait
        if (imgElement.tagName === 'SRC') {
          const newImg = document.createElement('img');
          newImg.src = pokemon_obj.image;
          newImg.alt = pokemon_obj.name;
          newImg.classList.add('pokemon-img');
          imgElement.replaceWith(newImg);
        } else {
          imgElement.src = pokemon_obj.image;
          imgElement.alt = pokemon_obj.name;
        }
     // Remplir les types - afficher les images des types
        const typesElement2 = document.querySelector('.pokemon-image .api-types');
        
        if (typesElement2.tagName === 'SRC') {
          const typesDiv = document.createElement('div');
          typesDiv.classList.add('api-types');
          typesDiv.style.display = 'flex';
          typesDiv.style.gap = '10px';
          typesDiv.style.justifyContent = 'center';
          
          pokemon_obj.apiTypes.forEach(type => {
            const typeImg = document.createElement('img');
            typeImg.src = type.image;
            typeImg.alt = type.name;
            typeImg.title = type.name;
            typeImg.style.width = '50px';
            typeImg.style.height = '50px';
            typesDiv.appendChild(typeImg);
          });
          
          typesElement2.replaceWith(typesDiv);
        } else {
          typesElement2.innerHTML = '';
          typesElement2.style.display = 'flex';
          typesElement2.style.gap = '10px';
          typesElement2.style.justifyContent = 'center';
          
          pokemon_obj.apiTypes.forEach(type => {
            const typeImg = document.createElement('img');
            typeImg.src = type.image;
            typeImg.alt = type.name;
            typeImg.title = type.name;
            typeImg.style.width = '50px';
            typeImg.style.height = '50px';
            typesElement2.appendChild(typeImg);
          });
        }

        // Gérer les évolutions si disponibles
        const idEvolutionElement = document.querySelector('.pokemon-evolution .id-evolution');
        const nameEvolutionElement = document.querySelector('.pokemon-evolution .name-evolution');
        const imgEvolutionElement = document.querySelector('.pokemon-evolution .img-evolution');

        if (pokemon_obj.apiEvolutions && pokemon_obj.apiEvolutions.length > 0) {
          const evolution = pokemon_obj.apiEvolutions[0];
          idEvolutionElement.textContent = `N° ${evolution.pokedexId}`;
          nameEvolutionElement.textContent = ` ${evolution.name}`;
          
          if (imgEvolutionElement.tagName === 'SRC') {
            const newEvolutionImg = document.createElement('img');
            newEvolutionImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.pokedexId}.png`;
            newEvolutionImg.alt = evolution.name;
            newEvolutionImg.classList.add('img-evolution');
            imgEvolutionElement.replaceWith(newEvolutionImg);
          } else {
            imgEvolutionElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.pokedexId}.png`;
            imgEvolutionElement.alt = evolution.name;
          }
        } else {
          idEvolutionElement.textContent = 'Pas d\'évolution';
          nameEvolutionElement.textContent = '';
          if (imgEvolutionElement.tagName !== 'SRC') {
            const srcElement = document.createElement('src');
            srcElement.classList.add('img-evolution');
            imgEvolutionElement.replaceWith(srcElement);
          }
        }
        
      });
  
      // Ajouter l'élément div à la grille
      pokemonsGrid_elem.appendChild(pokemonCard_elem);
    });

// Fonctionnalité de recherche
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    // Fonction de recherche
    function searchPokemon() {
      // Récupère le texte saisi, le met en minuscules et enlève les espaces
      const searchTerm = searchInput.value.toLowerCase().trim();
      // Sélectionne toutes les cartes Pokémon
      const allPokemonCards = document.querySelectorAll('.pokemon-item');

      allPokemonCards.forEach(card => {
        // Récupère le nom du Pokémon (2ème paragraphe)
        const pokemonName = card.querySelector('p:nth-child(2)').textContent.toLowerCase();
        // Récupère l'ID du Pokémon (1er paragraphe) et enlève "id: " du texte
        const pokemonId = card.querySelector('p:nth-child(1)').textContent.toLowerCase().replace('id:', '').trim();

        // Si le champ de recherche est vide, afficher tous les Pokémon
        if (searchTerm === '') {
          card.style.display = 'flex';
        }
        // Sinon, afficher seulement ceux qui correspondent à la recherche
        else if (pokemonName.includes(searchTerm) || pokemonId.includes(searchTerm)) {
          card.style.display = 'flex';
        } 
        // Masquer ceux qui ne correspondent pas
        else {
          card.style.display = 'none';
        }
      });
    }

    // Recherche en temps réel pendant la saisie
    searchInput.addEventListener('input', searchPokemon);

    // Recherche au clic sur le bouton
    searchButton.addEventListener('click', searchPokemon);

    // Recherche avec la touche Entrée
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchPokemon();
      }
    });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des Pokémon:", error);
  });