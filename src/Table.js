import React, {useEffect, useState} from 'react';
import {db} from './firebase'
import {Container, makeStyles, Button} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    Table: {
        width: "200px",
        // backgroundColor: 'pink',
        height: '200px',
        padding: '0 100px 0 100px',
        border: '3px solid blue'
    },
    containerTable: {
        // backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        height: '500px',
    },
    th: {
        padding: '40px',
        // backgroundColor:'blue',
    }

}))

const Table = () => {
  const [persona, setPersona] = useState([]);
  const [nombrePersona, setNombrePersona] = useState('')
  const [trabajoPersona, setTrabajoPersona] = useState('')
  const classes = useStyles();

  function nuevoRegistro (){
    db.collection('table').add({
      nombre : nombrePersona,
      trabajo: trabajoPersona,
    })
    console.log("datos cargados con exito")
  }

  function handleChangeNombre(e){
    setNombrePersona(e.target.value);
    console.log(nombrePersona); 
  }

  function handleChangeTrabajo(e){
    setTrabajoPersona(e.target.value); 
    console.log(trabajoPersona);
  }

  useEffect(()=>{
    const obtenerDatos = async () => {
        const data = await db.collection('table').get()
        const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
        setPersona(arrayData)
    }
    obtenerDatos()
    });

    const eliminar = async (id) => {
        try {
        await db.collection('table').doc(id).delete()
        const arrayFiltrado = persona.filter(persona => persona.id !== id)
        setPersona(arrayFiltrado)
        } catch (error) {
        console.log(error)
        }
    }                                        
    
  const listaPersonas = persona.length ? persona.map((persona, index)=>{
    return (
      <tr key={index}>
        <td>{persona.nombre}</td>
        <td>{persona.trabajo}</td>
        <td><Button onClick={() => eliminar(persona.id)} variant="contained" color="secondary">Delete</Button></td>    
      </tr>
    ) 
  }) : <thead>
      <tr> 
          <th COLSPAN="4">
          No hay personas nuevas
          </th>
      </tr>
  </thead> ;


    return ( 
        <Container className={classes.containerTable}>
            <div>
                <table className={classes.Table}>
                    <thead>
                        <tr> 
                            <th className={classes.th}>Name</th>
                            <th className={classes.th}>Job</th>
                            <th className={classes.th}>Delete</th>
                        </tr>
                    </thead>
                    {listaPersonas}
                </table>
            </div>
            <div>
                <label htmlFor="nombre">Nombre: <input type="text" name="nombre" onChange={handleChangeNombre}/></label>
                <label htmlFor="apellido">Trabajo: <input type="text" name="apellido" onChange={handleChangeTrabajo}/></label>
                <button onClick={nuevoRegistro}>Añadir registro</button>
            </div>
        </Container>
    );
}
 
export default Table;