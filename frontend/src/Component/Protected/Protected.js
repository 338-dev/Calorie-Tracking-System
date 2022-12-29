import { Box, Center, CircularProgress } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { fetchUser } from '../../redux/action'
import Home from '../Home/Home'

export const Protected = ({state,Element,fetchUser}) => {
  const navigate=useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);
  
  useEffect(() => {
    // fetchUser()
    if(cookies.token && cookies.time)
     {
      if(cookies.time>new Date().getTime())
      {
        fetchUser(cookies);
      }
      else{
        navigate('/login')
       } 
     }
     else{
      navigate('/login')
    console.log('Element')

     }
    console.log(Element)
  }, [])
  
  return(state.userLoading)?(
    <Center verticalAlign='middle'>
    <CircularProgress isIndeterminate size='100px' thickness='4px' />
    </Center>

  ) :(!state.userLoading && state.userError==="")?(
    <div>{Element}</div>
  ):(state.userError)?(<Navigate to='/login'/>):(<>Protected</>)
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return{
      fetchUser: (cookie) => dispatch(fetchUser(cookie)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Protected)