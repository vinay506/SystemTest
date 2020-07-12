import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ModalService } from '../Service/ModalService';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import GridService from '../Service/GridService';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalComponent() {
  const defaultFormData = {
    createdAt:'',
    currentState:'',
    description:'',
    dueDate:'',
    id:'',
    priority:'None',
    title:''
  }

  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(defaultFormData);
  const [actionType, setActionType] = React.useState({});
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');

  useEffect(() => {
    ModalService.getModalVisibility().subscribe(data => {
      setActionType(data.action);
      setOpen(data.open);
    });
    ModalService.getFormData().subscribe(data=> {
      setFormData(data)
    })
  });

  const handleClose = () => {
    setOpen(false);
    setActionType('');
    setFormData(defaultFormData);
  };

  const getTitle = () => {
    return actionType === 'ADD' ? 'Add Todo' : 'Edit Todo';
  }

  const handleChange = (event) => {
    setFormData(prevState => {
      return { ...prevState,priority:event.target.value} 
    })
  }

  function getISODate(){
    const date = new Date();
    const str = date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
    return str;
  }

  const saveOrUpdateForm = () => {
    if(actionType === 'ADD'){
      formData.createdAt = getISODate();
      formData.currentState = 'Open'
      GridService.addRecord(formData);
    }else if(actionType === 'EDIT'){
      GridService.updateRecord(formData);
    }
    handleClose();
  }

  const handleTextFieldChange = (event,field) =>{
    const obj = {};
    obj[field] = event.target.value;
    setFormData(prevState => {
      return { ...prevState,...obj} 
    })
  }

  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="displayFlex">
          <DialogTitle id="alert-dialog-slide-title">{getTitle()}</DialogTitle>
          <CloseIcon style={{margin:'2%',cursor:'pointer'}} onClick={handleClose}></CloseIcon>
        </div>
        <DialogContent>
          <form noValidate autoComplete="off">
            <div className="formTextField">
              <TextField required fullWidth id="standard-required" 
              label="Summary"onChange={(event)=>handleTextFieldChange(event,'title')}  
              defaultValue={formData.title} 
              InputProps={{
                readOnly:actionType === 'VIEW'
              }}/>
            </div>
            <div className="formTextField">
              <TextField required fullWidth multiline
                rowsMax={4} 
                label="Description" defaultValue={formData.description} 
                onChange={(event)=>handleTextFieldChange(event,'description')}
                InputProps={{
                  readOnly: actionType === 'VIEW'
                }}/>
            </div>
            <div className="displayFlex fieldsContainer">
              <div style={{ width: "250px" }}>
                <FormControl >
                  <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={actionType === 'VIEW'}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <TextField
                  id="date"
                  label="Due date"
                  type="date"
                  defaultValue={(formData.dueDate)?formData.dueDate:''}
                  InputLabelProps={{
                    shrink: true,
                    readOnly: actionType === 'VIEW',
                  }}
                  inputProps={{
                    min:new Date()
                  }}
                  onChange={(event)=>handleTextFieldChange(event,'dueDate')}
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {actionType === 'VIEW'?'Close':'Cancel'}
          </Button>
         {actionType !== 'VIEW'&& <Button onClick={saveOrUpdateForm} color="primary">
            {actionType === 'ADD'?'Save':'Update'}
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}