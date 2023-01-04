import { Center, CircularProgress, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import Joi from 'joi'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const FriendInvLogin = () => {
  const navigate=useNavigate()  
  const toast = useToast()
  const [cookies, setCookie] = useCookies(["user"]);
  const [form, setForm] = useState({
    email:'',
    password:''
   })
   const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(30).required()
  });
  useEffect(() => {
    try {
      const emailNdPass=window.location.href.split('/')[4].split('-');

      const details={email:emailNdPass[0].split(':')[1],password:emailNdPass[1].split(':')[1]}
    
    
    const result = schema.validate(details);
  
  console.log(result); 
  const { error } = result;

  if (!error) {
    axios.post('http://localhost:3001/user/login',details)
    .then((data)=>{
      toast({
        title: 'Loggedin successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })  

      // async function settingCookie(){
        setCookie('token', data.data.jwt, { path: '/' });
        setCookie('time', new Date().getTime()+1000*5*3600, { path: '/' });
      // }
      
      // settingCookie.then(()=>{
        navigate('/')
      // }) 
      console.log(data)
    })
    .catch(err=>{
      toast({
        title: 'Error.',
        description: err.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })  
      console.log(err.response.data.message)
      navigate('/login')
    })
  }
  else{
    toast({
      title: 'Error.',
      description: error.message,
      status: 'error',
      duration: 2000,
      isClosable: true,
    })  
    navigate('/login')
  }
} catch (error) {
  toast({
    title: 'Error.',
    description: "Incorrect URL",
    status: 'error',
    duration: 2000,
    isClosable: true,
  }) 
  navigate('/login')
}
  }, [])
  
  return (
    <Center verticalAlign='middle'>
    <Text fontSize="5xl">Logging you in</Text>
    <CircularProgress isIndeterminate size='100px' thickness='4px' />
    </Center>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(FriendInvLogin)