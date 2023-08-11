import * as React from "react";
import './Main.css';


import Button from '@mui/material/Button';
import AddLinkIcon from '@mui/icons-material/AddLink';
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import Container  from "@mui/material/Container";

const { ipcRenderer } = window.require('electron');

const Main = () => {
  const [info, setInfo] = React.useState<string>('test');
  const [waiting, setWating] = React.useState<boolean>(false);
  const [colName, setColName] = React.useState<string>('');
  ipcRenderer.on('list-result',(event,arg) => {
    setWating(false);
    setInfo(arg.s);
    
  });

  ipcRenderer.on('col', (event, arg) => {
    setColName(arg.name);
    setWating(false);
  })

  const click = () => {
    setWating(true);
    //ipcRenderer.send('list', { test: true });
    ipcRenderer.send('getCol', { col: 'ID' });
  }
  return (
    <Container>
    <Box sx={{ display: 'flex', p: 2, border: '1px dashed grey', flexDirection: "column" }} >
      {waiting &&
        <CircularProgress />
      }
      <Button variant="contained"
        color="success"
        size="small"
        startIcon={<AddLinkIcon />}
        onClick={click}
      >Test</Button>
      {info}<br></br>
      {colName}
    </Box>
    </Container>   
  )
}

export default Main