let originalSearchOption = ''; // Variable para almacenar la opción de búsqueda original

document.getElementById('searchButton').addEventListener('click', searchMeal);
document.getElementById('searchOptions').addEventListener('change', searchMeal);
document.getElementById('homeButton').addEventListener('click', scrollToTop);

async function searchMeal() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const searchOption = document.getElementById('searchOptions').value;

    // Verificar si el campo de búsqueda está vacío
    if (searchInput === '') {
        alert('Por favor ingrese un término de búsqueda.');
        return;
    }

    let apiUrl = '';

    switch(searchOption) {
        case 'name':
            apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;
            break;
        case 'category':
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInput}`;
            break;
        case 'ingredient':
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`;
            break;
        case 'area':
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchInput}`;
            break;
        default:
            alert('Por favor seleccione una opción de búsqueda válida.');
            return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if(data.meals === null) {
            alert('No se encontraron resultados. Intente con otro término de búsqueda.');
            return;
        }

        // Limpiamos la galería de resultados y la información detallada
        clearResultsGallery();
        clearMealDetails();

        // Guardamos la opción de búsqueda original
        originalSearchOption = searchOption;

        if(searchOption === 'name') {
            // Si la búsqueda es por nombre del plato, mostramos la información detallada
            displayMealDetails(data.meals[0].idMeal);
        } else {
            // Si la búsqueda es por otra opción, mostramos la galería de resultados
            displayResultsGallery(data.meals, searchOption);
        }
    } catch (error) {
        console.error('Error al buscar la información:', error);
        alert('Ocurrió un error al buscar la información. Intente nuevamente más tarde.');
    }
}


function clearMealDetails() {
    const mealInfo = document.getElementById('mealInfo');
    mealInfo.innerHTML = ''; // Limpiamos la información detallada
}

function clearResultsGallery() {
    const gallery = document.getElementById('resultsGallery');
    gallery.innerHTML = ''; // Limpiamos la galería de resultados
}

function displayResultsGallery(meals, searchOption) {
    const gallery = document.getElementById('resultsGallery');

    // Limpiamos cualquier rastro de la información de la categoría anterior
    clearResultsGallery();

    meals.slice(0, 18).forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strMeal}</p>
        `;
        mealCard.addEventListener('click', () => {
            // Limpiamos la información detallada antes de mostrar los detalles del nuevo plato
            clearMealDetails();
            
            // Redirigir la búsqueda a "Nombre del plato" y mostrar la información detallada del plato
            document.getElementById('searchOptions').value = 'name';
            searchMealByName(meal.strMeal);
        });
        gallery.appendChild(mealCard);
    });
}

async function searchMealByName(mealName) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if(data.meals === null) {
            alert('No se encontraron resultados. Intente con otro término de búsqueda.');
            return;
        }

        // Mostramos la información detallada del plato
        displayMealDetails(data.meals[0].idMeal);
    } catch (error) {
        console.error('Error al buscar la información del plato:', error);
        alert('Ocurrió un error al buscar la información del plato. Intente nuevamente más tarde.');
    }
}

async function displayMealDetails(mealId) {
    // Limpiamos la información detallada antes de mostrar los detalles del nuevo plato
    clearMealDetails();

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const meal = data.meals[0];
        const mealInfo = document.getElementById('mealInfo');
        mealInfo.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>Categoría:</h3>
            <p>${meal.strCategory}</p>
            <h3>Área:</h3>
            <p>${meal.strArea}</p>
            <h3>Ingredientes:</h3>
            <ul>
                ${getIngredientsList(meal)}
            </ul>
            <h3>Receta:</h3>
            <p>${meal.strInstructions}</p>
        `;
    } catch (error) {
        console.error('Error al obtener la información del plato:', error);
        alert('Ocurrió un error al obtener la información del plato. Intente nuevamente más tarde.');
    }
}

function getIngredientsList(meal) {
    let ingredients = '';

    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }

    return ingredients;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    location.reload(); // Recargar la página
}
