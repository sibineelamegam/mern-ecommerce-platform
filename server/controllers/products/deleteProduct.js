// deleteProduct.js
import Product from "../../models/Product.js";
import { deleteUploadedFile } from "../../utils/deleteUploadedFile.js";

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);

    // Delete images (will only delete if not used elsewhere)
    if (product.images?.length) {
      for (const image of product.images) {
        await deleteUploadedFile(image);
      }
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export default deleteProduct;
