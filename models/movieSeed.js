const db = require('./index');

const movies = [
    {
        title: 'Movie 1',
        posterImage: 'Movie1postimage link',
        raiting: 5,
        description: 'this is the first movie'
    },
    {
        title: 'Movie 2',
        posterImage: 'Movie2postimage link',
        raiting: 4,
        description: 'this is the second movie'
    },
    {
        title: 'Movie 3',
        posterImage: 'Movie3postimage link',
        raiting: 1,
        description: 'this is the third movie'
    },
]

async function reloadData() {
    try {
        let deletedMovies = await db.Movie.deleteMany({});

        let reloadPosts = await db.Movie.insertMany(movies);
    } catch (err) {
        console.log(err);
    }
}

reloadData();