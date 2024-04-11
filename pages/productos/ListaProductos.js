import React, { useState, useEffect } from 'react';
/*import '../../src/styles/listado.css';*/

import Layout from '../../app/layout';


function ListaProductos({ categorias }) {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [edicionProducto, setEdicionProducto] = useState({
    CodigoBarras: '',
    NombreProducto: '',
    Descripcion: '',
    PrecioVenta: '',
    PrecioCosto: '',
    Categoria: '',
    Marca: '',
    StockActual: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [addingNewProduct, setAddingNewProduct] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const responseProductos = await fetch('http://localhost:5000/api/productos');
        if (responseProductos.ok) {
          const dataProductos = await responseProductos.json();
          setProductos(dataProductos);
        } else {
          console.error('Error al obtener los productos');
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }

      try {
        const responseMarcas = await fetch('http://localhost:5000/api/marcas');
        if (responseMarcas.ok) {
          const dataMarcas = await responseMarcas.json();
          setMarcas(dataMarcas);
        } else {
          console.error('Error al obtener las marcas');
        }
      } catch (error) {
        console.error('Error al obtener las marcas:', error);
      }
    };

    obtenerProductos();
  }, []);

  const handleEditarProducto = (producto) => {
    setIsEditing(true);
    setEdicionProducto(producto);
  };
  
  const handleGuardarCambios = async () => {
    try {
      // Verificar si el producto ya existe en la lista
      const productoExistente = productos.find(
        (producto) => producto.CodigoBarras === edicionProducto.CodigoBarras
      );
  
      // Si el producto no existe, considerarlo como una adición de un nuevo producto
      if (!productoExistente) {
        // Realizar solicitud HTTP POST para agregar el nuevo producto
        const response = await fetch('http://localhost:5000/api/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(edicionProducto),
        });
  
        // Manejar la respuesta de la solicitud HTTP
        if (response.ok) {
          console.log('Producto agregado exitosamente');
          obtenerProductos(); // Actualiza la lista de productos después de agregar un nuevo producto
          setIsEditing(false);
          setAddingNewProduct(false);
          setEdicionProducto({
            CodigoBarras: '',
            NombreProducto: '',
            Descripcion: '',
            PrecioVenta: '',
            PrecioCosto: '',
            Categoria: '',
            Marca: '',
            StockActual: '',
          });
        } else {
          console.error('Error al agregar el producto');
        }
      } else {
        // Si el producto ya existe, considerarlo como una actualización y realizar una solicitud HTTP PUT
        const response = await fetch(`http://localhost:5000/api/productos/${edicionProducto.CodigoBarras}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(edicionProducto),
        });
  
        // Manejar la respuesta de la solicitud HTTP
        if (response.ok) {
          console.log('Producto actualizado exitosamente');
          obtenerProductos(); // Actualiza la lista de productos después de actualizar un producto existente
          setIsEditing(false);
          setAddingNewProduct(false);
          setEdicionProducto({
            CodigoBarras: '',
            NombreProducto: '',
            Descripcion: '',
            PrecioVenta: '',
            PrecioCosto: '',
            Categoria: '',
            Marca: '',
            StockActual: '',
          });
        } else {
          console.error('Error al actualizar el producto');
        }
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };
  
  const handleCancelarEdicion = () => {
    setIsEditing(false);
    setAddingNewProduct(false);
    setEdicionProducto({});
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEdicionProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };
  
  const handleAgregarProducto = () => {
    setAddingNewProduct(true);
    setIsEditing(true);
  };
  
  const handleEliminarProducto = async (codigoBarras) => {
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${codigoBarras}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Producto eliminado exitosamente');
        obtenerProductos(); // Actualiza la lista de productos después de eliminar un producto
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };
  

  return (
    <Layout>
    <div>
      <h2>Listado de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Venta</th>
            <th>Precio Costo</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Stock Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.CodigoBarras}>
              <td>{producto.CodigoBarras}</td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <input
                    className="editable-text"
                    type="text"
                    name="NombreProducto"
                    value={edicionProducto.NombreProducto}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.NombreProducto
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <input
                    className="editable-text"
                    type="text"
                    name="Descripcion"
                    value={edicionProducto.Descripcion || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.Descripcion || 'Sin descripción'
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <input
                    className="editable-text"
                    type="number"
                    name="PrecioVenta"
                    value={edicionProducto.PrecioVenta}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.PrecioVenta
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <input
                    className="editable-text"
                    type="number"
                    name="PrecioCosto"
                    value={edicionProducto.PrecioCosto}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.PrecioCosto
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <select
                    className="editable-text"
                    name="Categoria"
                    value={edicionProducto.Categoria}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                ) : (
                  producto.Categoria
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <select
                    className="editable-text"
                    name="Marca"
                    value={edicionProducto.Marca}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.nombre}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  producto.Marca
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <input
                    className="editable-text"
                    type="number"
                    name="StockActual"
                    value={edicionProducto.StockActual}
                    onChange={handleInputChange}
                  />
                ) : (
                  producto.StockActual
                )}
              </td>
              <td>
                {isEditing && edicionProducto.CodigoBarras === producto.CodigoBarras ? (
                  <>
                    <button onClick={handleGuardarCambios}>Guardar</button>
                    <button onClick={handleCancelarEdicion}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditarProducto(producto)}>Editar</button>
                    <button onClick={() => handleEliminarProducto(producto.CodigoBarras)}>Eliminar</button>
                  </>
                )}
              </td>
              
            </tr>
          ))}
          {addingNewProduct && (
            <tr>
              <td>
                <input
                  className="editable-text"
                  type="text"
                  name="CodigoBarras"
                  value={edicionProducto.CodigoBarras}
                  onChange={handleInputChange}
                  placeholder="Código de Barras"
                />
              </td>
              <td>
                <input
                  className="editable-text"
                  type="text"
                  name="NombreProducto"
                  value={edicionProducto.NombreProducto}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                />
              </td>
              <td>
                <input
                  className="editable-text"
                  type="text"
                  name="Descripcion"
                  value={edicionProducto.Descripcion || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción"
                />
              </td>
              <td>
                <input
                  className="editable-text"
                  type="number"
                  name="PrecioVenta"
                  value={edicionProducto.PrecioVenta}
                  onChange={handleInputChange}
                  placeholder="Precio Venta"
                />
              </td>
              <td>
                <input
                  className="editable-text"
                  type="number"
                  name="PrecioCosto"
                  value={edicionProducto.PrecioCosto}
                  onChange={handleInputChange}
                  placeholder="Precio Costo"
                />
              </td>
              <td>
                <select
                  className="editable-text"
                  name="Categoria"
                  value={edicionProducto.Categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((categoria, index) => (
                    <option key={index} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="editable-text"
                  name="Marca"
                  value={edicionProducto.Marca}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione una marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.nombre}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  className="editable-text"
                  type="number"
                  name="StockActual"
                  value={edicionProducto.StockActual}
                  onChange={handleInputChange}
                  placeholder="Stock Actual"
                />
              </td>
              <td>
                <button onClick={handleGuardarCambios}>Agregar</button>
                <button onClick={handleCancelarEdicion}>Cancelar</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!addingNewProduct && (
        <button onClick={handleAgregarProducto}>Agregar Producto</button>
      )}
    </div>  </Layout>
  );
 
}

export default ListaProductos;
