import { authService, storageService, dbService } from 'myBase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const EditProfile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [userImg, setUserImg] = useState(userObj.photoURL);
  const [userBackGround, setUserBackGround] = useState("")
  const [toggleBack, setToggleBack] = useState(false);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };  

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    var user = authService.currentUser;
    if (userObj.displayName !== newDisplayName) {
      await user.updateProfile({
        displayName: newDisplayName,
      });
    }
    let userImgUrl = ""
    if(userObj.photoURL !== userImg){
      const fileRef = storageService.ref().child(`userImg/${userObj.uid}`);
      const response = await fileRef.putString(userImg, "data_url");
      userImgUrl = await response.ref.getDownloadURL();
      await user.updateProfile({ 
        photoURL: userImgUrl,
      });
    }
    if(toggleBack){
      const fileRef = storageService.ref().child(`userBackGround/${userObj.uid}`);
      const response = await fileRef.putString(userBackGround, "data_url");
      const userBackGroundUrl = await response.ref.getDownloadURL();
      setUserBackGround(userBackGroundUrl);
      setToggleBack(false);
    }
    refreshUser();
    await dbService.collection("users").doc(`${userObj.uid}`).set({
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }).then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
    
  };

  const getUserBackGround = async () => {
    let userBackGroundUrl = ""
    const spaceRef = storageService.ref().child(`userBackGround/${userObj.uid}`);
    userBackGroundUrl = await spaceRef.getDownloadURL();
    setUserBackGround(userBackGroundUrl);
  }

  useEffect (() => {
    getUserBackGround();
  }, []);

  const onFileChange = (event) => {
    const {
      target: {files},
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: {result},
      } = finishedEvent;
      setUserImg(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onBackChange = (event) => {
    const {
      target: {files},
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: {result},
      } = finishedEvent;
      setUserBackGround(result);
    };
    reader.readAsDataURL(theFile);
    setToggleBack(true);
  };


  return (
    <div className="container">
      <form onSubmit={onSubmit}  className="profileForm"> 
        <label htmlFor="backGroundImg-file">
          <img src={userBackGround} alt="backGroundImg" style={{width: "99%", height: "200px", overflow: "hidden", objectFit: "cover"}} />
        </label>
        <input 
          id="backGroundImg-file" 
          type="file" 
          accept="image/*" 
          onChange={onBackChange} 
          style={{
            opacity: 0,
          }}
        />
        <label htmlFor="userImg-file">
          <img src={userImg} alt="profileImg" style={{width: "50px", height: "50px", overflow: "hidden", objectFit: "cover"}} />
        </label>
        <input 
          id="userImg-file" 
          type="file" 
          accept="image/*" 
          onChange={onFileChange} 
          style={{
            opacity: 0,
          }}
        />
        <input 
          onChange={onChange} 
          autoFocus 
          type="text" 
          placeholder="Display Name" 
          value={newDisplayName}
          className="formInput" 
        />
        <input 
          type="submit" 
          value="Update Profile"  
          className="formBtn"
          style={{
            marginTop: 10,
          }} 
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default EditProfile;