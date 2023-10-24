
window.addEventListener("load",run,false);

function run() {
    // Fonction de groupement par décénie
    function groupByDec(tab){

        // def des variables
        let annee_debut = 1928;
        let annee_fin;
        let value = 0;
        let group = [];
        let index = 0;
        let annee = "";
        
        console.log("hey"); //Débogage
    
        // Parcours du tableau par annéee
        for (let i = 0; i < tab.length; i++) {

            if ((tab[i]['year'] == 1931) || (tab[i]['year'] == (annee_debut + 10))){ // Pour finir une décénie
                console.log(tab[i]);//Débogage
    
                annee = `${annee_debut} - ${annee_fin}`;
                console.log(annee);//Débogage
    
                group[index] = {'year': annee, 'count':value}; // Compilation dans le tab de fin
                index++;
                console.log(group);//Débogage
    
                annee_debut = tab[i]['year'];
                value = tab[i]['count'];
                
            } else if (tab[i]['year'] == 2023){ // Pour que le tab ayent jusqu'à 2023
    
                console.log(tab[i]);//Débogage
    
                annee_fin = tab[i]['year'];
                value = value + tab[i]['count'];
    
                annee = `${annee_debut} - ${annee_fin}`;
                console.log(annee);//Débogage
    
                group[index] = {'year': annee, 'count':value};
                index++;
                console.log(group);//Débogage
    
            } else { // Pour les année classique
                annee_fin = tab[i]['year'];
                value = value + tab[i]['count'];
            }
    
        }
    
        //Renvoi du tab des décénie
        return group;
    }
    
    
    
    // Chargement des données depuis le fichier JSON
    d3.json("data.json").then(function(data) {
        // Filtrer les données pour les années de 1928 à 2023
        const filteredData = data.filter(d => d.year_ceremony >= 1928 && d.year_ceremony <= 2023);
    
        console.log(filteredData);
        
        // Grouper les données par année de cérémonie et compter les nominations
        const nominationsByYear = d3.nest()
        .key(d => d.year_ceremony)
        .rollup(v => v.length)
        .entries(filteredData);
        
        console.log(nominationsByYear);
    
        // Convertir les données en un tableau d'objets avec "year" et "count"
        const finalData = nominationsByYear.map(d => ({
          year: parseInt(d.key),
          count: d.value
        }));
    
        const DataDec = groupByDec(finalData);
        
        console.log(DataDec);
      
        // Création du graphique en colonnes
        const svg = d3.select("#bar-chart");
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
      
        const x = d3.scaleBand()
        //   .domain(finalData.map(d => d.year))
          .domain(DataDec.map(d => d.year))
          .range([margin.left, width - margin.right])
          .padding(0.1);
      
        const y = d3.scaleLinear()
        //   .domain([0, d3.max(finalData, d => d.count)])
          .domain([0, d3.max(DataDec, d => d.count)])
          .nice()
          .range([height - margin.bottom, margin.top]);
      
        svg.append("g")
          .selectAll("rect")
        //   .data(finalData)
          .data(DataDec)
          .enter()
          .append("rect")
          .attr("x", d => x(d.year))
          .attr("y", d => y(d.count))
          .attr("width", x.bandwidth())
          .attr("height", d => height - margin.bottom - y(d.count))
          .on("click", handleClick);
      
        svg.append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
        //   .call(d3.axisBottom(x).tickValues(finalData.map(d => d.year)))
          .call(d3.axisBottom(x).tickValues(DataDec.map(d => d.year)))
          .selectAll("text")
          .style("text-anchor", "middle");
      
        svg.append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(5));
      
       // Fonction pour gérer les clics sur les barres
    function handleClick(d) {
      // Effacer le contenu précédent de la section des détails
      const filmDetails = document.getElementById("film-details");
      filmDetails.innerHTML = "";
    
      // Trouver tous les films correspondant à l'année sélectionnée
      const selectedFilms = data.filter(film => film.year_ceremony === d.year);
    
      // Créer une liste non ordonnée pour afficher les détails de tous les films
      const filmList = document.createElement("ul");
    
      selectedFilms.forEach(selectedFilm => {
        const listItem = document.createElement("li");
        listItem.innerHTML = 
        `<p><strong>Année de création:</strong> ${selectedFilm.year_film}</p> 
        <strong>Nom du film:</strong> ${selectedFilm.film}, <strong>Réalisateur(rice) ou Acteur(rise):</strong> ${selectedFilm.name}, <strong>Catégorie:</strong> ${selectedFilm.category}, <strong>Gagnant:</strong> ${selectedFilm.winner ? "Oui" : "Non"}`;
        filmList.appendChild(listItem);
      });
    
      filmDetails.appendChild(filmList);
    }
    
     
      });    
}


