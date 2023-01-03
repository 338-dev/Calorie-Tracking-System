import { Button, Center, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { AddIcon, LinkIcon } from '@chakra-ui/icons'
import Joi from 'joi';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { fetchFoodDetails, fetchUser } from '../../redux/action';

export const InviteFriend = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
    const [cookies, setCookie] = useCookies(["user"]);
    const toast = useToast()
    const [userDetails, setUserDetails] = useState({
      name:'',
      email:'',
    })
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().max(30).email({ tlds: { allow: false } }).required(),
    });

    const createLink=()=>{
      const result = schema.validate(userDetails);
  
  console.log(result); 
  const { error } = result;

  if (!error) {
    axios.post('http://localhost:3001/food/inviteFriend',userDetails,{
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
    })}
    }
  return (
    <div>
      <Button onClick={onOpen}>
          <LinkIcon/>Invite friend
          </Button>
      {/* </Center> */}
  
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={()=>{onClose()}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invite friend</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <FormControl isRequired>
  <FormLabel>Name</FormLabel>
  <Input placeholder='User Name' value={userDetails.name} onChange={(e)=>setUserDetails({...userDetails,name:e.target.value})}/>

  <FormLabel>Email</FormLabel>
  <Input placeholder='User Email' type='email' value={userDetails.email} onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})}/>

  
</FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={()=>createLink()}>
                Create Link
              </Button>
              <Button onClick={()=>{onClose()}}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriend)