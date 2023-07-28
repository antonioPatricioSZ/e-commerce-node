import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const productReviews = await Product.findById(productId)
    .then(async (produto) => {
      if (produto) {
        return await Review.find({ product: produto._id })
          .then((reviews) => {
            return reviews;
            //console.log('Reviews relacionadas ao produto:', reviews)
          })
          .catch((error) => {
            console.error("Erro ao buscar as reviews:", error);
          });
      } else {
        console.log("Produto não encontrado");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar o produto:", error);
    });

  const singleProduct = await Product.findOne({ _id: productId });

  if (!productReviews) {
    return res.status(404).json({ message: "Product not found" });
  }
  console.log(productReviews);

  const soma = productReviews.reduce((accumulator, currentValue) => {
    return currentValue.rating + accumulator;
  }, 0);

  const media = soma / productReviews.length;

  res.json({
    productReviews: productReviews,
    mediaReviews: media,
    singleProduct: singleProduct,
    qtdReviews: productReviews.length,
  });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await Product.findByIdAndRemove(productId);

  res.json({ message: "Product is removed" });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findByIdAndUpdate(productId, req.body);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product is updated" });
};

export {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProduct,
};
