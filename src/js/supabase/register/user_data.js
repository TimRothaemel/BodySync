// user_data.js
console.log("user_data.js loaded")

import supabase from '../supabaseClient.js'

export async function createUserData(userId, height, startWeight, targetWeight) {
  try {
    const { data: userData, error: userDataError } = await supabase
      .from('user_data')
      .insert([
        {
          user_id: userId,
          height: parseInt(height),
          start_weight: parseFloat(startWeight),
          target_weight: parseFloat(targetWeight),
          current_weight: parseFloat(startWeight),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (userDataError) throw userDataError

    console.log('User data created successfully:', userData)
    return {
      success: true,
      userData: userData
    }
    
  } catch (error) {
    console.error('User data creation failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}