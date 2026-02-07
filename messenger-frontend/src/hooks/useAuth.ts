import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);

    const loginUserHandler = (credentials: { email: string; password: string }) => {
        dispatch(loginUser(credentials));
    };

    const logoutUser = () => {
        // Call your API to log out the user if necessary
        dispatch(logout());
    };

    useEffect(() => {
        // Check for existing token and fetch user data if necessary
        if (token) {
            // Fetch user data logic here
        }
    }, [token]);

    return { user, token, loginUser: loginUserHandler, logoutUser };
};

export default useAuth;
