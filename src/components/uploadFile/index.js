import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { storage } from '../../services/firebase/setup';

const useStyles = makeStyles({
  progress: {
    flexGrow: 1,
  },
  input: {
    width: '100%',
    display: 'none',
  },
});

function UploadFile(props) {

  const { onUpload } = props;
  const classes = useStyles();
  const [completed, setCompleted] = React.useState(0);
  const [isValid, setValid] = React.useState(true);

  const hadleUpload = e => {
    const file = e.target.files[0];
    const sizeMb = file.size / 1048576;

    setValid(true);

    if (sizeMb < 5) {
      const storageRef = storage.ref(`refsCaptures/${file.name}`);
      const task = storageRef.put(file);
  
      task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setCompleted(percentage);
      }, error => {
        console.log(error.message);
      }, () => {
        task.snapshot.ref.getDownloadURL().then(
          downloadURL => {
            onUpload(downloadURL);
          })
      })
    } else {
      setValid(false);
    }
  };

  return (
    <React.Fragment>
      <input
        accept="image/*"
        className={classes.input}
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={hadleUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" fullWidth component="span" className={classes.button}>
          {isValid ? "Subir captura de transferencia. 5mb Max" : "El tamaño de la imágen execede el máximo establecido de 5mb"}
        </Button>
      </label>
      <div className={classes.progress}>
        <LinearProgress variant="determinate" value={completed} />
      </div>
    </React.Fragment>
  )

}

export default UploadFile;