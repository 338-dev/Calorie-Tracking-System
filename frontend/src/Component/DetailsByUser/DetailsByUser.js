import { Box, Center, Grid, Link } from '@chakra-ui/react'
import { Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchChangedFoodPage, fetchFoodDetails, fetchFoodDetailsByUsers, fetchUser } from '../../redux/action'
import FoodList from '../FoodList/FoodList'
import Navbar from '../Navbar/Navbar'

export const DetailsByUser = ({state,fetchUser,fetchChangedFoodPage,fetchFoodDetailsByUsers}) => {
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate=useNavigate();
  const {id}=useParams();
  let [page, setPage] = useState(1);
  
  const handleChange = (p) => {
      if(p<1 || p>state.totalPages)
      {
        return
      }
      setPage(p);

    // if(!state.isFilterSet)
      fetchFoodDetailsByUsers(cookies,id,p)
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

<nav aria-label="Page navigation example">
  <ul className="pagination">
  <li className="page-item" onClick={()=>handleChange(page-1)}><a className="page-link" style={{'cursor':'pointer'}}>Previous</a></li>
    {
      Array.from({length: state.totalPages}, (_, i) => i + 1).map((value,key)=>(
        <li className="page-item" key={key} onClick={()=>{handleChange(value)}}><a className="page-link" style={{'cursor':'pointer'}}>{value}</a></li>
      ))
    }
    <li className="page-item" style={{'cursor':'pointer'}} onClick={()=>handleChange(page+1)}><a className="page-link">Next</a></li>
  </ul>
</nav>
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
      fetchFoodDetailsByUsers: (cookie,id,pg) => dispatch(fetchFoodDetailsByUsers(cookie,id,pg)),
      fetchChangedFoodPage: (page)=>dispatch(fetchChangedFoodPage(page)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsByUser)