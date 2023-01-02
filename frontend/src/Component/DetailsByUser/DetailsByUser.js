import { Box, Center, Grid, Link } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchFoodDetails, fetchFoodDetailsByUsers, fetchUser } from '../../redux/action'
import FoodList from '../FoodList/FoodList'
import Navbar from '../Navbar/Navbar'

export const DetailsByUser = ({state,fetchUser}) => {
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate=useNavigate();
  const {id}=useParams();
  
  return (
    <div>
      <Navbar/>
      {state.user.role==='admin'&&<Box backgroundColor="lightgrey" width='70%' margin='auto' borderRadius='0 0 10px 10px'>
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
          <Center >
          <Link onClick={()=>navigate('/')}>
          Home
          </Link>
       
          </Center>
          <Center>
          <Link onClick={()=>navigate('/allusers')}>
          All Users
          </Link>
          </Center>
          <Center>
          <Link onClick={()=>navigate(`/stats/${id}`)}>
          Stats
          </Link>
          </Center>
        </Grid>
      </Box>}
      <FoodList/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return{
      fetchUser: (cookie) => dispatch(fetchUser(cookie)),
      fetchFoodDetails: (cookie) => dispatch(fetchFoodDetails(cookie)),
      fetchFoodDetailsByUsers: (cookie,id) => dispatch(fetchFoodDetailsByUsers(cookie,id)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsByUser)