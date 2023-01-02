import { Box, Center, CircularProgress, Link, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import { fetchAllUsers, fetchUser } from '../../redux/action'
import Home from '../Home/Home'
import { useLocation } from 'react-router-dom';

export const Protected = ({state,Element,fetchUser}) => {
  const navigate=useNavigate();
  let location = useLocation();
  const {id} =useParams()
  const [cookies, setCookie] = useCookies(["user"]);
  console.log(id)
  useEffect(() => {
    // fetchUser()
    console.log(12)
    if(cookies.token && cookies.time)
     {
      if(cookies.time>new Date().getTime())
      {
        // if(location.pathname==='/')
        
        fetchUser(cookies);
        // else if(location.pathname==='/allusers')

      }
      else{
        navigate('/login')
       } 
     }
     else{
      navigate('/login')
    console.log('Element')

     }
    // console.log(Element)
  }, [])

  console.log(state)
  console.log(`/allusers/${id}`)
  
  return(state.userLoading)?(
    <Center verticalAlign='middle'>
    <CircularProgress isIndeterminate size='100px' thickness='4px' />
    </Center>
  ):(!state.userLoading && state.userError==="" && location.pathname==='/')?(
    <div>{Element}</div>
  ):(state.user.role==="admin"&& (location.pathname==='/allusers' || ( id !==undefined && location.pathname===`/allusers/${id}`)||( id !==undefined && location.pathname===`/stats/${id}`)))?(<div>{Element}</div>):(state.userError)?(<Navigate to='/login'/>):(
  <Center>
    <Text fontSize="5xl" mt="70px" > Sorry, You cannot access this route!</Text>
  <Box>
    <Link onClick={()=>navigate('/')}>Back to Homepage</Link> 
  </Box>
  </Center>)
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return{
      fetchUser: (cookie) => dispatch(fetchUser(cookie)),
      fetchAllUsers: (cookie) => dispatch(fetchAllUsers(cookie)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Protected)