// import {createRoot} from 'react-dom/client'
// import App from './App'

// createRoot(document.getElementById("root")).render(<App></App>)


import { createRoot} from "react-dom/client"
import App from './App'
import {Provider} from 'react-redux'
import {store} from './store'
 import './styles/style.css'

createRoot(document.getElementById("root")).render(<Provider store={store}>
    <App></App>

</Provider>
)