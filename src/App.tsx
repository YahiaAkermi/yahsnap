import AuthLayout from './_auth/AuthLayout'
import SignInForm from './_auth/forms/SignInForm'
import SignUpForm from './_auth/forms/SignUpForm'
import RootLayout from './_root/RootLayout'
import Home from './_root/pages/Home'
import './globals.css'
import { Routes,Route } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { AllUsers, CreatePost, EditPost, Explore, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages'


const App = () => {
  return (
    <main className='flex h-screen'>
           <Routes>
            {/* public Routes */}
            <Route element={<AuthLayout/>}>
                <Route path='/sign-in' element={<SignInForm/>} />
                <Route path='/sign-up' element={<SignUpForm/>} />
            </Route>
            

            {/* private Routes */}
            <Route element={<RootLayout/>}>
                <Route index  element={<Home/>} />
                <Route path='/explore' element={<Explore/>} />
                <Route path='/saved' element={<Saved/>} />
                <Route path='/all-users' element={<AllUsers/>} />
                <Route path='/create-post' element={<CreatePost/>} />
                <Route path='/update-post/:id' element={<EditPost/>} />
                <Route path='/posts/:id' element={<PostDetails/>} />
                <Route path='/profile/:id/*' element={<Profile/>} />
                <Route path='/update-profile/:id' element={<UpdateProfile/>} />
            </Route>

           </Routes>  

           <Toaster/>
    </main>
  )
}

export default App