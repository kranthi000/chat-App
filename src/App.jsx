// import React from 'react'

// const App = () => {
//   return (
//     <div>App</div>
//   )
// }

// export default App




import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import routes from './routes/Routes'

const App = () => {
  return (
    <>
        <Toaster position="top-right" />
        <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

export default App