import React from 'react';
import './App.css';
import SimpleTabs from './components/Tabs/Tabs';
import Icon from '@material-ui/core/Icon';
import { ModalService } from './components/Service/ModalService';
import ModalComponent from './components/Modal/Modal';
import Notifications from './components/Notification/Notification'

function App() {
  const openDailogBox = ()=>{
    ModalService.setModalVisibility(true,'ADD')
  }

  return (
    <React.Fragment>
      <SimpleTabs></SimpleTabs>
      <div style={{position: 'absolute',right:10, bottom: 5,cursor:'pointer'}} onClick={openDailogBox}>
        <Icon color="primary"  style={{ fontSize: 40 }}>add_circle</Icon>
      </div>
      <Notifications></Notifications>
      <ModalComponent></ModalComponent>
    </React.Fragment>
  );
}

export default App;
