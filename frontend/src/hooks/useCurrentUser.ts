// import { useState, useEffect } from 'react';
// import useAxios from './useAxios';

// const useCurrentUser = () => {
//   const [currentUser, setCurrentUser] = useState({});

//   const { data, loading, error, axiosFetch } = useAxios();

//   const getCurrentUser = async () => {
//     try {
//       await axiosFetch({
//         method: 'get',
//         url: '/api/auth/currentuser',
//       });
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//     }
//   };

//   useEffect(() => {
//     getCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       setCurrentUser(data);
//     }
//   }, [loading, data]);

//   return currentUser;
// };

// export default useCurrentUser;
