import { Button, Center, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { AddIcon } from '@chakra-ui/icons'
import Joi from 'joi';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { fetchFoodDetails, fetchUser } from '../../redux/action';

export const CreateModal = ({state,fetchFoodDetails}) => {
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cookies, setCookie] = useCookies(["user"]);
    const toast = useToast()
    const [foodDetails, setFoodDetails] = useState({
      name:'',
      date:'',
      calorie:'',
      price:''
    })
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      date: Joi.date().max(new Date()).required(),
      calorie:Joi.number().min(.01).max(100).allow('').optional(),
      price:Joi.number().min(.02).max(10).required(),
    });
    console.log(foodDetails)

    const clearFoodDetails=()=>{
      setFoodDetails({
        name:'',
        date:'',
        calorie:'',
        price:''
      }) 
    }
    const saveDetails=()=>{
      setFoodDetails({...foodDetails,name:foodDetails.name.trim(),price:Number(foodDetails.price),calorie:Number(foodDetails.calorie),date:new Date(foodDetails.date)})
      const result = schema.validate(foodDetails);
  
  console.log(result); 
  const { error } = result;

  if (!error) {
    axios.post('http://localhost:3001/food/create',foodDetails,{
                  headers:{
                    jwt: cookies.token
                  }
              })
    .then((data)=>{
      toast({
        title: 'food details added successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })  
      onClose()
      fetchFoodDetails(cookies)
      clearFoodDetails()
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
      console.log(err.response.data.message)})
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
    return (
      <>
      <Center mt='10px'>
      <Button onClick={onOpen}><AddIcon/>Add Food Item </Button>
      </Center>
  
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={()=>{onClose(); clearFoodDetails()}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add your item</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <FormControl isRequired>
  <FormLabel>Item name</FormLabel>
  <Input placeholder='Item Name' value={foodDetails.name} onChange={(e)=>setFoodDetails({...foodDetails,name:e.target.value})}/>
  <FormLabel>Item Price</FormLabel>
  <NumberInput defaultValue={0} min={0} precision={2} step={0.02} value={foodDetails.price} onChange={(e)=>setFoodDetails({...foodDetails,price:e})} placeholder='Price'>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>
  <FormLabel>Date</FormLabel>
  <Input
      placeholder="Select Date and Time"
      size="md"
      type="datetime-local"
      value={foodDetails.date} onChange={(e)=>setFoodDetails({...foodDetails,date:e.target.value})}
      disableTimestampAfter={new Date()}
      />
    <FormLabel requiredIndicator={false}>Calorie value</FormLabel>
  <NumberInput precision={2} min={.01} step={0.01} value={foodDetails.calorie} onChange={(e)=>setFoodDetails({...foodDetails,calorie:e})} placeholder='Enter Calorie value' aria-required={false}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>
</FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={()=>saveDetails()}>
                Save
              </Button>
              <Button onClick={()=>{onClose();clearFoodDetails()}}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateModal)