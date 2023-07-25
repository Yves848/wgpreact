import * as React from "react";
import './Main.css';

import Button from '@mui/material/Button';
import AddLinkIcon from '@mui/icons-material/AddLink';



const Main = () => {
  const [info, setInfo] = React.useState<string>('test');

  const click = () => {
    console.log(window.api);
    const s = window.api.getInfo({});
    setInfo(s);
  }
  return (

    <div>
      <Button variant="contained"
        color="success"
        size="small"
        startIcon={<AddLinkIcon />}
        onClick={click}
      >Test</Button>
      {info}
    </div>
  )
}


export default Main