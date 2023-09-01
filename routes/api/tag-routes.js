const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    })
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err) 
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
 try {
   const tagData = await Tag.findByPk(req.params.id, {
     where: {
       id: req.body.id
     },
     include: [{ model: Product }]
   })
   if(!tagData){
    res.status(404).json({message: 'There is no tag with this id'})
  }

   res.status(200).json(tagData)

  } catch (err) {
    res.status(500).json(err) 
 }

});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    if(!req.body.hasOwnProperty('tag_name')){
      return res.status(404).json({message: 'You must include a tag_name in the body to create a new tag'})
    }
    const newTag = await Tag.create({
      tag_name: req.body.tag_name
    })
    res.status(200).json(newTag)
  } catch (err) {
    res.status(500).json(err) 
  }


});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
    //Finding previous tag by pk//
  let previousTag = await Tag.findByPk(req.params.id)

 try {
  //Checking to see if the body has a length//
  if(!req.body.hasOwnProperty('tag_name')){
    res.status(404).json({message: 'You must include tag_name in the body when updating a tag'})
    return;
 }
   const updatedTag = await Tag.update({
     tag_name: req.body.tag_name},
     {where: {
       id: req.params.id
     }
   })

   if(previousTag.tag_name===req.body.tag_name){
    return res.status(404).json({message: 'Error: This tag was already updated with the same tag name. Change the tag_name to update again'})
  }
  else if(Tag[0]===0){
    return res.status(404).json({message: 'There is no tag with this id'})
  }

//using previous Category to show which category name was updated in message//
return res.status(200).json({message: `Successfully updated ${previousTag.tag_name} to ${req.body.tag_name}`})


  } catch (err) {
    res.status(500).json(err) 
 }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    if(!deletedTag){
      res.status(404).json({message: 'There is no tag with this id'})
      return;
    }
    res.status(200).json({message: 'Successfully deleted tag'})

  } catch (err) {
    res.status(500).json(err) 
  }
});

module.exports = router;
