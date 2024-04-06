import './App.css';
import Nav from './Components/nav';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Footer from './Components/footer';
import SignUp from './Components/signup';
import PrivateComponent from './Components/privatecomponent'
import Login from './Components/login'
import AddProduct from './Components/add_product';
import ProductList from './Components/product_list';
import UpdateProduct from './Components/update';

function App() {
  return (
    <div className="App">
      <BrowserRouter >
      <Nav />
     <Routes>
       <Route element={<PrivateComponent />}>
       <Route path="/" element={<ProductList />} />
       <Route path="/add" element={<AddProduct />} />
       <Route path="/update/:id" element={<UpdateProduct />} />
       <Route path="/logout" element={<h1> Logout Component</h1>} />
       </Route>

       <Route path="/signup" element={<SignUp />} />
       <Route path="/login" element={<Login />} />

     </Routes>
     </BrowserRouter>
     <Footer />
    </div>
  );
}

export default App;