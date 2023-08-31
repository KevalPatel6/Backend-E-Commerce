const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}]
    })
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
    
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
try {
  const categoryData = await Category.findByPk(req.params.id,{
    include: [{model:Product}]
  })
  if(!categoryData){
    res.status(404).json({message: 'There is no category with this id'})
  }
  res.status(200).json(categoryData)
} catch (err) {
  res.status(500).json(err)
}

});

router.post('/', async (req, res) => {
  // create a new category.
  try {
    if(!req.body.hasOwnProperty('category_name')){
      return res.status(404).json({message: 'You must include a category_name in the body to create a category'})
    }
    const newCategory = await Category.create({
      category_name: req.body.category_name
    })
    res.status(200).json(newCategory)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value

    //Finding previous category by pk//
  let previousCategory = await Category.findByPk(req.params.id)

  try {
    //Checking to see if the body has a length//
    if(!req.body.hasOwnProperty('category_name')){
       res.status(404).json({message: 'You must include category_name in the body when updating'})
       return;
    }
       const categoryData = await Category.update({
        category_name: req.body.category_name},
        {
        where: {
          id: req.params.id,
        }
      })
     

       if(categoryData[0]===0){
        return res.status(404).json({message: 'There is no category with this id'})
      }

    //using previous Category to show which category name was updated in message//
    return res.status(200).json({message: `Successfully updated ${previousCategory.category_name} to ${req.body.category_name}`})
    
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
  });
  
  router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      }
    })
    if(!categoryData){
      res.status(404).json({message: 'There is no category with this id'})
      return;
    }
    res.status(200).json({message: 'Successfully deleted category'})
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
