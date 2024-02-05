import React, { useState, useEffect } from 'react';
import styles from '../css/targetTeam.module.css';
import { Sidebar } from '../Components/dashboard/Sidebar';
import TargetTeam from '../Components/targetTeam';
import { Modal, Box, Typography, TextField, Checkbox, FormControlLabel, Button } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';




function TeamsPage() {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);

  const handleOpen = () => {
    fetchMembers();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleTeamNameChange = (event) => setTeamName(event.target.value);

  const handleMemberChange = (index) => {
    const newMembers = [...members];
    newMembers[index].checked = !newMembers[index].checked;
    setMembers(newMembers);
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/auth/get-all-users');
      const fetchedMembers = response.data.filter(user => user.roles === 'member').map(member => ({
        id: member.id,
        name: member.fullName,
        checked: false,
      }));
      setMembers(fetchedMembers);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };
  
  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/teams');
      const activeTeams = response.data.filter(team => team.isActive);
      setTeams(activeTeams);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const createTeam = async () => {
    const selectedMemberIds = members.filter(member => member.checked).map(member => member.id);
    const newTeam = { name: teamName, members: selectedMemberIds };

    try {
      await axios.post('http://localhost:4000/api/teams', newTeam);
      fetchTeams();
      handleClose();
  
      // Mostrar la alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Equipo Creado Exitosamente',
        text: 'El equipo se ha creado correctamente.',
      });
    } catch (error) {
      console.error('Error al crear el equipo:', error);
  
      // Mostrar una alerta de error si es necesario
      Swal.fire({
        icon: 'error',
        title: 'Error al Crear el Equipo',
        text: 'Hubo un problema al crear el equipo. Inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleDeleteTeam = (teamId) => {
    // Mostrar Sweet Alert de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de disolver este equipo. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, disolver equipo',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/teams/${teamId}`);
          fetchTeams();
  
          // Mostrar una alerta de éxito después de eliminar el equipo
          Swal.fire({
            icon: 'success',
            title: 'Equipo Disuelto',
            text: 'El equipo ha sido disuelto correctamente.',
          });
        } catch (error) {
          console.error('Error al eliminar el equipo:', error);
  
          // Mostrar una alerta de error si es necesario
          Swal.fire({
            icon: 'error',
            title: 'Error al Disolver el Equipo',
            text: 'Hubo un problema al disolver el equipo. Inténtalo de nuevo más tarde.',
          });
        }
      }
    });
  };


  const addMemberToTeam = async (teamId, memberId) => {
    try {
      const addMemberDto = { teamId, userId: memberId };
      await axios.post(`http://localhost:4000/api/teams/add-member`, addMemberDto);
      fetchTeams();
    } catch (error) {
      console.error('Error al agregar miembro:', error);
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    overflowY: 'auto',
    maxHeight: '300px',
  };

  const checkboxListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '20px',
    overflowY: 'auto',
    maxHeight: '300px',
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <h1>EQUIPOS</h1>
        <button className={styles.botonagregar} onClick={handleOpen}>Agregar</button>
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">Añadir Equipo</Typography>
            <TextField fullWidth label="Nombre del Equipo" value={teamName} onChange={handleTeamNameChange} margin="normal" />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Miembros</Typography>
            <Box sx={checkboxListStyle}>
              {members.map((member, index) => (
                <div key={index} className={styles.checkboxContainer}>
                  <FormControlLabel control={<Checkbox checked={member.checked} onChange={() => handleMemberChange(index)} />} label={<span className={styles.checkboxLabel}>{member.name}</span>} />
                </div>
              ))}
            </Box>
            <Button className={styles.createTeamButton} onClick={createTeam} variant="contained" color="primary">
              Crear Equipo
            </Button>
          </Box>
        </Modal>
        <TargetTeam teams={teams} onDeleteTeam={handleDeleteTeam}  onAddMember={addMemberToTeam} members={members} />
      </div>
    </div>
  );
}

export default TeamsPage;
