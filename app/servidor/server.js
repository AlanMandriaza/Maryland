const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Permitir solicitudes desde cualquier origen
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Construye la ruta absoluta al archivo config.json
const configPath = path.join(__dirname, '..', '..', 'config.json');

// Lee el contenido del archivo config.json
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Crear una nueva conexión a la base de datos
const pool = mysql2.createPool(config.db);

// Endpoint para obtener los productos
app.get('/api/productos', async (req, res) => {
  const sql = `SELECT * FROM Productos`;
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(sql);
    connection.release(); // Liberar la conexión después de usarla
    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Endpoint para agregar un nuevo producto
app.post('/api/productos', async (req, res) => {
  const { CodigoBarras, NombreProducto, Descripcion, PrecioVenta, PrecioCosto, Categoria, Marca, StockActual, Imagen } = req.body;

  try {
    // Verificar si el producto ya existe
    const existeProducto = await existeProductoEnBD(CodigoBarras);
    if (existeProducto) {
      return res.status(400).json({ error: 'El producto ya existe' });
    }

    const sql = `
      INSERT INTO Productos (CodigoBarras, NombreProducto, Descripcion, PrecioVenta, PrecioCosto, Categoria, Marca, StockActual, Imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [CodigoBarras, NombreProducto, Descripcion, PrecioVenta, PrecioCosto, Categoria, Marca, StockActual, Imagen];

    const connection = await pool.getConnection();
    await connection.query(sql, values);
    connection.release();

    res.status(201).json({ mensaje: 'Producto agregado correctamente' });
  } catch (err) {
    console.error('Error al agregar el producto:', err);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Endpoint para eliminar un producto por su código de barras
app.delete('/api/productos/:codigoBarras', async (req, res) => {
  const codigoBarras = req.params.codigoBarras;
  const sql = `DELETE FROM Productos WHERE CodigoBarras = ?`;
  try {
    const connection = await pool.getConnection();
    await connection.query(sql, [codigoBarras]);
    connection.release(); // Liberar la conexión después de usarla
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar el producto:', err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Endpoint para obtener un producto por su código de barras
app.get('/api/productos/:codigoBarras', async (req, res) => {
  const codigoBarras = req.params.codigoBarras;
  const sql = `SELECT * FROM Productos WHERE CodigoBarras = ?`;
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(sql, [codigoBarras]);
    connection.release(); // Liberar la conexión después de usarla
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener producto por código de barras:', err);
    res.status(500).json({ error: 'Error al obtener producto por código de barras' });
  }
});

// Endpoint para obtener las categorías
app.get('/api/categorias', async (req, res) => {
  const sql = `SELECT DISTINCT Categoria FROM Productos`;
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(sql);
    connection.release(); // Liberar la conexión después de usarla
    const categorias = results.map((row) => row.Categoria);
    res.status(200).json(categorias);
  } catch (err) {
    console.error('Error al obtener las categorías:', err);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});


// Endpoint para crear o modificar un producto
app.put('/api/productos/:codigoBarras', async (req, res) => {
  const codigoBarras = req.params.codigoBarras;
  const { NombreProducto, Descripcion, PrecioVenta, PrecioCosto, Categoria, Marca, StockActual, Imagen } = req.body;
  
  try {
    const sql = `
      UPDATE Productos
      SET NombreProducto = ?, Descripcion = ?, PrecioVenta = ?, PrecioCosto = ?, Categoria = ?, Marca = ?, StockActual = ?, Imagen = ?
      WHERE CodigoBarras = ?`;
    const values = [NombreProducto, Descripcion, PrecioVenta, PrecioCosto, Categoria, Marca, StockActual, Imagen, codigoBarras];

    const connection = await pool.getConnection();
    await connection.query(sql, values);
    connection.release();

    res.status(200).json({ mensaje: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar el producto:', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Función para verificar si un producto ya existe en la base de datos
async function existeProductoEnBD(codigoBarras) {
  const sql = `SELECT COUNT(*) AS count FROM Productos WHERE CodigoBarras = ?`;
  const connection = await pool.getConnection();
  const [results] = await connection.query(sql, [codigoBarras]);
  connection.release(); // Liberar la conexión después de usarla
  return results[0].count > 0;
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
