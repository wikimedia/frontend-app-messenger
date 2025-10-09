import { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getAccountService } from '../data/service';

const useLoggedInUser = async () => {
  const user = getAuthenticatedUser();

  if (user) {
    try {
      const profileData = await getAccountService(user.username);
      if (profileData?.profilImage) { return { username: user.username, profileImage: profileData.profileImage }; }
    } catch (error) {
      console.error('Failed to fetch profile image', error);
    }
  }
  return { username: '', profileImage: null };
};

export default useLoggedInUser;
