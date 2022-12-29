import { Box, Button, Center, FormControl, FormLabel, Input, Link, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Joi from 'joi';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { fetchUser } from '../../redux/action';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import Home from '../Home/Home';

const Login = ({state,fetchUser}) => {
  const navigate=useNavigate()  
  const toast = useToast()
  const [cookies, setCookie] = useCookies(["user"]);
console.log(cookies)
  const [form, setForm] = useState({
    email:'',
    password:''
   })

   useEffect(() => {
     if(cookies.token && cookies.time)
     {
      if(cookies.time>new Date().getTime())
      {
        fetchUser(cookies);
      }
     }
   }, [])
   
   const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(30).required()
  });

   const submitForm=()=>{
    setForm({...form,email:form.email.trim().toLowerCase()})
    const result = schema.validate(form);
  
  console.log(result); 
  const { error } = result;

  if (!error) {
    axios.post('http://localhost:3001/user/login',form)
    .then((data)=>{
      toast({
        title: 'Loggedin successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })  
      setCookie('token', data.data.jwt, { path: '/' });
      setCookie('time', new Date().getTime()+1000*5*3600, { path: '/' });
      navigate('/')
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
  }

   }
   console.log(state)
  return(!state.userLoading && state.userError==="" && cookies.time && cookies.time>new Date().getTime())?(<Navigate to="/" />) :(
    <Center bg='lightblue' minH="100vh">
      <Box>
        <Center bg='white' padding="20px" minWidth='500px' borderRadius='10px'>
        <FormControl w='80%'>
        <Text fontSize='2xl'>Sign in</Text>
          <FormLabel mt='10px'>Email address</FormLabel>
          <Input type='email' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <FormLabel>Password</FormLabel>
          <Input type='password' value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <Button
            mt={4}
            colorScheme='teal'
            type='submit'
            onClick={()=>submitForm()}
          >
            Submit
          </Button>
          <Text fontSize='sm'>Need an account?<Link onClick={()=>navigate('/register')}>SignUp</Link> </Text>
        </FormControl>
        </Center>
      </Box>
    </Center>
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
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)