import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel';
import AgGrid from '../Grid/AgGrid';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function SimpleTabs() {
  const [value, setValue] = React.useState(0);

  const tabs = ['All','Completed','Pending'];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
   

  return (
    <div >
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="All Tasks" {...a11yProps(0)} />
          <Tab label="Completed" {...a11yProps(1)} />
          <Tab label="Pending" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <AgGrid currentTab={tabs[value]}></AgGrid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AgGrid currentTab={tabs[value]}></AgGrid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AgGrid currentTab={tabs[value]}></AgGrid>
      </TabPanel>
    </div>
  );
}
