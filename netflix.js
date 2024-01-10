//constants
const apikey = "268cc85a274d734494240b881b8f4d87";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyByJBdIWl0V5PkXnCdUhZlr7ykjE8UuKdY`
    
}

//what all operations are going to be performed
function init() {
    buildTrendingCat()
    fetchAndBuildAllSections()
    //fetchAndBuilAdllMovies() 
}
//retrieve all the possible genres of movies available
function buildTrendingCat(){
    buildSingleMovieSection(apiPaths.fetchTrending,"Trending Now")
    .then(list=>{
        const randomIndex = parseInt(Math.random() * list.length);
        buildBanner(list[randomIndex]);
    })
    .catch(err=>{console.error(err)
    })
}
function buildBanner(film){
    console.log(film.title)
    const bannerContainer = document.getElementById('banner-section');
    bannerContainer.style.backgroundImage = `url(${imgPath}${film.backdrop_path})`

    const div=document.createElement('div')
    div.innerHTML=`<h2 class="banner-title">${film.title}</h2>
    <p class="banner-info">Trending in movies | Released - ${film.release_date} </p>
    <p class="banner-overview">${film.overview && film.overview.length > 200 ? film.overview.slice(0,200).trim()+ '...':film.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>Play</button>
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> More Info</button>
    </div>`
    div.className="banner-content container"
    bannerContainer.append(div)
}
function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res=> res.json())
    .then(res=>{
        const catagories=res.genres
        if(Array.isArray(catagories) && catagories.length)
        {
            catagories.slice(0,6).forEach(cat=>{
                buildSingleMovieSection(apiPaths.fetchMoviesList(cat.id),cat.name)
            })
        }
    })
    .catch(err=>console.log(err))
}
//return or build a movie row of that particular genre one at a time
function buildSingleMovieSection(movieUrl,catagory){
    return fetch(movieUrl)
    .then(res=>res.json())
    .then(res=>{    
        const movies=res.results;
        if(Array.isArray(movies) && movies.length)
        {
            fetchAndBuildAllMovies(movies.slice(0,6),catagory)
        }
        return movies;
    })
    .catch(err=>console.log(err))   
}
//build all movies from that single catagory
function fetchAndBuildAllMovies(movies_list,catagory) {

    //create all catagories container
    const moviesCont = document.getElementById('movies-cont');

    //creating list of all movies for that catagory
    const movielist = movies_list.map(item=>{
        return `<div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
        <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('')

    //create a particular catagory section which consists of movie catagory and all its movies
    const movieSection=
    `<h2 class="movie-section-heading">${catagory}<span class="explore-nudge">explore all</span></h2>
    <div class="movie-row">${movielist}</div>`
     /* console.log(movieSection)  */

     //add the above section containing 2 things into 1 single section
    const div = document.createElement('div')
    div.className="movie-section";
    div.innerHTML=movieSection;
    /* console.log(div) */

    //appending that section into the movie container
    moviesCont.append(div) 

}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res  .items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}

//when load implement the operations
window.addEventListener('load',function() {
    init();
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})