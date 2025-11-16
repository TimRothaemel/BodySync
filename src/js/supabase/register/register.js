console.log("Register script loaded");

import supabase from '../supabaseClient.js'

let newUserEmail 
let newUserPassword 
let newUserFullName 
let newUserDayOfBirth

export async function signUpUser(newUserEmailInput, newUserPasswordInput, newUserFullNameInput, newUserDayOfBirthInput) {
  const { data, error } = await supabase.auth.signUp({
  email: newUserEmail,
  password: newUserPassword,
    data: { 
        role: 'user', 
        full_name: newUserFullName,
        subscription_plan: 'free',
        day_of_birth: newUserDayOfBirth
    }  
  
})
    if (error) {   
        console.error('Error signing up:', error.message)
    } else {
        console.log('User signed up successfully:')
    }
}
export async function insertUserData(){
    .from('profiles')
    .insert([
      { id: user.id, 
        email: newUserEmail,
        role: 'user',
        full_name: newUserFullName, 
        day_of_birth: newUserDayOfBirth,
        subscription_plan: 'free'
    }
    ])
}