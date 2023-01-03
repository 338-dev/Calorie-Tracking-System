import { Avatar, Box, Card, CardBody, Center, CircularProgress, Flex, Spacer, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchAllUsers, fetchChangedUserPage, fetchFoodDetails, fetchUser } from '../../redux/action'
import Navbar from '../Navbar/Navbar'
import {ChevronRightIcon, EmailIcon} from '@chakra-ui/icons'
import { Pagination } from 'antd'

export const AllUsers = ({state,fetchAllUsers,fetchChangedUserPage}) => {
  const [cookies, setCookie] = useCookies(["user"]);
   const navigate=useNavigate()
  useEffect(() => {
    console.log('ifuwh438w')

    fetchAllUsers(cookies,1)

    console.log('2313qd2e')
  }, [])

  const handleChange = (e, p) => {
    // setPage(p);
    fetchAllUsers(cookies,p)
    fetchChangedUserPage(p)
  }
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

    
<Center mt="10">

<Pagination 
  pageSize={5}
  current={state.currentUserPage}
  total={state.totalUsersPages}
  onChange={handleChange}/>
</Center>

    </>)
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return{
    fetchChangedUserPage: (page)=>dispatch(fetchChangedUserPage(page)),
      fetchUser: (cookie) => dispatch(fetchUser(cookie)),
      fetchAllUsers: (cookie,pg) => dispatch(fetchAllUsers(cookie,pg)),
      fetchFoodDetails: (cookie) => dispatch(fetchFoodDetails(cookie)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers)