 import { Box, Button, Center, Grid, GridItem, Input, Link, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import CreateModal from '../CreateModal/CreateModal'
import FoodList from '../FoodList/FoodList'
import Navbar from '../Navbar/Navbar'
import Joi from 'joi';
import {SearchIcon} from '@chakra-ui/icons'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { fetchFilteredFoodDetails, fetchFoodDetails, fetchUser } from '../../redux/action'
import { useNavigate } from 'react-router-dom'

export const Home = ({state,fetchFilteredFoodDetails}) => {
  const navigate=useNavigate();
  const [DateFilter, setDateFilter] = useState({
    startDate:'',
    endDate:''
  })
  const schema = Joi.object({
    startDate: Joi.date().max(DateFilter.endDate!==''?DateFilter.endDate:new Date()).required(),
    endDate: Joi.date().min(DateFilter.startDate!==''?DateFilter.startDate:new Date()).max(new Date()).required(),
  });

  const [cookies, setCookie] = useCookies(["user"]);
    const toast = useToast()
  const saveDetails=()=>{
    console.log(DateFilter.startDate)
    const result = schema.validate(DateFilter);

console.log(result); 
const { error } = result;

if (!error) {
console.log('result');  

    fetchFilteredFoodDetails(cookies,DateFilter)
}
else{
  toast({
    title: error.message,
    status: 'success',
    duration: 2000,
    isClosable: true,
  })
}
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
      <Center>
      <Grid templateColumns='repeat(3, 1fr)' gap={6} mt='20px'>
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
    <Button width="10px" borderRadius="20px" onClick={saveDetails}>
    <SearchIcon/>
    </Button>
</Grid>     
</Center>
<CreateModal/>
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
      fetchFilteredFoodDetails: (cookie,filterDates) => dispatch(fetchFilteredFoodDetails(cookie,filterDates)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)