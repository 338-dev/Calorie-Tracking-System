import { Box, Center, Grid, Link } from '@chakra-ui/react'
import { Pagination } from 'antd'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchChangedFoodPage, fetchFoodDetails, fetchFoodDetailsByUsers, fetchUser } from '../../redux/action'
import FoodList from '../FoodList/FoodList'
import Navbar from '../Navbar/Navbar'

export const DetailsByUser = ({state,fetchUser,fetchChangedFoodPage}) => {
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate=useNavigate();
  const {id}=useParams();
  
  const handleChange = (e, p) => {
    // setPage(p);
    // if(!state.isFilterSet)
      fetchFoodDetails(cookies,p)
      fetchChangedFoodPage(p)
    
  }
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
      
<Center m="10">

<Pagination 
  pageSize={5}
  current={state.currentFoodPage}
  total={state.totalPages}
  onChange={handleChange}/>
</Center>

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
      fetchChangedFoodPage: (page)=>dispatch(fetchChangedFoodPage(page)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsByUser)