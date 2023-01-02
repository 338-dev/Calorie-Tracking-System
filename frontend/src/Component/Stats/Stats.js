import { Box, Card, CardBody, Center, CircularProgress, Flex, Grid, Spacer, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { fetchFoodDetails, fetchFoodDetailsByUsers, fetchReportDetailsByUsers, fetchUser } from '../../redux/action'
import Navbar from '../Navbar/Navbar'
import calories from '../../Images/calories.png'
import money from '../../Images/money.png'
import { useParams } from 'react-router-dom'

export const Stats = ({state,fetchReportDetailsByUsers}) => {

  const [cookies, setCookie] = useCookies(["user"]);
  const {id}=useParams()
  console.log(121212112123132)
  
  useEffect(() => {
    console.log(121212112123132)
    // console.log('12dq')
    fetchReportDetailsByUsers(cookies,id)
  }, [])
 
  console.log(state.report)
  
  return(state.reportLoading || state.report.length===0)?(<Center verticalAlign='middle'>
  <CircularProgress isIndeterminate size='100px' thickness='4px' />
  </Center>):(
    <div>
      <Navbar/>
      <Text fontSize='6xl'>Stats of {state.user.name}</Text>
      <Center>
      <Flex gap='3' mt='10'>
        <Box>
          <Text fontSize='2xl'>
          Past Week Entries
          </Text>
        <Card>
  <CardBody>
    <Center>
    <Text fontSize='5xl'>{state.report.pastWeekEntry.length}</Text>
    </Center>
  </CardBody>
</Card>
        </Box>
        <Text fontSize='2xl' mt='45px'>
          V
          </Text>
        <Box>
        <Text fontSize='2xl'>
          Last Past Week Entries
          </Text>
        <Card>
  <CardBody>
     <Center>
    <Text fontSize='5xl'>{state.report.pastPastWeekEntry.length}</Text>
    </Center>
  </CardBody>
</Card>
        </Box>
      </Flex>
      </Center>
      {state.report.pastWeekEntry.length!==0&&<><Text fontSize="3xl" mt="10" ml="5">
Last week Entries  
</Text>

      <Grid templateColumns={`repeat(3, 1fr)`} gap={3} overflowX='auto' mb='20px' sx={{
    '&::-webkit-scrollbar': {
      width: '101px',
      borderRadius: '2px',
      height:'10px',
      backgroundColor: `rgba(0, 0, 0, 0.05)`,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `rgba(0, 0, 0, 0.05)`,
      borderRadius:'30px'
    },
  }}>
      {
        state.report.pastWeekEntry.map((val,key)=>(
          <Box>
        <Card minW="230px" m="20px">
  <CardBody>
    <Flex>
    <Text fontSize='2xl'>{val.name}</Text>
    <Spacer/> 
    <img src={calories} alt="calories" width='40px'/>
    <Text mt="2">{val.calorie}</Text>
    </Flex>
    <Flex>
    <Text mt="2">{val.date.split(' ').splice(0,3).join(' ')}</Text>
    <Spacer/>
    <img src={money} alt="calories" width='40px'/>
    <Text mt="2">{val.price}</Text>
    </Flex>
  </CardBody>
</Card>
          </Box>
        ))
      }
      </Grid></>}

      {state.report.pastPastWeekEntry.length!==0&&<><Text fontSize="3xl" mt="10" ml="5">
Past Last week Entries  
</Text>

      <Grid templateColumns='repeat(3, 1fr)' gap={3} overflowX='auto' mb="20px" sx={{
    '&::-webkit-scrollbar': {
      width: '10px',
      borderRadius: '2px',
      height:'10px',
      backgroundColor: `rgba(0, 0, 0, 0.05)`,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `rgba(0, 0, 0, 0.05)`,
      borderRadius:'30px'
    },
  }}>
      {
        state.report.pastPastWeekEntry.map((val,key)=>(
          <Box>
        <Card minW="230px" m="20px">
  <CardBody>
    <Flex>
    <Text fontSize='2xl'>{val.name}</Text>
    <Spacer/> 
    <img src={calories} alt="calories" width='40px'/>
    <Text mt="2">{val.calorie}</Text>
    </Flex>
    <Flex>
    <Text mt="2">{val.date.split(' ').splice(0,3).join(' ')}</Text>
    <Spacer/>
    <img src={money} alt="calories" width='40px'/>
    <Text mt="2">{val.price}</Text>
    </Flex> 
  </CardBody>
</Card>
          </Box>
        ))
      }
      </Grid></>}

      {state.report.avgCalories&&<><Text fontSize="3xl" mt="10px" ml="20px">
        Last Week average calorie intake
      </Text>
      <Card w="230px" m="20px">
        <CardBody>
        <Text fontSize="3xl">
        {state.report.avgCalories}
      </Text>
        </CardBody>
      </Card></>}
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
      fetchFoodDetailsByUsers: (cookie,id) => dispatch(fetchFoodDetailsByUsers(cookie,id)),
      fetchReportDetailsByUsers: (cookie,id) => dispatch(fetchReportDetailsByUsers(cookie,id)),


    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Stats)