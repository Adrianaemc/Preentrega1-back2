import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
  async getAll(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;

      let filter = {};
      if (query) {
        filter = {
          $or: [
            { category: query },
            { status: query === 'true' } // permite buscar por disponibilidad
          ]
        };
      }

      const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

      const result = await productService.getProducts(filter, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortOption
      });

      const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
      res.json({
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null,
        nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const product = await productService.getProductById(req.params.pid);
      if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'ID inválido' });
    }
  }

  async create(req, res) {
    const body = req.body;
    try {
      if (Array.isArray(body)) {
        const createdProducts = await productService.createManyProducts(body);
        return res.status(201).json({ message: 'Productos cargados correctamente', products: createdProducts });
      }

      const { title, description, code, price, status = true, stock, category, thumbnails = [] } = body;

      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const newProduct = await productService.createProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      });

      res.status(201).json({ message: 'Producto creado', product: newProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el producto', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await productService.updateProduct(req.params.pid, req.body);
      if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto actualizado', product: updated });
    } catch (error) {
      res.status(500).json({ error: 'ID inválido o error de actualización' });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await productService.deleteProduct(req.params.pid);
      if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'ID inválido o error al eliminar' });
    }
  }
}
