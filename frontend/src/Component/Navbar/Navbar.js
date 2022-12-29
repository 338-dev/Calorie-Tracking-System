import { Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'
import { connect } from 'react-redux'
import AppIcon from '../../Images/calories-calculator.png'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const Navbar = (props) => {
  const navigate=useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const Logout=()=>{
    removeCookie('token')
    removeCookie('time')

    navigate('/login')
  }
  return (
    <Flex bg='white' boxShadow='lg' p='4' rounded='md'>
    <Box >
      <Flex>
      <img src={AppIcon} alt="icon" width={'40px'}/>
      <Text fontSize='2xl'>CalorieTrac</Text>
      </Flex>
    </Box>
    <Spacer/>
    <Button colorScheme='teal' size='lg' onClick={()=>{Logout()}}>
    LogOut
  </Button>
    </Flex>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)