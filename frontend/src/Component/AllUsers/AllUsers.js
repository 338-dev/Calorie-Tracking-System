import { Avatar, Box, Card, CardBody, Center, CircularProgress, Flex, Spacer, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchAllUsers, fetchChangedUserPage, fetchFoodDetails, fetchUser } from '../../redux/action'
import Navbar from '../Navbar/Navbar'
import {ChevronRightIcon, EmailIcon} from '@chakra-ui/icons'
import { Pagination } from 'antd'

export const AllUsers = ({state,fetchAllUsers,fetchChangedUserPage}) => {
  const [cookies, setCookie] = useCookies(["user"]);
  let [page, setPage] = useState(1);

   const navigate=useNavigate()
  useEffect(() => {
    console.log('ifuwh438w')
console.log(state)
    fetchAllUsers(cookies,1)

    console.log('2313qd2e') 
  }, [])

  const handleChange = (p) => {
    console.log(state)
    if(p<1 || p>state.totalUsersPages)
      {
        return
      }
    setPage(p);
    fetchAllUsers(cookies,p)
    fetchChangedUserPage(p)
  }
  console.log(state)

  return(state.loading || state.allUsers.length===0)?(<Center verticalAlign='middle'>
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

    
<Center m="10">

<nav aria-label="Page navigation example">
  <ul className="pagination">
  <li className="page-item" onClick={()=>handleChange(page-1)}><a className="page-link" style={{'cursor':'pointer'}}>Previous</a></li>
    {
      Array.from({length: state.totalUsersPages}, (_, i) => i + 1).map((value,key)=>(
        <li className="page-item" key={key} onClick={()=>{handleChange(value)}}><a className="page-link" style={{'cursor':'pointer'}}>{value}</a></li>
      ))
    }
    <li className="page-item" style={{'cursor':'pointer'}} onClick={()=>handleChange(page+1)}><a className="page-link">Next</a></li>
  </ul>
</nav>
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