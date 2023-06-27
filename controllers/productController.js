import { Product } from '../models/Product.js'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createProduct = async (req, res) => {
   req.body.user = req.user.userId
   const product = await Product.create(req.body)
   res.status(201).json(product)
}

const getAllProducts = async (req, res) => {
   const products = await Product.find()
   res.json(products)
}

const getSingleProduct = async (req, res) => {
   const { id: productId } = req.params

   const product = await Product.findById(productId)

   if(!product) {
      return res.status(404).json({ message: "Product not found" })
   }

   res.json(product)
   
}

const deleteProduct = async (req, res) => {
   const { id: productId } = req.params

   const product = await Product.findById(productId)

   if(!product) {
      return res.status(404).json({ message: "Product not found" })
   }

   await Product.findByIdAndRemove(productId)

   res.json({ message: "Product is removed" })
   
}

const updateProduct = async (req, res) => {
   const { id: productId } = req.params

   const product = await Product.findByIdAndUpdate(productId, req.body)

   if(!product) {
      return res.status(404).json({ message: "Product not found" })
   }

   res.json({ message: "Product is updated" })

}

const uploadImage = async (req, res) => {

   if(!req.files) {
      return res.status(400).json({ message: "No File Uploaded" })
   }
   console.log(req.files)

   const productImages = req.files.image
   if(!productImages.mimetype.startsWith("image")) {
      return res.status(400).json({ message: "Please upload image" })
   }

   const maxSize = 1024 * 1024
   if(productImages.size > maxSize) {
      return res.status(400).json({ message: "Please upload image 1MB" })
   }

   const name = Date.now().toString() + Math.floor(Math.random() * 100).toString() + path.extname(productImages.name)

   const imagePath = path.join(
      __dirname,
      "../public/uploads/" + `${name}`
   )

   await productImages.mv(imagePath)
   res.json({ image: `/uploads/${name}` })

}


export {
   getAllProducts, 
   getSingleProduct,
   updateProduct,
   deleteProduct,
   createProduct,
   uploadImage
}