import React from "react";
import './Main.css';

import Button from '@mui/material/Button';
import AddLinkIcon from '@mui/icons-material/AddLink';

class Main extends React.Component {
  render() {
    return (

      <div>
        <Button variant="contained"
          color="success"
          size="small"
          startIcon={<AddLinkIcon/>}
        >Test</Button>
       
      </div>
    )
  }
}

export default Main