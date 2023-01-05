import { Box, Button, Center, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AddIcon } from '@chakra-ui/icons'
import Joi from 'joi';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { fetchFoodDetails, fetchFoodDetailsByUsers, fetchUser } from '../../redux/action';
import { useParams } from 'react-router-dom';



export const EditModal = ({detail,fetchFoodDetails,fetchFoodDetailsByUsers}) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [cookies, setCookie] = useCookies(["user"]);
  const toast = useToast()
  const {id}=useParams();

  const [foodDetails, setFoodDetails] = useState({
    name:'',
    calorie:'',
    price:''
  })

  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    calorie:Joi.number().min(.01).max(100).allow('').optional(),
    price:Joi.number().min(.02).max(10),
  });
  console.log(foodDetails)

  useEffect(() => {
    setFoodDetails({
      name:detail.name,
      price:detail.price,
      calorie:detail.calorie
    })
  }, [detail])

  const saveDetails=(foodId)=>{
    setFoodDetails({...foodDetails,name:foodDetails.name.trim(),price:Number(foodDetails.price),calorie:Number(foodDetails.calorie)})
    const result = schema.validate(foodDetails);

console.log(result); 
const { error } = result;

if (!error) {
  axios.put(`http://localhost:3001/food/${foodId}/update`,foodDetails,{
                headers:{
                  jwt: cookies.token
                }
            })
  .then((data)=>{
    toast({
      title: 'food details updated successfully.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })  
    onClose()
    fetchFoodDetailsByUsers(cookies,id,1)
    // clearFoodDetails()
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
    <div>
      <Box onClick={onOpen}>Edit Detail </Box>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl>
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
            <Button colorScheme='blue' mr={3} onClick={()=>saveDetails(detail.id)}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      fetchFoodDetailsByUsers: (cookie,id,pg) => dispatch(fetchFoodDetailsByUsers(cookie,id,pg)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditModal)