console.log("Register script loaded")

import supabase from '../supabaseClient.js'

export async function completeRegistration(newUserEmail, newUserPassword, newUserFullName, newUserDayOfBirth) {
  try {
    // 1. Benutzer registrieren
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
      options: {
        data: {
          full_name: newUserFullName,
          day_of_birth: newUserDayOfBirth
        }
      }
    })

    if (authError) throw authError

    console.log('User registered successfully:', authData.user)
    
    // 2. Profil erstellen (ohne Anmeldung)
    // Wenn Email-Verifikation aktiv ist, wird der User erst nach Verifikation eingeloggt
    if (authData.user) {
      const formattedDate = newUserDayOfBirth ? new Date(newUserDayOfBirth).toISOString().split('T')[0] : null
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            email: newUserEmail,
            role: 'user',
            full_name: newUserFullName,
            day_of_birth: formattedDate,
            subscription_plan: 'free'
          }
        ])
        .select()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Wir werfen diesen Fehler nicht, da der Benutzer bereits in auth erstellt wurde
      } else {
        console.log('Profile created successfully:', profileData)
      }
    }

    return authData
    
  } catch (error) {
    console.error('Complete registration failed:', error)
    throw error
  }
}