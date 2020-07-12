import Box from '@material-ui/core/Box';
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import GridService from '../Service/GridService';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const [groupBy,setGroupBy] = React.useState('none')

  
const handleChange = (event)=> {
  setGroupBy(event.target.value);
  GridService.setGroupBy(event.target.value);

}

  if (value === index) {
    return (
      <div className="tabPanel"
        role="tabpanel"
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box >
          <div style={{ width: '50%', marginBottom: '40px', display: 'flex', justifyContent:'space-between' }}>
            <div>
              <TextField fullWidth
                rowsMax={4}
                label="Filter..."
                onChange={(event) => onFilterTextBoxChanged(event)}
              />
            </div>
            <div style={{ width: "250px" }}>
              <FormControl >
                <InputLabel id="demo-simple-select-label">Group By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={groupBy}
                  onChange={handleChange}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="createdAt">Created On</MenuItem>
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {children}
        </Box>
      </div>
    );
  }
  return '';

}


const onFilterTextBoxChanged = (event) => {
  console.log('onfilter change::', event);
  const value = event.target.value;
  GridService.searchBasedOnkey(value)
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;