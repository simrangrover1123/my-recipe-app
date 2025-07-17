document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '0a994f055a9e491ab6fc160fac836c64';
    if (!apiKey) {
        console.error('API key is not defined.');
        return;
    }
    const randomSection = document.getElementById('random-section');
    const resultsSection = document.getElementById('results-section');
    const inputElement = document.getElementById('ingredient-input');

    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=8`)
        .then(response => {
            if(!response.ok){
                throw new Error('Network response was not okay.')
            }
            return response.json()
        })
        .then(data => {
            const randomRecipes = data.recipes;
            randomSection.innerHTML = ''; 

            const gridContainer = document.createElement('div');
            gridContainer.classList.add('grid-container');
            randomSection.appendChild(gridContainer);

            randomRecipes.forEach(recipe => {
                const card = document.createElement('div');
                card.classList.add('recipe-card');

                const img = document.createElement('img');
                img.src = recipe.image;
                card.appendChild(img);

                const title = document.createElement('h3');
                title.textContent = recipe.title;
                card.appendChild(title);

                const instructionsButton = document.createElement('button');
                instructionsButton.textContent = 'View Instructions';
                instructionsButton.addEventListener('click', () => {
                    displayInstructions(recipe.id);
                    randomSection.style.display = 'none';
                });
                card.appendChild(instructionsButton);

                gridContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching random recipes:', error);
        });

    document.getElementById('search-button').addEventListener('click', searchRecipes);

    inputElement.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission behavior
            searchRecipes();
        }
    });

    function searchRecipes() {
        const input = inputElement.value.trim();

        randomSection.style.display = 'none'; // Hide the random recipes section
        resultsSection.innerHTML = ''; 

        if (input === '') {
            displayMessage('Please enter an ingredient to search for recipes.');
            return;
        }

        const ingredients = input.split(',').map(ingredient => ingredient.trim());
        const queryString = ingredients.join(',');

        fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${queryString}&apiKey=${apiKey}`)
            .then(response => response.json())
            .then(recipes => {
                if (recipes.length === 0) {
                    displayMessage('No recipes found for the given ingredients.');
                } else {
                    const heading = document.createElement('h2');
                    heading.textContent = 'Your search results:';
                    heading.classList.add('results-heading');
                    resultsSection.appendChild(heading);

                    const gridContainer = document.createElement('div');
                    gridContainer.classList.add('grid-container');
                    resultsSection.appendChild(gridContainer);

                    recipes.forEach(recipe => {
                        const card = document.createElement('div');
                        card.classList.add('recipe-card');

                        const img = document.createElement('img');
                        img.src = recipe.image;
                        card.appendChild(img);

                        const title = document.createElement('h3');
                        title.textContent = recipe.title;
                        card.appendChild(title);

                        const instructionsButton = document.createElement('button');
                        instructionsButton.textContent = 'View Instructions';
                        instructionsButton.addEventListener('click', () => {
                            displayInstructions(recipe.id);
                            resultsSection.style.display = 'none';
                        });
                        card.appendChild(instructionsButton);

                        gridContainer.appendChild(card);
                    });
                }

                inputElement.value = ''; // Clear the input field after displaying the results
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
            });
    }


    function displayInstructions(recipeId) {
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(recipe => {
            const popupCard = document.createElement('div');
            popupCard.classList.add('popup-card');

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => {
                popupCard.remove();
                document.getElementById('results-section').style.display = 'block';
                randomSection.style.display = 'block';
            });
            popupCard.appendChild(closeButton);

            const instructionsTitle = document.createElement('h2');
            instructionsTitle.textContent = `Instructions for ${recipe.title}`;
            popupCard.appendChild(instructionsTitle);

            const instructionsContainer = document.createElement('div');
            instructionsContainer.innerHTML = recipe.instructions;
            popupCard.appendChild(instructionsContainer);

            document.body.appendChild(popupCard);
        })
        .catch(error => {
            console.error('Error fetching recipe instructions:', error);
        });
    }
    function displayMessage(message) {
        const resultsSection = document.getElementById('results-section');
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.classList.add('message');
        resultsSection.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 10000);
    }
});
