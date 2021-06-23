import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserApi } from "../../actions/user";
import ProfileEditForm from "./ProfileEditForm";
function Profile() {
  const { currentUser } = useSelector(st => st.user);
  const dispatch = useDispatch();

  const updateUser = async (username, data) => {
    const updateCurrUser = updateUserApi(username, data);
    await updateCurrUser(dispatch);
  };
  return (
    <div>
      <ProfileEditForm user={currentUser} updateUser={updateUser} />
    </div>
  );
}

export default Profile;
