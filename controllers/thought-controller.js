// Importing Thought and User models 
const {Thought, User} = require('../models');


// Controller for thoughts
const thoughtController = {
    // Get all thoughts
    getAllThoughts(req,res) {
        Thought.find({})
        // sorting by id
       .sort({_id: -1})
       .then(dbThoughtData => res.json(dbThoughtData))
       .catch(err => {
           console.log(err);
           res.satuts(500).json(err);
       });
    },
   
    // Get thoughts by id
    getThoughtById({params}, res) {
        Thought.findout({_id: params.id})
           .populate({
               path: 'reactions',
               select: '-__v'
           })

           .select('-__v')
           .then(dbThoughtData => {
               if(!dbThoughtData) {
                   res.satuts(404).json({message: 'No thought found with this id'});
               }
               res.json(dbThoughtData)
           })
           .catch(err => {
               console.log(err);
               res.satuts(400).json(err)
           });
    },


    // Create thought
   createThought({params, body}, res) {
       Thought.create(body)
            .then(({_id}) => {
                return User.findOneAndUpdate (
                    {_id: params.userId},
                    {$push: {thoughts: _id}},
                    {new: true, runValidators: true}
                );
            })
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.satuts(404).json({message: 'No thought found with this '})
                }
            })
   },
 
   // Find thought and update
   updateThought({params, body}, res) {
       Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
            .populate ({
                path: 'reactions',
                select: '-__v'
            })

            .select('-__v')
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.satuts(404).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.satuts(400).json(err));

        },
     
   // Create rection
   addReaction({params, body}, res) {
       Thought.findOneAndUpdate(
           {_id: params.thoughtId},
           {$push: {reactions: body}},
           {new: true, runValidators: true}
       )
       .populate({
           path: 'reactions',
           select: '-__v'
       })
       .select('-__v')
       .then(dbThoughtData => {
           if(!dbThoughtData) {
               res.status(404).json({message:'No thought found with the id'});
            return;
            }
            res.json(dbThoughtData);
       })
       .catch(err => res.status(400).json(err))
   },

   // Find thought and delete
   deleteThought({params}, res) {
       Thought.findOneAndDelete({_id: params.id})
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({message: 'No thought found with this id:'});
                }
            })
            .catch(err => res.status(400).json(err));
   },
  // Find reaction and delete 
    deleReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId }, 
        { $pull: { reactions: { reactionId: params.reactionId }}},
        { new : true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
}


}

// Exporting controller 
module.exports = thoughtController;























