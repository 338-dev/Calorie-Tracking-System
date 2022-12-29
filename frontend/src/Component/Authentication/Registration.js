import { Box, Button, Center, FormControl, FormLabel, Input, Link, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Joi from 'joi';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/action';
import { useCookies } from 'react-cookie';

const Registration = ({fetchUser,state}) => {
   const navigate=useNavigate()
   const toast = useToast()
   const [cookies, setCookie] = useCookies(["user"]);

   const [form, setForm] = useState({
    name:'',
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
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(30).required()
  });

   const submitForm=()=>{
    setForm({...form,email:form.email.trim().toLowerCase(),name:form.name.trim()})

    const result = schema.validate(form);
  
  console.log(result); 
  const { error } = result;

  if (!error) {
    axios.post('http://localhost:3001/user/register',form)
    .then((data)=>{
      toast({
        title: 'Registered successfully.',
        description: 'you have been registered successfully, you will be automatically loggedIn',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })  
      setTimeout(() => {
        axios.post("http://localhost:3001/user/login", 
        {
            email:form.email,
            password:form.password
        })
        .then((response)=>{

          toast({
            title: 'LoggedIn successfully.',
            description: 'you have been loggedIn successfully',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
            console.log(response.data)
            setCookie('token', response.data.jwt, { path: '/' });
            setCookie('time', new Date().getTime()+1000*5*3600, { path: '/' });
            navigate('/')
      
            
           
          //  fetchUser();
              
            // document.cookie='token=jwt'
            navigate('/')
        }).catch((err)=>{
            console.log(err)
            toast({
              title: 'Error.',
              description: err.response.data.message,
              status: 'error',
              duration: 2000,
              isClosable: true,
            })          
          })                   
    }, 3000);
      
      console.log(data)

    })
    .catch(err=>{
      console.log(err)
      toast({
        title: 'Error.',
        description: err.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })  
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
    return (!state.userLoading && state.userError==="" && cookies.time && cookies.time>new Date().getTime())?(<Navigate to="/" />) :(
      <Center bg='lightblue' minH="100vh">
        <Box>
          <Center bg='white' padding="20px" minWidth='500px' borderRadius='10px'>
          <FormControl w='80%'>
          <Text fontSize='2xl'>Register</Text>
          <FormLabel mt='10px'>Name</FormLabel>
            <Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
            <FormLabel>Email address</FormLabel>
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
            <Text fontSize='sm'>Already registered?<Link onClick={()=>navigate('/login')}>Login</Link> </Text>
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
        fetchUser: () => dispatch(fetchUser()),
      }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Registration)