 import { Box, Center,Button, Grid, GridItem, Input, Link, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import CreateModal from '../CreateModal/CreateModal'
import FoodList from '../FoodList/FoodList'
import Navbar from '../Navbar/Navbar'
import Joi from 'joi';
import {CloseIcon, LinkIcon, SearchIcon} from '@chakra-ui/icons'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { fetchChangedFoodPage, fetchFilteredFoodDetails, fetchFilterIsSet, fetchFoodDetails, fetchUser } from '../../redux/action'
import { useNavigate } from 'react-router-dom'
// import { Pagination } from 'antd';
// import Pagination from "@mui/material/Pagination"
import ReactPaginate from 'react-paginate'
import InviteFriend from '../InviteFriend/InviteFriend'
// import {Button} from '@mui/material';


export const Home = ({state,fetchFilteredFoodDetails,fetchFoodDetails,fetchChangedFoodPage,fetchFilterIsSet}) => {
  const navigate=useNavigate();
  const [DateFilter, setDateFilter] = useState({
    startDate:'',
    endDate:''
  })

  let [page, setPage] = useState(1);

  const schema = Joi.object({
    startDate: Joi.date().max(DateFilter.endDate!==''?DateFilter.endDate:new Date()).required(),
    endDate: Joi.date().min(DateFilter.startDate!==''?DateFilter.startDate:new Date()).max(new Date()).required(),
  });

  const [cookies, setCookie] = useCookies(["user"]);
    const toast = useToast()
    const handleChange = (p) => {
      console.log(p)
      console.log(state)
      if(p<1 || p>state.totalPages)
      {
        return
      }
      setPage(p);
      if(!state.isFilterSet){
        fetchFoodDetails(cookies,p)
        fetchChangedFoodPage(p)
        console.log('p')
        console.log(p)

      }
      else{
        fetchFilteredFoodDetails(cookies,DateFilter,p)
        fetchChangedFoodPage(p)
      }
    }
  
  const saveDetails=()=>{
    console.log(DateFilter.startDate)
    const result = schema.validate(DateFilter);

console.log(result); 
const { error } = result;

if (!error) {
console.log('result');  

    fetchFilteredFoodDetails(cookies,DateFilter,1)
    toast({
      title: "Showing filtered items",
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
}
else{
  toast({
    title: error.message,
    status: 'error',
    duration: 2000,
    isClosable: true,
  })
}
}

const clearFilter=()=>{
  if(DateFilter.startDate==='' || DateFilter.endDate==='')
  {
    toast({
      title: "Filter already cleared",
      status: 'error',
      duration: 2000,
      isClosable: true,
    })
    return
  }
  setDateFilter({
    startDate:'',
    endDate:''
  })
  fetchFoodDetails(cookies,1)
  fetchFilterIsSet(false)

}

  console.log(DateFilter)
  return (
    <div>
      <Navbar/>
      {state.user.role==='admin'&&<Box backgroundColor="lightgrey" width='70%' margin='auto' borderRadius='0 0 10px 10px'>
        <Grid templateColumns='repeat(2, 1fr)' gap={6}>
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
        </Grid>
      </Box>}
      <Box mt="3" ml="3">
          <InviteFriend/>
        </Box>
      <Center>
       
      <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='20px'>
  <GridItem w='100%' h='10'>
  <Input
      placeholder="Select Date and Time"
      size="md"
      type="date"
      value={DateFilter.startDate}
      onChange={(e)=>{setDateFilter({...DateFilter,startDate:e.target.value})}}     />
    </GridItem>
    <GridItem w='100%' h='10'>
  <Input
      placeholder="Select Date and Time"
      size="md"
      type="date"
      value={DateFilter.endDate}
      onChange={(e)=>{setDateFilter({...DateFilter,endDate:e.target.value})}}
      />
    </GridItem>
    </Grid>  
</Center>
<Center mb="5">
  <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='20px'>
  
    <Button width="10px" borderRadius="20px" onClick={saveDetails}>
    <SearchIcon/>
    
    </Button>
    <Button width="10px" borderRadius="20px" onClick={clearFilter}>
    <CloseIcon/>
    </Button>
  </Grid>
</Center>
<CreateModal/>
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
      fetchFoodDetails: (cookie,pg) => dispatch(fetchFoodDetails(cookie,pg)),
      fetchFilteredFoodDetails: (cookie,filterDates,pg) => dispatch(fetchFilteredFoodDetails(cookie,filterDates,pg)),
      fetchChangedFoodPage: (page)=>dispatch(fetchChangedFoodPage(page)),
      fetchFilterIsSet: (event)=>dispatch(fetchFilterIsSet(event)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)