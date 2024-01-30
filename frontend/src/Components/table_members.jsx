import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import styles from '../css/members.module.css';
import defaultImage from '../assets/ppDefault.jpeg';
import Swal from 'sweetalert2';
import Bar from './projects/Bar';

function TablaMiembros({ rows }) {

    const handleBorrarClick = (id) => {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, borrar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
           
            const nuevasFilas = rows.filter((fila) => fila.id !== id);
            setRows(nuevasFilas);
    
            Swal.fire('Borrado', 'El miembro ha sido eliminado correctamente', 'success');
          }
        });
      };
      const handleEditarClick = (id) => {
        const miembro = rows.find((fila) => fila.id === id);
    
        Swal.fire({
          title: 'Editar Miembro',
          html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre" value="${miembro.name}">
            <input id="equipo" class="swal2-input" placeholder="Equipo" value="${miembro.team}">
            <input id="especialidad" class="swal2-input" placeholder="Especialidad" value="${miembro.speciality}">
            <input id="cargo" class="swal2-input" placeholder="Cargo de Trabajo" value="${miembro.job}">
          `,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value;
            const equipo = Swal.getPopup().querySelector('#equipo').value;
            const especialidad = Swal.getPopup().querySelector('#especialidad').value;
            const cargo = Swal.getPopup().querySelector('#cargo').value;
    
            const nuevasFilas = rows.map((fila) => (fila.id === id ? { ...fila, name: nombre, team: equipo, speciality: especialidad, job: cargo } : fila));
            setRows(nuevasFilas);
    
            return true;
          },
        });
      };
    return (
      <>
      <Bar/>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label="caption table">
                <TableHead sx={{ backgroundColor: '#a015e5' }}>
                    <TableRow>
                        <TableCell sx={{ color: '#e3f2fd' }}>#</TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }} align="center">NOMBRE</TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }} align="center">FOTO DE PERFIL</TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }} align="center">EQUIPO</TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }} align="center">ESPECIALIDAD</TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }} align="center">CARGO DE TRABAJO</TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }} align="center">OPCIONES</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row" sx={{ backgroundColor: '#e1c5f0' }}>
                                {row.id}
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#e1c5f0' }} align="center">{row.name}</TableCell>
                            <TableCell sx={{ backgroundColor: '#e1c5f0' }} align="center"><img className={styles.iconpp} src={row.image || defaultImage} alt="Imagen" /></TableCell>
                            <TableCell sx={{ backgroundColor: '#e1c5f0' }} align="center">{row.team}</TableCell>
                            <TableCell sx={{ backgroundColor: '#e1c5f0' }} align="center">{row.speciality}</TableCell>
                            <TableCell sx={{ backgroundColor: '#e1c5f0' }} align="center">{row.job}</TableCell>
                            <TableCell sx={{ backgroundColor: '#e1c5f0' }} align="center">
                                <button className={styles.botoneseyb} onClick={handleEditarClick}><ModeEditIcon sx={{ color: '#fff' }} /></button>
                                <button className={styles.botoneseyb} onClick={handleBorrarClick}><PersonRemoveIcon sx={{ color: '#fff' }} /></button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
}

export default TablaMiembros;
