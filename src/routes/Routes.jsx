import {createBrowserRouter} from 'react-router-dom'
import Otp from '../components/otp/Otp';
import Login from '../components/login/Login';
import Register from '../components/register/Register';
import ChatFlow from '../components/ChatFlow/ChatFlow';

const routes=createBrowserRouter([
    {
        path:"/",
        element:<Login></Login>

},
{
    path:"/register",
    element:<Register></Register>
},{
    path:"/verify-otp",
    element:<Otp></Otp>
},{
    path:"/chat",
    element:<ChatFlow></ChatFlow>
}
])
export default routes
