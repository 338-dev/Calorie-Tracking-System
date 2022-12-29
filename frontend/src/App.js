import './App.css';
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Login from './Component/Authentication/Login';
import Registration from './Component/Authentication/Registration';
import { ChakraProvider } from '@chakra-ui/react'
import Home from './Component/Home/Home';
import Protected from './Component/Protected/Protected';

function App() {
  return (
    <ChakraProvider className="App">
      <Router>
        <Routes>
            <Route exact index path='/login' element={< Login />}></Route>
            <Route exact path='/register' element={< Registration/>}></Route>
            <Route exact path='/' element={<Protected Element={<Home/>} />}></Route>

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
