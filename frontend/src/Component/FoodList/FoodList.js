import { Box, Card, CardBody, Center, Divider, Flex, Grid, GridItem, Spacer, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux'
import { fetchUser,fetchFoodDetails } from '../../redux/action'
import calories from '../../Images/calories.png'
import money from '../../Images/money.png'
export const FoodList = ({state,fetchUser,fetchFoodDetails}) => {
  const [cookies, setCookie] = useCookies(["user"]);

  useEffect(() => {
    fetchFoodDetails(cookies)
  }, [])
  console.log(state)
  
  return(Object.keys(state.foodDetails).length===0 && !state.isFilterSet)?(
    <Center mt='100px'>
        <Text fontSize='6xl'>No food has been added yet!</Text>
    </Center>
  ):(Object.keys(state.foodDetails).length===0 && state.isFilterSet===true)?(
    <Center mt='100px'>
        <Text fontSize='6xl'>No entry in given range!</Text>
    </Center>
  ):(
    <Box mt="20px">
    {
      Object.keys(state.foodDetails).map((value,key)=>(<>
        <Divider/>
  <Text padding="2"  >{value}</Text>
  <Divider />
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>

  {
    Object.keys(state.foodDetails[value]).map((val,kee)=>(
      <>
       
      {
        Object.keys(state.foodDetails[value][val]).map((vall,keee)=>(
            
        <Card minW="200px" m="20px">
  <CardBody>
    <Flex>
    <Text fontSize='2xl'>{state.foodDetails[value][val][vall].name}</Text>
    <Spacer/>
    <Flex>
    {state.foodDetails[value][val][vall].calorie&&<><img src={calories} alt="calories" width='40px'/>
    <Text mt='10px'>{state.foodDetails[value][val][vall].calorie}</Text></>}
    </Flex>

    </Flex>
    <Flex>
    <Text>{state.foodDetails[value][val][vall].date}</Text>
    <Spacer/>
    <Flex>
    <img src={money} alt="price" width="40px"/>
    <Text mt="10px">{state.foodDetails[value][val][vall].price}</Text>

    </Flex>
    </Flex>
  </CardBody>
</Card>
))
    }
{/* <Divider orientation='vertical' /> */}
    </>
    ))
  }
  
        </Grid>        
        </>))
    }
    </Box>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodList)