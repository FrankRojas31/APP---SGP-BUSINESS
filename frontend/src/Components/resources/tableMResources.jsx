import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ModeDeleteIcon from '@mui/icons-material/Delete';
import ModeSearchIcon from '@mui/icons-material/Search';
import DOMPurify from 'dompurify';

import styles from '../../css/Mresources.module.css';
import Swal from 'sweetalert2';
import { sgpApi } from '../../api/sgpApi';

export default function TableMaterialResource() {
  const [searchTerm, setSearchTerm] = useState('');
  const [material, setMaterial] = useState([])

  const mostrarMaterialResources = async () => {

    try {
      const respuesta = await sgpApi.get(`/resources/get-all-material-resources`);
      const arreglo = respuesta.data.map(material => ({
        id: material.id,
        name: material.name,
        description: material.description,
        quantity_available: material.quantity_available
      }));
      setMaterial(arreglo);
    } catch (error) {
      console.error('error al cargar los datos')
    }
  };
  useEffect(() => {
    mostrarMaterialResources();
  }, []);

  const filteredDatos = material.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      mostrarMaterialResources();
    }
  };

  //Acciones 

  const HandleEdit = async (Material) => {
    console.log('Material:', Material);
    try {
      const cantidadOptions = Array.from({ length: 50 }, (_, i) => i + 1)
        .map(value => `<option value="${value}" ${value === Material.quantity_available ? 'selected' : ''}>${value}</option>`)
        .join('');
  
      const result = await Swal.fire({
        title: 'Editar Recurso',
        html: `
          <input id="nombre" class="swal2-input" placeholder="Nombre" value="${Material.name}">
          <input id="descripcion" class="swal2-input" placeholder="Descripcion" value="${Material.description}">
          <select id="cantidad" class="swal2-select">
            ${cantidadOptions}
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const nombre = DOMPurify.sanitize(Swal.getPopup().querySelector('#nombre').value);
          const descripcion = DOMPurify.sanitize(Swal.getPopup().querySelector('#descripcion').value);
          const cantidad = parseFloat(Swal.getPopup().querySelector('#cantidad').value);
          console.log('name:', nombre);
          console.log('description:', descripcion);
          console.log('quantity_available:', cantidad);
  
          try {
            await sgpApi.patch(`/resources/material-resource/${Material.id}`, {
              name: nombre,
              description: descripcion,
              quantity_available: cantidad
            });
            return { nombre, descripcion, cantidad }
          } catch (error) {
            console.error('error al actualizar el recurso:', error);
            Swal.fire('Error', 'Hubo un problema al actualizar el recurso.', 'error');
          }
        },
      });
  
      if (result.isConfirmed) {
        mostrarMaterialResources();
        Swal.fire('Actualizado', 'El miembro ha sido actualizado correctamente.', 'success');
      }
    } catch (error) {
      console.error('Error al abrir el modal de edición:', error);
    }
  };



  const HandleRemove = async (id) => {
    try {
      const result = Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
      });
      if ((await result).isConfirmed) {
        mostrarMaterialResources();
        await sgpApi.delete(`/resources/material-resource/${id}`);
        Swal.fire('Desactivado', 'El recurso ha sido desactivado.', 'success');

      }
    } catch (error) {
      console.error('Error al eliminar el recurso:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el recurso', 'error');
    }
  }


  const handleAgregarClick = async () => {
    try {
      const cantidadOptions = Array.from({ length: 50 }, (_, i) => i + 1)
        .map(value => `<option value="${value}">${value}</option>`)
        .join('');
  
      const result = await Swal.fire({
        title: 'Agregar Recurso Humano',
        html: `
          <input id="nombre" class="swal2-input" placeholder="Nombre">
          <input id="descripcion" class="swal2-input" placeholder="Descripción">
          <select id="cantidad" class="swal2-select">
            ${cantidadOptions}
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const nombre = DOMPurify.sanitize(Swal.getPopup().querySelector('#nombre').value);
          const descripcion = DOMPurify.sanitize(Swal.getPopup().querySelector('#descripcion').value);
          const cantidad = parseFloat(Swal.getPopup().querySelector('#cantidad').value);
  
          try {
            const response = await sgpApi.post('/resources/create-material-resource', {
              name: nombre,
              description: descripcion,
              quantity_available: cantidad
            });
  
            return response.data;
          } catch (error) {
            console.error('Error al agregar el recurso:', error);
            Swal.fire('Error', 'Hubo un problema al agregar el recurso humano.', 'error');
          }
        },
      });
  
      if (result.isConfirmed) {
        mostrarMaterialResources();
        Swal.fire('Agregado', 'El recurso humano ha sido agregado correctamente.', 'success');
      }
    } catch (error) {
      console.error('Error al abrir el modal de agregar:', error);
    }
  };


  return (
    <div className={styles.maincontainer}>
      <div className={styles.toolbar}>
        <div className={styles.box}>
          <form name="search" className={styles.form}>
            <input type="text" className={styles.input}
              value={searchTerm}
              onChange={handleSearchTermChange}
              onKeyDown={handleEnterKeyPress}
              placeholder='Buscar por nombre' />
          </form>
          <i className="fas fa-search"></i>

        </div>
        <div className={styles.contenedor}>
          <button className={styles.botonagregar} onClick={handleAgregarClick}>
            Agregar
          </button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredDatos.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? styles.even : ''}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.quantity_available}</td>
              <td>
                <button className={styles.botoneseyb} onClick={() => HandleEdit(item)}>
                  <ModeEditIcon sx={{ color: '#fff' }} />
                </button>
                <button className={styles.botoneseyb}   onClick={() => HandleRemove(item.id)}>
                  <ModeDeleteIcon style={{ color: '#fff' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const getColorByRole = (role) => {
  switch (role) {
    case 'Gestión del desempeño':
      return '#ff0000';
    case 'Capacitación y desarrollo':
      return '#00ff00';
    case 'Desarrollador':
      return '#0000ff';
    case 'Diseñador':
      return '#ffff00';
    case 'Analista de datos':
      return '#ff00ff';
    case 'Especialista en seguridad informática':
      return '#00ffff';
    case 'Ingeniero de sistemas':
      return '#800080';
    case 'Gerente de proyectos de software':
      return '#008080';
    case 'Especialista en calidad de software':
      return '#ff4500';
    case 'Especialista en integración de sistemas':
      return '#32cd32';
    default:
      return '#000000';
  }
};
