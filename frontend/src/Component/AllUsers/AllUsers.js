import { Avatar, Box, Card, CardBody, Center, CircularProgress, Flex, Spacer, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchAllUsers, fetchFoodDetails, fetchUser } from '../../redux/action'
import Navbar from '../Navbar/Navbar'
import {ChevronRightIcon, EmailIcon} from '@chakra-ui/icons'

export const AllUsers = ({state,fetchAllUsers}) => {
  const [cookies, setCookie] = useCookies(["user"]);
   const navigate=useNavigate()
  useEffect(() => {
    console.log('ifuwh438w')

    fetchAllUsers(cookies)

    console.log('2313qd2e')
  }, [])
  console.log(state.allUsers)

  return(state.loading)?(<Center verticalAlign='middle'>
  <CircularProgress isIndeterminate size='100px' thickness='4px' />
  </Center>):(state.usersError)?(<Navigate to='/'/>):(<>
    <Navbar/>
    <Text fontSize='5xl' ml='10px'>All Users</Text>

    {
      state.allUsers.map((value,key)=>(
        <Card width='70%' m='auto' mt='10px' key={key} onClick={()=>navigate(`/allusers/${value.id}`)}>
  <CardBody>
    <Flex>
    <Avatar bg='red.500'  />
<Box ml='10px'>
<Text fontSize='3xl'>{value.name}</Text>
  <Text><EmailIcon/>{value.email}</Text>
  </Box>
  <Spacer/>
  <ChevronRightIcon mt='30px'/></Flex>

  </CardBody>
</Card>
      ))
    }
    </>)
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
      fetchFoodDetails: (cookie) => dispatch(fetchFoodDetails(cookie)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers)