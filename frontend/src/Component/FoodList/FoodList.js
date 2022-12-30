import { Box, Card, CardBody, Center, Divider, Editable, EditableInput, EditablePreview, Flex, Grid, GridItem, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Text, Tooltip, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux'
import { fetchUser,fetchFoodDetails, fetchFoodDetailsByUsers } from '../../redux/action'
import calories from '../../Images/calories.png'
import money from '../../Images/money.png'
import { ChevronDownIcon, WarningIcon, WarningTwoIcon} from '@chakra-ui/icons';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import axios from 'axios';

export const FoodList = ({state,fetchUser,fetchFoodDetails,fetchFoodDetailsByUsers}) => {
  const [cookies, setCookie] = useCookies(["user"]);
  const toast = useToast()

  const [isEditSet, setIsEditSet] = useState({status:false,month:'',date:'',key:''})
  useEffect(() => {
    if(window.location.pathname==='/')
      fetchFoodDetails(cookies)
    else{
      fetchFoodDetailsByUsers(cookies,window.location.pathname.split('/')[2])
    console.log('23')}
    console.log('23')


  }, [])

  const deleteEntry=(id)=>{
    axios.delete(`http://localhost:3001/food/${id}/delete`,{
                headers:{
                  jwt: cookies.token
                }
            })
        .then((data)=>{
            console.log(data.data)
            fetchFoodDetailsByUsers(cookies,window.location.pathname.split('/')[2])
            toast({
              title: 'Success',
              description: "Item deleted successfully",
              status: 'success',
              duration: 2000,
              isClosable: true,
            })  
        })
        .catch(error => {          
            console.log(error)
        })
  }
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
        <Flex>
        <Text padding="2"  >{value}</Text>
  {
    state.foodDetails[value].expenseLimitReached && <Tooltip label={<Box><Center fontSize="2xl">Warning!</Center><Text>Monthly expense limit reached </Text></Box>} fontSize='md'>
    <WarningIcon mt='10px' />
  </Tooltip>
  }

        </Flex>
  <Divider />

  {
    Object.keys(state.foodDetails[value].days).map((val,kee)=>(<>
      <Box ml="30px">{val+" "+value.split(' ').splice(0,1).join(' ')}
      {console.log(state.foodDetails[value]['days'][val].calorieLimitReached )}
      {state.foodDetails[value]['days'][val].calorieLimitReached &&<Tooltip label={<Box><Center fontSize="2xl">Warning!</Center><Text>Daily calorie limit reached </Text></Box>} fontSize='md'>
    <WarningTwoIcon ml='5px'/>
  </Tooltip>}
      </Box>
      <Grid templateColumns='repeat(3, 1fr)' gap={6} overflowX='auto' sx={{
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
        Object.keys(state.foodDetails[value]['days'][val]['food']).map((vall,keee)=>(
            
        <Card minW="230px" m="20px">
           {/* <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<MoreVertOutlinedIcon />}/> */}
  <CardBody>
    <Flex>
    {(!isEditSet.status || isEditSet.key!==keee || isEditSet.month!==value || isEditSet.date!==val) &&<Text fontSize='2xl'>{state.foodDetails[value]['days'][val]['food'][vall].name}</Text>}
    {isEditSet.status && isEditSet.key===keee && isEditSet.month===value && isEditSet.date===val &&<Editable defaultValue={state.foodDetails[value]['days'][val]['food'][vall].name}>
  <EditablePreview />
  <EditableInput />
</Editable>}
    <Spacer/>
    <Flex>
    {state.foodDetails[value]['days'][val]['food'][vall].calorie&&<><img src={calories} alt="calories" width='40px'/>
    {(!isEditSet.status || isEditSet.key!==keee || isEditSet.month!==value || isEditSet.date!==val) &&<Text mt='10px'>{state.foodDetails[value]['days'][val]['food'][vall].calorie}</Text>}
    {isEditSet.status && isEditSet.key===keee && isEditSet.month===value && isEditSet.date===val &&<Editable defaultValue={state.foodDetails[value]['days'][val]['food'][vall].calorie}>
  <EditablePreview />
  <EditableInput />
</Editable>}</>}
    {window.location.pathname!=="/"&&<Box position='absolute' top='1' right='-6' ml='20px'>
    <Menu>
  <MenuButton
    px={4}
    py={2}
    width='15'
    transition='all 0.2s'
    borderRadius='30px'
    _hover={{ bg: 'gray.100' }}
    _expanded={{ bg: 'gray.100'}}
    _focus={{ boxShadow: 'outline' }}
    height='7'
    ml='10px'
  >
    <IconButton
    // borderRadius='30px'
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<MoreVertOutlinedIcon/>}/>
  </MenuButton>
  <MenuList>
    <MenuItem onClick={()=>setIsEditSet({status:true,month:value,date:val,key:keee})}>Edit</MenuItem>
    <MenuItem onClick={()=>deleteEntry(state.foodDetails[value]['days'][val]['food'][vall].id)}>Delete</MenuItem>
  </MenuList>
</Menu>
    
    </Box>}
    </Flex>

    </Flex>
    <Flex>
      {console.log(state.foodDetails[value]['days'][val]['food'])}
    <Text mt="12px">{state.foodDetails[value]['days'][val]['food'][vall].date.split(' ').splice(0,3).join(' ')}</Text>
    <Spacer/>
    <Flex>
    <img src={money} alt="price" width="40px"/>
    {(!isEditSet.status || isEditSet.key!==keee || isEditSet.month!==value || isEditSet.date!==val) &&<Text mt="10px">{state.foodDetails[value]['days'][val]['food'][vall].price}</Text>}
    {isEditSet.status && isEditSet.key===keee && isEditSet.month===value && isEditSet.date===val &&<Editable defaultValue={state.foodDetails[value]['days'][val]['food'][vall].price}>
  <EditablePreview />
  <EditableInput />
</Editable>}
    </Flex>
    </Flex>
  </CardBody>
</Card>
))
    }
{/* <Divider orientation='vertical' /> */}
</Grid>        
</>
    ))
  }
  
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
      fetchFoodDetailsByUsers: (cookie,id) => dispatch(fetchFoodDetailsByUsers(cookie,id)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodList)