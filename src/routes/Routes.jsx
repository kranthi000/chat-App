import {createBrowserRouter} from 'react-router-dom'
import Otp from '../components/otp/Otp';
import Login from '../components/login/Login';
import Register from '../components/register/Register';

const routes=createBrowserRouter([
    {
        path:"/",
        element:<Login></Login>

},
{
    path:"/register",
    element:<Register></Register>
},{
    path:"/otp",
    element:<Otp></Otp>
}
])
export default routes
