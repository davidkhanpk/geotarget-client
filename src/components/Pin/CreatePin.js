import React, {useState, useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Content from '../../context';
import axios from 'axios';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations'
import { useClient } from '../../client';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const CreatePin = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)")
  const client = useClient();
  const { state, dispatch } = useContext(Content);
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)
  const handleDeleteDraft = (event) => {
    setTitle("")
    setImage("")
    setContent("")
    dispatch({type: "DELETE_DRAFT"})
  }
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setSubmitting(true)
      // const url = await handleUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: 'https://image.shutterstock.com/image-photo/asphalt-road-leading-into-city-600w-292538198.jpg', content, longitude, latitude}
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables)
      
      handleDeleteDraft()
    }catch(err) { 
      setSubmitting(false);
      console.log(err);
    }
  }
  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "davidkhan");
    const res = await axios.post("https://api.cloudinary.com/v1_1/davidkhan/image/upload", data);
    return res.data.url
  }
  return (
    <form style={{marginTop: mobileSize ? "10px" : "0px"}} className={classes.form}>
      <Typography className={classes.alignCenter} component="h2" variant="h4" color="secondary">
        <LandscapeIcon className={classes.iconLarge}/> Pin Location
      </Typography>
      <div>
        <TextField onChange={e => setTitle(e.target.value)} name="title" label="Title" placeholder="Insert pin title" />
        <input onChange={e => setImage(e.target.files[0])} accept="image/*" type="file" id="image" className={classes.input}/>
        <label htmlFor="image">
          <Button style={{color: image && "green"}} component="span" size="small" className={classes.button} >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField onChange={e => setContent(e.target.value)} name="content" label="Content" multiline rows={mobileSize ? "3" : "6"} margin="normal" fullWidth variant="outlined"></TextField>
      </div>
      <div>
        <Button onClick={handleDeleteDraft} className={classes.button} variant="contained" color="primary" >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button onClick={handleSubmit} disabled={!content.trim() || !image || !title.trim() || isSubmitting} className={classes.button} variant="contained" color="secondary" type ="submit">
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
