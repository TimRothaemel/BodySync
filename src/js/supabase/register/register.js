console.log("Register script loaded")

import supabase from '../supabaseClient.js'

export async function registerUser(email, password, fullName, dayOfBirth) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          day_of_birth: dayOfBirth
        }
      }
    })

    if (authError) throw authError

    console.log('User registered successfully:', authData.user)
    
    return {
      success: true,
      user: authData.user,
      session: authData.session
    }
    
  } catch (error) {
    console.error('Registration failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}