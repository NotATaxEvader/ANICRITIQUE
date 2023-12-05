const Anime = require('../Model/AnimeModel');

// create and save new anime
exports.create = (req,res)=> {
    // validate request
    if(!req.body) { // if empty body when making post request
        res.status(400).send({ message: "Content can not be empty!"});
    }

    // new anime
    const anime = new Anime ({
        jp_title: req.body.jp_title,
        en_title: req.body.en_title,
        synopsis: req.body.synopsis,
        studio: req.body.studio,
        type: req.body.type,
        genre: req.body.genre,
        premiere: req.body.premiere,
        episode_count: req.body.episode_count,
        rating: req.body.rating,
        ave_score: req.body.ave_score,
        image: req.body.image,
        summ: req.body.summ
    })

    // save anime in the database
    anime
        .save(anime)
        .then(data => {
            //res.send(data)
            res.redirect('/add-anime')
        })
        .catch(err =>{
            res.status(500).send({
                message: err.message || "Some error occurred during create operation"
            });
        });
}

// retrieve and return all anime / retrieve and return a single anime
exports.find = (req,res)=>{
    if(req.query.id) {
        const id = req.query.id;

        Anime.findById(id)
            .then(data => {
                if(!data){
                    res.status(404).send({message: "Not found user with id" + id})
                } else{
                    res.send(data)
                }
            })

            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id" + id})
            })
    } else {
        Anime.find()
        .then(anime => {
            res.send(anime)
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Error Occured while retrieveing user information"})
        })
    }
}

// update an anime by anime id
exports.update = (req,res)=>{
    if(!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty"})
    }

    // route: url parameter
    const id = req.params.id;
    Anime.findByIdAndUpdate(id, req.body, {useFindAndModify: false}) 
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update anime with ${id}. Maybe anime is not found`})
            } else {
                res.redirect('/admin')
            }

        })

        .catch(err => {
            res.status(500).send({ message: "Error: Update Anime information"})
        })
    
}   