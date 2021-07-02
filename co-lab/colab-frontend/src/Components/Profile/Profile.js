import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserApi } from "../../actions/user";
import ProfileEditForm from "./ProfileEditForm";
import { Helmet } from "react-helmet";
function Profile() {
  const { currentUser } = useSelector(st => st.user);
  const dispatch = useDispatch();

  const updateUser = async (username, data) => {
    const updateCurrUser = updateUserApi(username, data);
    await updateCurrUser(dispatch);
  };
  return (
    <div>
      <Helmet>
        <title>Colab - Edit {currentUser.username} Profile</title>
      </Helmet>
      <ProfileEditForm user={currentUser} updateUser={updateUser} />
    </div>
  );
}

export default Profile;
