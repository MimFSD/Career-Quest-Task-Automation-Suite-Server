
const BransCollection = client.db('Jobtask').collection('brand')
const CategoryCollection = client.db('Jobtask').collection('category')



app.get('/products', async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page) - 1;
  const brands = req.query.brands || [];
  const categories = req.query.categories || [];
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);
  const sorting = req.query.sorting
  const search = req.query.search || ''
  const query = {};
  if (search) {
    query.productName = { $regex: search, $options: 'i' };
  }
  const options = {
    sort: {}
  };
  if (sorting === 'acs') {
    options.sort.price = 1;
  } else if (sorting === 'dcs') {
    options.sort.price = -1;
  } else if (sorting === 'date-acs') {
    options.sort.creationDate = 1;
  }
  if (brands.length > 0) {
    query.brandName = { $in: Array.isArray(brands) ? brands : [brands] };
  }
  if (categories.length > 0) {
    query.category = { $in: Array.isArray(categories) ? categories : [categories] };
  }
  if (minPrice || maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }
  const result = await ProductsCollection
    .find(query)
    .sort(options.sort)
    .skip(page * size)
    .limit(size)
    .toArray();
  res.send(result);
});
app.get('/products-count', async (req, res) => {
  const brands = req.query.brands || [];
  const categories = req.query.categories || [];
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
  const search = req.query.search || ''
  const query = {};
  if (search) {
    query.productName = { $regex: search, $options: 'i' };
  }
  if (brands.length > 0) {
    query.brandName = { $in: Array.isArray(brands) ? brands : [brands] };
  }
  if (categories.length > 0) {
    query.category = { $in: Array.isArray(categories) ? categories : [categories] };
  }
  if (minPrice || maxPrice) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  }
  const count = await ProductsCollection.countDocuments(query);
  res.send({ count });
})
//Brands
app.get('/All-brand', async (req, res) => {
  const result = await BransCollection.find().toArray()
  res.send(result)
})